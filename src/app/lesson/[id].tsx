import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getLessonById } from "@/data/lessons";
import { getLanguageByCode } from "@/data/languages";
import { images } from "@/constants/images";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_SIZE = SCREEN_WIDTH - 36;

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const lesson = getLessonById(id as string);
  const lang = lesson ? getLanguageByCode(lesson.languageCode) : null;

  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);

  if (!lesson || !lang) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={52} color="#c4b5fd" />
          <Text style={styles.errorText}>Lesson not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const teacherMessage =
    lesson.aiTeacherPrompt?.openingMessage ??
    `Let's learn ${lang.name} together! I'm your AI teacher.`;

  // Trim opening message to the first sentence for the bubble.
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
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.headerIconGroup}>
            <Ionicons name="videocam-outline" size={20} color="#001328" />
            <Text style={styles.headerCount}>12</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color="#001328" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Teacher Preview Card ── */}
      <View style={styles.teacherCard}>
        {/* User camera PIP */}
        <View style={styles.userPip}>
          <Image
            source={{
              uri: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y&s=120",
            }}
            style={styles.userPipImage}
          />
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
          {lang.flag}{"  "}{lang.name}
        </Text>
        <Text style={styles.sessionTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
      </View>

      {/* ── Controls ── */}
      <View style={styles.controls}>
        <ControlButton icon="videocam-outline" label="Camera" />
        <ControlButton
          icon={isMuted ? "mic-off-outline" : "mic-outline"}
          label="Mic"
          dimmed={isMuted}
          onPress={() => setIsMuted(!isMuted)}
        />
        <SubtitlesButton
          active={showSubtitles}
          onPress={() => setShowSubtitles(!showSubtitles)}
        />
        <ControlButton
          icon="call-outline"
          label="End Call"
          isEndCall
          onPress={() => router.back()}
        />
      </View>

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
  backBtn: {
    padding: 4,
  },
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
    backgroundColor: "#21c16b",
  },
  onlineText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#21c16b",
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
  userPipImage: {
    width: "100%",
    height: "100%",
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
  speakerBtn: {
    padding: 2,
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
  ctrlWrap: {
    alignItems: "center",
    gap: 7,
  },
  ctrlBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#2d2d3f",
    justifyContent: "center",
    alignItems: "center",
  },
  ctrlBtnEnd: {
    backgroundColor: "#ff4d4f",
  },
  ctrlBtnDimmed: {
    backgroundColor: "#9ca3af",
  },
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
  endCallIconRotate: {
    transform: [{ rotate: "135deg" }],
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
  feedbackItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  feedbackLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#9ca3af",
  },
  feedbackValue: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
  },
  feedbackDivider: {
    width: 1,
    height: 38,
    backgroundColor: "#ece9f8",
  },
});
