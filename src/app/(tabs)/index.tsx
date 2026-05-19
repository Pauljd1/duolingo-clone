import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";

import { useProgressStore } from "@/store/useProgressStore";
import { getLanguageByCode } from "@/data/languages";
import { getUnitsByLanguage } from "@/data/units";
import { getLessonsByUnit } from "@/data/lessons";
import { images } from "@/constants/images";
import { usePostHog } from "posthog-react-native";

const DAILY_GOAL_XP = 20;
const DAILY_XP = 15;
const STREAK = 12;

const GREETINGS: Record<string, string> = {
  es: "Hola",
  fr: "Bonjour",
  ja: "こんにちは",
  de: "Hallo",
  pt: "Olá",
};

const TEACHER_PHOTO_URI = "https://i.pravatar.cc/120?img=47";

export default function HomeScreen() {
  const { user } = useUser();
  const { selectedLanguage } = useProgressStore();
  const posthog = usePostHog();

  const lang = selectedLanguage ? getLanguageByCode(selectedLanguage) : null;
  const units = selectedLanguage ? getUnitsByLanguage(selectedLanguage) : [];
  const unit = units[0];
  const lessons = unit ? getLessonsByUnit(unit.id) : [];

  if (!lang || !unit) return null;

  const firstName = user?.firstName ?? "Friend";
  const greeting = GREETINGS[selectedLanguage!] ?? "Hello";
  const progressPercent = `${Math.round((DAILY_XP / DAILY_GOAL_XP) * 100)}%` as `${number}%`;

  const planItems = [
    {
      id: "lesson",
      iconName: "book" as const,
      iconBg: "#ede9fe",
      iconColor: "#6c4ef5",
      title: "Lesson",
      subtitle: lessons[0]?.description ?? "Learn vocabulary",
      completed: true,
    },
    {
      id: "ai-conv",
      iconName: "headset" as const,
      iconBg: "#dbeafe",
      iconColor: "#3b82f6",
      title: "AI Conversation",
      subtitle: "Talk about your day",
      completed: false,
    },
    {
      id: "words",
      iconName: "sparkles" as const,
      iconBg: "#fee2e2",
      iconColor: "#ef4444",
      title: "New words",
      subtitle: `${lessons[0]?.vocabulary.length ?? 10} words`,
      completed: false,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text style={styles.greeting}>
              {greeting}, {firstName}! 👋
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.streakBadge}>
              <Image
                source={images.streakFire}
                style={styles.fireIcon}
                resizeMode="contain"
              />
              <Text style={styles.streakCount}>{STREAK}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} hitSlop={8}>
              <Ionicons name="notifications-outline" size={24} color="#001328" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* ── Daily Goal Card ── */}
          <View style={styles.dailyGoalCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>Daily goal</Text>
              <Text style={styles.xpText}>
                {DAILY_XP}{" "}
                <Text style={styles.xpTotal}>/ {DAILY_GOAL_XP} XP</Text>
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: progressPercent }]} />
              </View>
            </View>
            <Image
              source={images.treasure}
              style={styles.treasureImage}
              resizeMode="contain"
            />
          </View>

          {/* ── Continue Learning Card ── */}
          <View style={styles.continueCard}>
            <View style={styles.continueContent}>
              <Text style={styles.continueLabelText}>Continue learning</Text>
              <Text style={styles.continueLanguage}>{lang.name}</Text>
              <Text style={styles.continueUnit}>A1 · {unit.title}</Text>
              <TouchableOpacity
                style={styles.continueBtn}
                activeOpacity={0.85}
                onPress={() =>
                  posthog.capture("lesson_continued", {
                    language_code: selectedLanguage,
                    unit_title: unit.title,
                  })
                }
              >
                <Text style={styles.continueBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={images.palace}
              style={styles.palaceImage}
              resizeMode="contain"
            />
          </View>

          {/* ── Today's Plan ── */}
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{"Today's plan"}</Text>
              <TouchableOpacity activeOpacity={0.7} hitSlop={8}>
                <Text style={styles.viewAll}>View all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.planCard}>
              {planItems.map((item, index) => (
                <View key={item.id}>
                  {index > 0 && <View style={styles.planDivider} />}
                  <View style={styles.planRow}>
                    <View
                      style={[
                        styles.planIconBox,
                        { backgroundColor: item.iconBg },
                      ]}
                    >
                      <Ionicons
                        name={item.iconName}
                        size={20}
                        color={item.iconColor}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.planTitle}>{item.title}</Text>
                      <Text style={styles.planSubtitle} numberOfLines={1}>
                        {item.subtitle}
                      </Text>
                    </View>
                    {item.completed ? (
                      <View style={styles.checkCircle}>
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      </View>
                    ) : (
                      <View style={styles.emptyCircle} />
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* ── Next Up Card ── */}
          <View style={styles.nextUpCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextUpLabel}>Next up</Text>
              <Text style={styles.nextUpTitle}>AI Video Call</Text>
              <Text style={styles.nextUpSubtitle}>Practice speaking</Text>
            </View>
            <View style={styles.nextUpRight}>
              <Image
                source={{ uri: TEACHER_PHOTO_URI }}
                style={styles.teacherPhoto}
              />
              <TouchableOpacity
                style={styles.videoCallBtn}
                activeOpacity={0.85}
                onPress={() =>
                  posthog.capture("ai_video_call_started", {
                    language_code: selectedLanguage,
                  })
                }
              >
                <Ionicons name="videocam" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flag: {
    fontSize: 26,
  },
  greeting: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#001328",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  fireIcon: {
    width: 22,
    height: 22,
  },
  streakCount: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#001328",
  },

  // ── Layout ──────────────────────────────────────────────────────────────────
  content: {
    paddingHorizontal: 20,
    gap: 14,
  },

  // ── Daily Goal Card ─────────────────────────────────────────────────────────
  dailyGoalCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 20,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 20,
    paddingRight: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  xpText: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#001328",
    marginBottom: 12,
  },
  xpTotal: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#9ca3af",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#f3e0c0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    backgroundColor: "#ff9600",
    borderRadius: 4,
  },
  treasureImage: {
    width: 80,
    height: 80,
    marginBottom: -4,
  },

  // ── Continue Learning Card ───────────────────────────────────────────────────
  continueCard: {
    backgroundColor: "#5b3bf6",
    borderRadius: 24,
    minHeight: 172,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  continueContent: {
    flex: 1,
    padding: 22,
    paddingRight: 8,
  },
  continueLabelText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  continueLanguage: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: "#ffffff",
    lineHeight: 34,
  },
  continueUnit: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    marginTop: 3,
  },
  continueBtn: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 24,
    alignSelf: "flex-start",
    marginTop: 16,
  },
  continueBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#5b3bf6",
  },
  palaceImage: {
    width: 130,
    height: 172,
    position: "absolute",
    right: -6,
    bottom: 0,
  },

  // ── Today's Plan ────────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#001328",
  },
  viewAll: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#6c4ef5",
  },
  planCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#f0eef8",
    overflow: "hidden",
  },
  planDivider: {
    height: 1,
    backgroundColor: "#f5f3fc",
  },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  planIconBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  planTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#001328",
  },
  planSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6b7280",
    marginTop: 1,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#6c4ef5",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#d1d5db",
  },

  // ── Next Up Card ─────────────────────────────────────────────────────────────
  nextUpCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  nextUpLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 3,
  },
  nextUpTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#001328",
  },
  nextUpSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  nextUpRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  teacherPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  videoCallBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#21c16b",
    justifyContent: "center",
    alignItems: "center",
  },
});
