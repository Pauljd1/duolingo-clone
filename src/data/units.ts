import type { Unit } from "@/types/learning";

export const units: Unit[] = [
  // ── Spanish ────────────────────────────────────────────────────────────────
  {
    id: "es-unit-1",
    languageCode: "es",
    title: "Basics",
    description: "Greetings, introductions, and everyday essentials.",
    color: "#58CC02",
    orderIndex: 1,
    lessonIds: ["es-lesson-1", "es-lesson-2", "es-lesson-3"],
  },
  {
    id: "es-unit-2",
    languageCode: "es",
    title: "Family & People",
    description: "Talk about the people in your life.",
    color: "#FF9600",
    orderIndex: 2,
    lessonIds: ["es-lesson-4", "es-lesson-5"],
  },

  // ── French ─────────────────────────────────────────────────────────────────
  {
    id: "fr-unit-1",
    languageCode: "fr",
    title: "Basics",
    description: "Greetings, introductions, and everyday essentials.",
    color: "#58CC02",
    orderIndex: 1,
    lessonIds: ["fr-lesson-1", "fr-lesson-2", "fr-lesson-3"],
  },
  {
    id: "fr-unit-2",
    languageCode: "fr",
    title: "Food & Drink",
    description: "Order at a café and navigate a French menu.",
    color: "#CE82FF",
    orderIndex: 2,
    lessonIds: ["fr-lesson-4", "fr-lesson-5"],
  },

  // ── Japanese ───────────────────────────────────────────────────────────────
  {
    id: "ja-unit-1",
    languageCode: "ja",
    title: "Basics",
    description: "Greetings, numbers, and simple phrases.",
    color: "#58CC02",
    orderIndex: 1,
    lessonIds: ["ja-lesson-1", "ja-lesson-2", "ja-lesson-3"],
  },

  // ── German ─────────────────────────────────────────────────────────────────
  {
    id: "de-unit-1",
    languageCode: "de",
    title: "Basics",
    description: "Greetings, introductions, and everyday essentials.",
    color: "#58CC02",
    orderIndex: 1,
    lessonIds: ["de-lesson-1", "de-lesson-2", "de-lesson-3"],
  },

  // ── Portuguese ─────────────────────────────────────────────────────────────
  {
    id: "pt-unit-1",
    languageCode: "pt",
    title: "Basics",
    description: "Greetings, introductions, and everyday essentials.",
    color: "#58CC02",
    orderIndex: 1,
    lessonIds: ["pt-lesson-1", "pt-lesson-2", "pt-lesson-3"],
  },
];

export function getUnitsByLanguage(languageCode: string): Unit[] {
  return units
    .filter((u) => u.languageCode === languageCode)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getUnitById(id: string): Unit | undefined {
  return units.find((u) => u.id === id);
}
