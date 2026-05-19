import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useProgressStore } from "@/store/useProgressStore";
import { getLanguageByCode } from "@/data/languages";
import { getUnitsByLanguage } from "@/data/units";
import { getLessonsByLanguage, getLessonsByUnit } from "@/data/lessons";
import { images } from "@/constants/images";
import type { Lesson } from "@/types/learning";

type TabType = "lessons" | "practice";
type LessonStatus = "completed" | "in_progress" | "available";

// Mock initial progress per language — shown when no real store progress exists.
const MOCK_PROGRESS: Record<string, { completed: string[]; inProgress: string }> = {
  es: { completed: ["es-lesson-1"], inProgress: "es-lesson-2" },
  fr: { completed: ["fr-lesson-1"], inProgress: "fr-lesson-2" },
  ja: { completed: ["ja-lesson-1"], inProgress: "ja-lesson-2" },
  de: { completed: ["de-lesson-1"], inProgress: "de-lesson-2" },
  pt: { completed: ["pt-lesson-1"], inProgress: "pt-lesson-2" },
};

export default function LearnScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("lessons");
  const router = useRouter();

  const {
    selectedLanguage,
    completedLessonIds,
    inProgressLessonId,
    setInProgressLesson,
  } = useProgressStore();

  const lang = selectedLanguage ? getLanguageByCode(selectedLanguage) : null;
  const units = selectedLanguage ? getUnitsByLanguage(selectedLanguage) : [];
  const allLessons = selectedLanguage ? getLessonsByLanguage(selectedLanguage) : [];

  if (!lang || !units.length) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.emptyState}>
          <Ionicons name="language-outline" size={52} color="#c4b5fd" />
          <Text style={styles.emptyTitle}>No language selected</Text>
          <Text style={styles.emptySubtitle}>Go to Home to pick a language.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const mock = MOCK_PROGRESS[selectedLanguage!] ?? null;
  const hasRealProgress =
    completedLessonIds.length > 0 || inProgressLessonId !== null;

  const getStatus = (lessonId: string): LessonStatus => {
    if (completedLessonIds.includes(lessonId)) return "completed";
    if (inProgressLessonId === lessonId) return "in_progress";
    // Fall back to mock when user hasn't interacted with lessons yet.
    if (!hasRealProgress && mock) {
      if (mock.completed.includes(lessonId)) return "completed";
      if (mock.inProgress === lessonId) return "in_progress";
    }
    return "available";
  };

  // Determine the header unit: the one containing the in-progress lesson.
  const activeInProgressId =
    inProgressLessonId ?? (!hasRealProgress ? mock?.inProgress : undefined);
  const headerUnit =
    units.find((u) => u.lessonIds.includes(activeInProgressId ?? "")) ??
    units[0];

  const completedCount = allLessons.filter(
    (l) => getStatus(l.id) === "completed",
  ).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f6ff" }}>
      {/* ── Unit Hero Header ── */}
      <View style={styles.hero}>
        <View style={styles.heroLeft}>
          <View style={styles.langBadge}>
            <Text style={styles.langFlag}>{lang.flag}</Text>
            <Text style={styles.langName}>{lang.name}</Text>
          </View>
          <Text style={styles.heroTitle} numberOfLines={2}>
            {headerUnit.title}
          </Text>
          <Text style={styles.heroMeta}>
            Unit {headerUnit.orderIndex} · {completedCount}/{allLessons.length}{" "}
            lessons
          </Text>
        </View>
        <Image
          source={images.mascot}
          style={styles.mascotImg}
          resizeMode="contain"
        />
      </View>

      {/* ── Tabs ── */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "lessons" && styles.tabActive]}
          onPress={() => setActiveTab("lessons")}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "lessons" && styles.tabTextActive,
            ]}
          >
            Lessons
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "practice" && styles.tabActive]}
          onPress={() => setActiveTab("practice")}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "practice" && styles.tabTextActive,
            ]}
          >
            Practice
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "lessons" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {units.map((unit) => {
            const unitLessons = getLessonsByUnit(unit.id);
            if (!unitLessons.length) return null;
            const unitDone = unitLessons.filter(
              (l) => getStatus(l.id) === "completed",
            ).length;

            return (
              <View key={unit.id} style={styles.unitSection}>
                {/* Unit label row */}
                <View style={styles.unitLabelRow}>
                  <View
                    style={[styles.unitDot, { backgroundColor: unit.color }]}
                  />
                  <Text style={styles.unitLabelText}>{unit.title}</Text>
                  <Text style={styles.unitLabelMeta}>
                    {unitDone}/{unitLessons.length}
                  </Text>
                </View>

                {/* Lesson cards */}
                <View style={styles.lessonCard}>
                  {unitLessons.map((lesson, idx) => {
                    const status = getStatus(lesson.id);
                    const globalNum =
                      allLessons.findIndex((l) => l.id === lesson.id) + 1;
                    return (
                      <LessonRow
                        key={lesson.id}
                        lesson={lesson}
                        lessonNumber={globalNum}
                        status={status}
                        isLast={idx === unitLessons.length - 1}
                        onPress={() => {
                          setInProgressLesson(lesson.id);
                          router.push(`/lesson/${lesson.id}`);
                        }}
                      />
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.practiceEmpty}>
          <Ionicons name="barbell-outline" size={52} color="#c4b5fd" />
          <Text style={styles.practiceTitle}>Practice coming soon</Text>
          <Text style={styles.practiceSubtitle}>
            Reinforce what you've learned with spaced repetition exercises.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// ── LessonRow ─────────────────────────────────────────────────────────────────

interface LessonRowProps {
  lesson: Lesson;
  lessonNumber: number;
  status: LessonStatus;
  isLast: boolean;
  onPress: () => void;
}

function LessonRow({
  lesson,
  lessonNumber,
  status,
  isLast,
  onPress,
}: LessonRowProps) {
  // Deterministic Picsum thumbnail per lesson for the "in progress" card.
  const thumbUri = `https://picsum.photos/seed/${lesson.id}/80/80`;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.lessonRow,
          status === "in_progress" && styles.lessonRowInProgress,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.lessonContent}>
          <Text style={styles.lessonNumLabel}>Lesson {lessonNumber}</Text>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          {status === "in_progress" && (
            <Text style={styles.inProgressLabel}>In progress</Text>
          )}
          <Text style={styles.lessonMeta}>
            {lesson.vocabulary.length} words · {lesson.xpReward} XP
          </Text>
        </View>

        {status === "completed" && (
          <View style={styles.completedCircle}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
        )}

        {status === "in_progress" && (
          <Image
            source={{ uri: thumbUri }}
            style={styles.lessonThumb}
          />
        )}

        {status === "available" && <View style={styles.availableCircle} />}
      </TouchableOpacity>

      {!isLast && <View style={styles.rowDivider} />}
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#001328",
  },
  emptySubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },

  // Hero header
  hero: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 18,
    backgroundColor: "#f8f6ff",
  },
  heroLeft: {
    flex: 1,
    paddingRight: 12,
    gap: 3,
  },
  langBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  langFlag: {
    fontSize: 22,
  },
  langName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#6c4ef5",
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: "#001328",
    lineHeight: 34,
  },
  heroMeta: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  mascotImg: {
    width: 92,
    height: 112,
    marginBottom: -4,
  },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ece9f8",
    paddingHorizontal: 22,
  },
  tab: {
    paddingVertical: 13,
    paddingHorizontal: 2,
    marginRight: 28,
    borderBottomWidth: 2.5,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#6c4ef5",
  },
  tabText: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#9ca3af",
  },
  tabTextActive: {
    color: "#6c4ef5",
  },

  // Unit section
  unitSection: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  unitLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  unitDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  unitLabelText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#001328",
    flex: 1,
  },
  unitLabelMeta: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#9ca3af",
  },

  // Lesson card container
  lessonCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ece9f8",
    overflow: "hidden",
  },

  // Lesson row
  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: "#ffffff",
  },
  lessonRowInProgress: {
    backgroundColor: "#f0eeff",
  },
  lessonContent: {
    flex: 1,
    paddingRight: 10,
  },
  lessonNumLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#9ca3af",
    marginBottom: 1,
  },
  lessonTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#001328",
  },
  inProgressLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#6c4ef5",
    marginTop: 2,
  },
  lessonMeta: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },

  // Status indicators
  completedCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#58CC02",
    justifyContent: "center",
    alignItems: "center",
  },
  lessonThumb: {
    width: 58,
    height: 58,
    borderRadius: 12,
  },
  availableCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },

  // Divider between lesson rows
  rowDivider: {
    height: 1,
    backgroundColor: "#f5f3fc",
    marginHorizontal: 18,
  },

  // Practice empty state
  practiceEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  practiceTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#001328",
  },
  practiceSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },
});
