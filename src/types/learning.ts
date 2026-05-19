// ─── Languages ──────────────────────────────────────────────────────────────

export type LanguageCode = "es" | "fr" | "ja" | "de" | "pt";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
  learnerCount: string;
}

// ─── Vocabulary ──────────────────────────────────────────────────────────────

export interface VocabItem {
  id: string;
  word: string;
  translation: string;
  phonetic?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  usage?: string;
}

// ─── Phrases ─────────────────────────────────────────────────────────────────

export interface Phrase {
  id: string;
  phrase: string;
  translation: string;
  phonetic?: string;
  usage?: string;
}

// ─── Activities ───────────────────────────────────────────────────────────────

export type ActivityType =
  | "translate"      // translate a sentence from native lang
  | "multiple_choice" // pick correct translation
  | "match_pairs"    // drag/tap to match words with translations
  | "fill_blank"     // fill in the missing word
  | "listen_type"    // listen to audio and type what you hear
  | "speak"          // speak the phrase aloud (future)
  | "ai_conversation"; // free-form AI tutor chat (future)

export interface TranslateActivity {
  type: "translate";
  id: string;
  prompt: string;           // sentence in the user's native language
  correctAnswer: string;    // correct translation
  hints?: string[];         // word bank tokens for tap-to-build
}

export interface MultipleChoiceActivity {
  type: "multiple_choice";
  id: string;
  prompt: string;           // word/phrase to translate
  options: string[];        // 4 options, one correct
  correctIndex: number;
}

export interface MatchPairsActivity {
  type: "match_pairs";
  id: string;
  pairs: Array<{ left: string; right: string }>;
}

export interface FillBlankActivity {
  type: "fill_blank";
  id: string;
  sentence: string;         // use ___ for the blank
  correctAnswer: string;
  options?: string[];       // optional word-bank hints
}

export interface ListenTypeActivity {
  type: "listen_type";
  id: string;
  audioText: string;        // text that will be spoken (TTS)
  correctAnswer: string;
}

export type Activity =
  | TranslateActivity
  | MultipleChoiceActivity
  | MatchPairsActivity
  | FillBlankActivity
  | ListenTypeActivity;

// ─── Lessons ──────────────────────────────────────────────────────────────────

export type LessonType = "vocabulary" | "phrases" | "grammar" | "conversation" | "review";

export interface AITeacherPrompt {
  systemPrompt: string;         // Vision Agent system instructions for this lesson
  openingMessage: string;       // First message the AI teacher sends
  teachingGoals: string[];      // What the AI teacher should cover
}

export interface Lesson {
  id: string;
  unitId: string;
  languageCode: LanguageCode;
  title: string;
  description: string;
  type: LessonType;
  xpReward: number;
  estimatedMinutes: number;
  vocabulary: VocabItem[];
  phrases: Phrase[];
  activities: Activity[];
  aiTeacherPrompt?: AITeacherPrompt; // populated for AI audio/video lessons
}

// ─── Units ────────────────────────────────────────────────────────────────────

export interface Unit {
  id: string;
  languageCode: LanguageCode;
  title: string;
  description: string;
  color: string;             // hex — used for unit card accent
  orderIndex: number;
  lessonIds: string[];
}

// ─── Progress (Zustand store shape — defined here for shared typing) ──────────

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  xpEarned: number;
  completedAt?: string; // ISO date string
}

export interface UserProgress {
  selectedLanguage: LanguageCode | null;
  totalXP: number;
  streak: number;
  lastActiveDate: string | null;
  lessons: Record<string, LessonProgress>;
}
