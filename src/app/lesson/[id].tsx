import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  useCallStateHooks,
  type Call,
} from "@stream-io/video-react-native-sdk";

import { getLessonById } from "@/data/lessons";
import { getLanguageByCode } from "@/data/languages";
import { images } from "@/constants/images";
import {
  STREAM_API_KEY,
  AGENT_USER_ID,
  fetchStreamToken,
  startAgent,
  stopAgent,
} from "@/lib/stream";

type CallStatus = "idle" | "connecting" | "joined" | "ended" | "error";
export type AgentStatus = "idle" | "connecting" | "connected" | "failed";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_SIZE = SCREEN_WIDTH - 36;

// ── LessonScreen (outer) ──────────────────────────────────────────────────────

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();

  const lesson = getLessonById(id as string);
  const lang = lesson ? getLanguageByCode(lesson.languageCode) : null;

  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [streamClient, setStreamClient] = useState<StreamVideoClient | null>(null);
  const [streamCall, setStreamCall] = useState<Call | null>(null);

  // Keep refs so cleanup closures always see the latest values.
  const callRef = useRef<Call | null>(null);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const callIdRef = useRef<string>("");
  const agentSessionIdRef = useRef<string>("");
  const agentStoppedRef = useRef(false);

  const stopAgentOnce = useCallback(async (callId: string, sessionId: string) => {
    if (agentStoppedRef.current || !callId || !sessionId) return;
    agentStoppedRef.current = true;
    await stopAgent(callId, sessionId).catch(() => {});
  }, []);

  const joinCall = useCallback(async () => {
    if (!user || !lesson) return;

    setCallStatus("connecting");
    setAgentStatus("idle");
    agentStoppedRef.current = false;
    setError(null);

    try {
      console.log("[lesson] step 1 — fetching token for", user.id);
      const token = await fetchStreamToken(user.id);

      console.log("[lesson] step 2 — creating Stream client");
      const client = StreamVideoClient.getOrCreateInstance({
        apiKey: STREAM_API_KEY,
        user: {
          id: user.id,
          name: user.fullName ?? user.username ?? user.id,
          image: user.imageUrl ?? undefined,
        },
        token,
      });

      // One room per lesson-user pair so sessions stay private.
      const callId = `lesson-${lesson.id}-${user.id}`.slice(0, 64);
      callIdRef.current = callId;
      const call = client.call("audio_room", callId);

      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone permission",
            message: "The AI teacher needs your microphone to hear you speak.",
            buttonPositive: "Allow",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error("Microphone permission denied");
        }
      }

      // Pack the full lesson context into the call's custom data.  The Python
      // agent can read this from the Stream call state if needed.
      const vocabSnapshot = lesson.vocabulary
        .slice(0, 10)
        .map((v) => `${v.word}:${v.translation}`)
        .join("|");
      const phraseSnapshot = lesson.phrases
        .slice(0, 6)
        .map((p) => `${p.phrase}:${p.translation}`)
        .join("|");

      console.log("[lesson] step 3 — joining call", callId);
      await call.join({
        create: true,
        data: {
          custom: {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            languageCode: lesson.languageCode,
            systemPrompt: lesson.aiTeacherPrompt?.systemPrompt ?? "",
            openingMessage: lesson.aiTeacherPrompt?.openingMessage ?? "",
            teachingGoals: JSON.stringify(lesson.aiTeacherPrompt?.teachingGoals ?? []),
            vocabulary: vocabSnapshot,
            phrases: phraseSnapshot,
          },
        },
      });
      console.log("[lesson] step 4 — joined");

      // Put the call in live mode so the agent can publish audio.
      // audio_room calls are live by default, but this is belt-and-suspenders.
      try {
        await call.goLive();
        console.log("[lesson] step 5 — goLive ok");
      } catch {
        console.log("[lesson] step 5 — goLive skipped (already live)");
      }

      callRef.current = call;
      clientRef.current = client;
      setStreamClient(client);
      setStreamCall(call);
      setCallStatus("joined");

      // Step 6: trigger the Vision Agent to join the call.
      console.log("[lesson] step 6 — starting Vision Agent");
      setAgentStatus("connecting");
      try {
        const sessionId = await startAgent(callId, lesson.id);
        agentSessionIdRef.current = sessionId;
        console.log("[lesson] step 6 — agent session started:", sessionId);
      } catch (agentErr) {
        console.warn("[lesson] agent start failed:", agentErr);
        setAgentStatus("failed");
      }
    } catch (err) {
      console.error("[LessonScreen] joinCall error:", err);
      setError("Could not connect to the lesson. Please try again.");
      setCallStatus("error");
    }
  }, [user, lesson]);

  // Auto-join on mount; clean up on unmount.
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!mounted) return;
      await joinCall();
    };

    init();

    return () => {
      mounted = false;
      stopAgentOnce(callIdRef.current, agentSessionIdRef.current);
      callRef.current?.leave().catch(() => {});
      clientRef.current?.disconnectUser().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEndCall = useCallback(async () => {
    await stopAgentOnce(callIdRef.current, agentSessionIdRef.current);
    try {
      await callRef.current?.leave();
    } catch {
      // leave is best-effort
    }
    router.back();
  }, [router, stopAgentOnce]);

  if (!lesson || !lang) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={52} color="#c4b5fd" />
          <Text style={styles.errorText}>Lesson not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Once client & call are ready, hand off to the connected UI (which needs
  // the Stream providers to use call-state hooks).
  if (streamClient && streamCall && callStatus === "joined") {
    return (
      <StreamVideo client={streamClient}>
        <StreamCall call={streamCall}>
          <Stack.Screen options={{ headerShown: false }} />
          <ConnectedLessonUI
            lesson={lesson}
            lang={lang}
            userImageUrl={user?.imageUrl ?? null}
            showSubtitles={showSubtitles}
            onToggleSubtitles={() => setShowSubtitles((v) => !v)}
            onEndCall={handleEndCall}
            agentStatus={agentStatus}
            onAgentStatusChange={setAgentStatus}
          />
        </StreamCall>
      </StreamVideo>
    );
  }

  // Connecting / error / idle states share one simple screen.
  const isError = callStatus === "error";
  const teacherMessage =
    lesson.aiTeacherPrompt?.openingMessage ??
    `Let's learn ${lang.name} together!`;
  const firstSentenceEnd = teacherMessage.search(/[.!?]/);
  const bubbleText =
    firstSentenceEnd !== -1
      ? teacherMessage.slice(0, firstSentenceEnd + 1)
      : teacherMessage.slice(0, 60);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color="#001328" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AI Teacher</Text>
          <View style={styles.onlineBadge}>
            <View
              style={[
                styles.onlineDot,
                isError && { backgroundColor: "#ff4d4f" },
              ]}
            />
            <Text
              style={[
                styles.onlineText,
                isError && { color: "#ff4d4f" },
              ]}
            >
              {isError ? "Connection failed" : "Connecting…"}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight} />
      </View>

      {/* ── Teacher Preview Card ── */}
      <View style={[styles.teacherCard, { justifyContent: "center" }]}>
        <Image
          source={images.mascot}
          style={styles.mascotImage}
          resizeMode="contain"
        />

        {/* Overlay: connecting spinner or error */}
        <View style={styles.connectingOverlay}>
          {isError ? (
            <View style={styles.overlayInner}>
              <Ionicons name="alert-circle" size={36} color="#ff4d4f" />
              <Text style={styles.overlayText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={joinCall}
                activeOpacity={0.8}
              >
                <Text style={styles.retryBtnText}>Try again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.overlayInner}>
              <ActivityIndicator size="large" color="#6c4ef5" />
              <Text style={styles.overlayText}>Connecting to lesson…</Text>
            </View>
          )}
        </View>

        {/* Speech bubble */}
        <View style={styles.speechBubble}>
          <Text style={styles.speechBubbleText} numberOfLines={2}>
            {bubbleText}
          </Text>
          <View style={styles.speakerBtn}>
            <Ionicons name="volume-high" size={20} color="#6c4ef5" />
          </View>
        </View>
      </View>

      {/* ── Session Info ── */}
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionLang}>
          {lang.flag}
          {"  "}
          {lang.name}
        </Text>
        <Text style={styles.sessionTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ── ConnectedLessonUI ─────────────────────────────────────────────────────────
// Lives inside StreamVideo + StreamCall providers — safe to use call hooks.

type ConnectedLessonUIProps = {
  lesson: NonNullable<ReturnType<typeof getLessonById>>;
  lang: NonNullable<ReturnType<typeof getLanguageByCode>>;
  userImageUrl: string | null;
  showSubtitles: boolean;
  onToggleSubtitles: () => void;
  onEndCall: () => void;
  agentStatus: AgentStatus;
  onAgentStatusChange: (status: AgentStatus) => void;
};

function ConnectedLessonUI({
  lesson,
  lang,
  userImageUrl,
  showSubtitles,
  onToggleSubtitles,
  onEndCall,
  agentStatus,
  onAgentStatusChange,
}: ConnectedLessonUIProps) {
  const { useMicrophoneState, useParticipantCount, useParticipants } =
    useCallStateHooks();
  const { microphone, optimisticIsMute } = useMicrophoneState();
  const participantCount = useParticipantCount();
  const participants = useParticipants();

  // Detect when the Vision Agent participant joins/leaves.
  useEffect(() => {
    const agentJoined = participants.some((p) => p.userId === AGENT_USER_ID);
    if (agentJoined && agentStatus !== "connected") {
      onAgentStatusChange("connected");
    }
  }, [participants, agentStatus, onAgentStatusChange]);

  // If the agent hasn't joined within 30 s, surface a failure status so the
  // user isn't stuck on "Luna joining…" indefinitely (e.g. agent crashed).
  useEffect(() => {
    if (agentStatus !== "connecting") return;
    const timeout = setTimeout(() => {
      onAgentStatusChange("failed");
    }, 30_000);
    return () => clearTimeout(timeout);
  }, [agentStatus, onAgentStatusChange]);

  const handleMicToggle = useCallback(async () => {
    await microphone.toggle();
  }, [microphone]);

  const teacherMessage =
    lesson.aiTeacherPrompt?.openingMessage ??
    `Let's learn ${lang.name} together! I'm your AI teacher.`;
  const firstSentenceEnd = teacherMessage.search(/[.!?]/);
  const bubbleText =
    firstSentenceEnd !== -1
      ? teacherMessage.slice(0, firstSentenceEnd + 1)
      : teacherMessage.slice(0, 60);

  const agentDotColor =
    agentStatus === "connected"
      ? "#21c16b"
      : agentStatus === "failed"
        ? "#ff4d4f"
        : "#f59e0b";

  const agentLabel =
    agentStatus === "connected"
      ? "Luna connected"
      : agentStatus === "failed"
        ? "AI unavailable"
        : "Luna joining…";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onEndCall}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color="#001328" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AI Teacher</Text>
          {/* Call status row */}
          <View style={styles.onlineBadge}>
            <View style={[styles.onlineDot, { backgroundColor: "#21c16b" }]} />
            <Text style={[styles.onlineText, { color: "#21c16b" }]}>Live</Text>
            <View style={styles.headerDivider} />
            {/* Agent status indicator */}
            {agentStatus === "connecting" ? (
              <ActivityIndicator size={10} color="#f59e0b" />
            ) : (
              <View style={[styles.onlineDot, { backgroundColor: agentDotColor }]} />
            )}
            <Text style={[styles.onlineText, { color: agentDotColor }]}>
              {agentLabel}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.headerIconGroup}>
            <Ionicons name="people-outline" size={20} color="#001328" />
            <Text style={styles.headerCount}>{participantCount}</Text>
          </View>
        </View>
      </View>

      {/* ── Teacher Preview Card ── */}
      <View style={styles.teacherCard}>
        {/* User camera PIP */}
        <View style={styles.userPip}>
          <Image
            source={{
              uri:
                userImageUrl ??
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y&s=120",
            }}
            style={styles.userPipImage}
          />
          {optimisticIsMute && (
            <View style={styles.mutedPipBadge}>
              <Ionicons name="mic-off" size={10} color="#fff" />
            </View>
          )}
        </View>

        {/* Mascot */}
        <Image
          source={images.mascot}
          style={styles.mascotImage}
          resizeMode="contain"
        />

        {/* Speech bubble */}
        <View style={styles.speechBubble}>
          <Text style={styles.speechBubbleText} numberOfLines={2}>
            {bubbleText}
          </Text>
          <TouchableOpacity style={styles.speakerBtn} activeOpacity={0.7}>
            <Ionicons name="volume-high" size={20} color="#6c4ef5" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Session Info ── */}
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionLang}>
          {lang.flag}
          {"  "}
          {lang.name}
        </Text>
        <Text style={styles.sessionTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
      </View>

      {/* ── Controls ── */}
      <View style={styles.controls}>
        <ControlButton
          icon={optimisticIsMute ? "mic-off-outline" : "mic-outline"}
          label={optimisticIsMute ? "Unmute" : "Mute"}
          dimmed={optimisticIsMute}
          onPress={handleMicToggle}
        />
        <SubtitlesButton active={showSubtitles} onPress={onToggleSubtitles} />
        <ControlButton
          icon="call-outline"
          label="End Call"
          isEndCall
          onPress={onEndCall}
        />
      </View>

      {/* Speaking-while-muted hint */}
      {optimisticIsMute && (
        <View style={styles.mutedBanner}>
          <Ionicons name="mic-off" size={14} color="#fff" />
          <Text style={styles.mutedBannerText}>
            Your mic is muted — tap Unmute to speak
          </Text>
        </View>
      )}

      {/* ── Session Feedback ── */}
      <View style={styles.feedbackCard}>
        <View style={styles.feedbackItem}>
          <Text style={styles.feedbackLabel}>Speaking</Text>
          <Text style={[styles.feedbackValue, { color: "#21c16b" }]}>
            Excellent
          </Text>
        </View>
        <View style={styles.feedbackDivider} />
        <View style={styles.feedbackItem}>
          <Text style={styles.feedbackLabel}>Pronunciation</Text>
          <Text style={[styles.feedbackValue, { color: "#4d88ff" }]}>
            Great
          </Text>
        </View>
        <View style={styles.feedbackDivider} />
        <View style={styles.feedbackItem}>
          <Text style={styles.feedbackLabel}>Grammar</Text>
          <Text style={[styles.feedbackValue, { color: "#ff8a00" }]}>
            Good
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ── ControlButton ─────────────────────────────────────────────────────────────

type ControlButtonProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress?: () => void;
  isEndCall?: boolean;
  dimmed?: boolean;
};

function ControlButton({
  icon,
  label,
  onPress,
  isEndCall,
  dimmed,
}: ControlButtonProps) {
  return (
    <TouchableOpacity
      style={styles.ctrlWrap}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.ctrlBtn,
          isEndCall && styles.ctrlBtnEnd,
          dimmed && styles.ctrlBtnDimmed,
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color="#fff"
          style={isEndCall ? styles.endCallIconRotate : undefined}
        />
      </View>
      <Text style={styles.ctrlLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── SubtitlesButton ───────────────────────────────────────────────────────────

function SubtitlesButton({
  active,
  onPress,
}: {
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.ctrlWrap}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.ctrlBtn, !active && styles.ctrlBtnDimmed]}>
        <Text style={styles.subtitlesText}>Aa</Text>
      </View>
      <Text style={styles.ctrlLabel}>Subtitles</Text>
    </TouchableOpacity>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#6b7280",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  backBtn: { padding: 4 },
  headerCenter: {
    flex: 1,
    paddingLeft: 8,
    gap: 1,
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#001328",
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#f59e0b",
  },
  onlineText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#f59e0b",
  },
  headerDivider: {
    width: 1,
    height: 10,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  headerIconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerCount: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#001328",
  },

  // Teacher card
  teacherCard: {
    marginHorizontal: 18,
    borderRadius: 24,
    backgroundColor: "#f0eeff",
    height: CARD_SIZE * 0.82,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  userPip: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 70,
    height: 88,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 2.5,
    borderColor: "#ffffff",
  },
  userPipImage: { width: "100%", height: "100%" },
  mutedPipBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ff4d4f",
    justifyContent: "center",
    alignItems: "center",
  },
  mascotImage: {
    width: CARD_SIZE * 0.7,
    height: CARD_SIZE * 0.7,
    marginBottom: 56,
  },
  speechBubble: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  speechBubbleText: {
    flex: 1,
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#001328",
    lineHeight: 19,
  },
  speakerBtn: { padding: 2 },

  // Connecting overlay (sits on top of the card during pre-join states)
  connectingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(240,238,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayInner: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  overlayText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#001328",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 50,
    backgroundColor: "#6c4ef5",
  },
  retryBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#fff",
  },

  // Session info
  sessionInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 2,
    gap: 8,
  },
  sessionLang: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#6b7280",
  },
  sessionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#001328",
    flex: 1,
  },

  // Controls
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  ctrlWrap: { alignItems: "center", gap: 7 },
  ctrlBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#2d2d3f",
    justifyContent: "center",
    alignItems: "center",
  },
  ctrlBtnEnd: { backgroundColor: "#ff4d4f" },
  ctrlBtnDimmed: { backgroundColor: "#9ca3af" },
  ctrlLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#6b7280",
  },
  subtitlesText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#ffffff",
  },
  endCallIconRotate: { transform: [{ rotate: "135deg" }] },

  // Muted banner
  mutedBanner: {
    marginHorizontal: 18,
    marginBottom: 8,
    backgroundColor: "#ff4d4f",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  mutedBannerText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#fff",
  },

  // Feedback
  feedbackCard: {
    marginHorizontal: 18,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ece9f8",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },
  feedbackItem: { flex: 1, alignItems: "center", gap: 3 },
  feedbackLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#9ca3af",
  },
  feedbackValue: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
  },
  feedbackDivider: { width: 1, height: 38, backgroundColor: "#ece9f8" },
});
