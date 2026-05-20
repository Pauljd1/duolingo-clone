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
        <View className="flex-1 justify-center items-center gap-3">
          <Ionicons name="alert-circle-outline" size={52} color="#c4b5fd" />
          <Text className="font-medium text-base text-muted">Lesson not found.</Text>
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
      <View className="flex-row items-center px-4.5 pt-2 pb-3 bg-white">
        <TouchableOpacity
          className="p-1"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color="#001328" />
        </TouchableOpacity>

        <View className="flex-1 pl-2 gap-px">
          <Text className="font-semibold text-[17px] text-foreground">AI Teacher</Text>
          <View className="flex-row items-center gap-1">
            <View
              className={`w-1.75 h-1.75 rounded-full ${isError ? "bg-error" : "bg-amber-400"}`}
            />
            <Text className={`font-sans text-xs ${isError ? "text-error" : "text-amber-400"}`}>
              {isError ? "Connection failed" : "Connecting…"}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3.5" />
      </View>

      {/* ── Teacher Preview Card ── */}
      <View
        className="mx-4.5 rounded-3xl bg-[#f0eeff] overflow-hidden items-center justify-center"
        style={{ height: CARD_SIZE * 0.82 }}
      >
        <Image
          source={images.mascot}
          style={{ width: CARD_SIZE * 0.7, height: CARD_SIZE * 0.7, marginBottom: 56 }}
          resizeMode="contain"
        />

        {/* Overlay: connecting spinner or error */}
        <View
          className="justify-center items-center bg-[rgba(240,238,255,0.85)]"
          style={styles.connectingOverlay}
        >
          {isError ? (
            <View className="items-center gap-3 px-6">
              <Ionicons name="alert-circle" size={36} color="#ff4d4f" />
              <Text className="font-medium text-sm text-foreground text-center">{error}</Text>
              <TouchableOpacity
                className="mt-1 py-2.5 px-7 rounded-full bg-lingua-purple"
                onPress={joinCall}
                activeOpacity={0.8}
              >
                <Text className="font-semibold text-sm text-white">Try again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center gap-3 px-6">
              <ActivityIndicator size="large" color="#6c4ef5" />
              <Text className="font-medium text-sm text-foreground text-center">Connecting to lesson…</Text>
            </View>
          )}
        </View>

        {/* Speech bubble */}
        <View
          className="absolute bottom-3.5 left-3.5 right-3.5 bg-white/95 rounded-2xl flex-row items-center py-2.5 px-3.5 gap-2.5"
          style={styles.speechBubble}
        >
          <Text className="flex-1 font-medium text-[13px] text-foreground leading-4.75" numberOfLines={2}>
            {bubbleText}
          </Text>
          <View className="p-0.5">
            <Ionicons name="volume-high" size={20} color="#6c4ef5" />
          </View>
        </View>
      </View>

      {/* ── Session Info ── */}
      <View className="flex-row items-center px-5.5 pt-3 pb-0.5 gap-2">
        <Text className="font-sans text-sm text-muted">
          {lang.flag}
          {"  "}
          {lang.name}
        </Text>
        <Text className="font-semibold text-sm text-foreground flex-1" numberOfLines={1}>
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
      <View className="flex-row items-center px-4.5 pt-2 pb-3 bg-white">
        <TouchableOpacity
          className="p-1"
          onPress={onEndCall}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color="#001328" />
        </TouchableOpacity>

        <View className="flex-1 pl-2 gap-px">
          <Text className="font-semibold text-[17px] text-foreground">AI Teacher</Text>
          {/* Call status row */}
          <View className="flex-row items-center gap-1">
            <View className="w-1.75 h-1.75 rounded-full bg-lingua-green" />
            <Text className="font-sans text-xs text-lingua-green">Live</Text>
            <View className="w-px h-2.5 bg-border mx-0.5" />
            {/* Agent status indicator */}
            {agentStatus === "connecting" ? (
              <ActivityIndicator size={10} color="#f59e0b" />
            ) : (
              <View className="w-1.75 h-1.75 rounded-full" style={{ backgroundColor: agentDotColor }} />
            )}
            <Text className="font-sans text-xs" style={{ color: agentDotColor }}>
              {agentLabel}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3.5">
          <View className="flex-row items-center gap-1">
            <Ionicons name="people-outline" size={20} color="#001328" />
            <Text className="font-medium text-[13px] text-foreground">{participantCount}</Text>
          </View>
        </View>
      </View>

      {/* ── Teacher Preview Card ── */}
      <View
        className="mx-4.5 rounded-3xl bg-[#f0eeff] overflow-hidden items-center justify-end"
        style={{ height: CARD_SIZE * 0.82 }}
      >
        {/* User camera PIP */}
        <View className="absolute top-3.5 right-3.5 w-17.5 h-22 rounded-[14px] overflow-hidden border-[2.5px] border-white">
          <Image
            source={{
              uri:
                userImageUrl ??
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y&s=120",
            }}
            className="w-full h-full"
          />
          {optimisticIsMute && (
            <View className="absolute bottom-1 right-1 w-4.5 h-4.5 rounded-full bg-error justify-center items-center">
              <Ionicons name="mic-off" size={10} color="#fff" />
            </View>
          )}
        </View>

        {/* Mascot */}
        <Image
          source={images.mascot}
          style={{ width: CARD_SIZE * 0.7, height: CARD_SIZE * 0.7, marginBottom: 56 }}
          resizeMode="contain"
        />

        {/* Speech bubble */}
        <View
          className="absolute bottom-3.5 left-3.5 right-3.5 bg-white/95 rounded-2xl flex-row items-center py-2.5 px-3.5 gap-2.5"
          style={styles.speechBubble}
        >
          <Text className="flex-1 font-medium text-[13px] text-foreground leading-4.75" numberOfLines={2}>
            {bubbleText}
          </Text>
          <TouchableOpacity className="p-0.5" activeOpacity={0.7}>
            <Ionicons name="volume-high" size={20} color="#6c4ef5" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Session Info ── */}
      <View className="flex-row items-center px-5.5 pt-3 pb-0.5 gap-2">
        <Text className="font-sans text-sm text-muted">
          {lang.flag}
          {"  "}
          {lang.name}
        </Text>
        <Text className="font-semibold text-sm text-foreground flex-1" numberOfLines={1}>
          {lesson.title}
        </Text>
      </View>

      {/* ── Controls ── */}
      <View className="flex-row justify-evenly items-center px-4.5 py-4.5">
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
        <View className="mx-4.5 mb-2 bg-error rounded-[10px] flex-row items-center justify-center gap-1.5 py-1.75 px-3.5">
          <Ionicons name="mic-off" size={14} color="#fff" />
          <Text className="font-medium text-xs text-white">
            Your mic is muted — tap Unmute to speak
          </Text>
        </View>
      )}

      {/* ── Session Feedback ── */}
      <View className="mx-4.5 bg-white rounded-[18px] border border-[#ece9f8] flex-row items-center py-4.5">
        <View className="flex-1 items-center gap-0.75">
          <Text className="font-sans text-xs text-gray-400">Speaking</Text>
          <Text className="font-semibold text-[15px] text-lingua-green">
            Excellent
          </Text>
        </View>
        <View className="w-px h-9.5 bg-[#ece9f8]" />
        <View className="flex-1 items-center gap-0.75">
          <Text className="font-sans text-xs text-gray-400">Pronunciation</Text>
          <Text className="font-semibold text-[15px] text-lingua-blue">
            Great
          </Text>
        </View>
        <View className="w-px h-9.5 bg-[#ece9f8]" />
        <View className="flex-1 items-center gap-0.75">
          <Text className="font-sans text-xs text-gray-400">Grammar</Text>
          <Text className="font-semibold text-[15px] text-streak">
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
      className="items-center gap-1.75"
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View
        className={`w-15.5 h-15.5 rounded-full justify-center items-center ${
          isEndCall ? "bg-error" : dimmed ? "bg-gray-400" : "bg-[#2d2d3f]"
        }`}
      >
        <Ionicons
          name={icon}
          size={24}
          color="#fff"
          style={isEndCall ? styles.endCallIconRotate : undefined}
        />
      </View>
      <Text className="font-sans text-[11px] text-muted">{label}</Text>
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
      className="items-center gap-1.75"
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View className={`w-15.5 h-15.5 rounded-full justify-center items-center ${!active ? "bg-gray-400" : "bg-[#2d2d3f]"}`}>
        <Text className="font-bold text-lg text-white">Aa</Text>
      </View>
      <Text className="font-sans text-[11px] text-muted">Subtitles</Text>
    </TouchableOpacity>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
// Only shadow props, absoluteFillObject, and transform arrays remain here.

const styles = StyleSheet.create({
  speechBubble: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  connectingOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  endCallIconRotate: { transform: [{ rotate: "135deg" }] },
});
