import type { Language } from "@/types/learning";

export const languages: Language[] = [
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    description: "The world's second most spoken native language.",
    learnerCount: "28.4M learners",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    description: "The language of love, art, and diplomacy.",
    learnerCount: "19.4M learners",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    description: "A fascinating language with three writing systems.",
    learnerCount: "12.7M learners",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    description: "Precise, expressive, and the most spoken in Europe.",
    learnerCount: "8.1M learners",
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇧🇷",
    description: "Spoken across Brazil, Portugal, and beyond.",
    learnerCount: "6.2M learners",
  },
];

export function getLanguageByCode(code: string): Language | undefined {
  return languages.find((l) => l.code === code);
}
