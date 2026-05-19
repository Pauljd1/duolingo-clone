import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { LanguageCode } from "@/types/learning";

interface ProgressState {
  selectedLanguage: LanguageCode | null;
  completedLessonIds: string[];
  inProgressLessonId: string | null;
  totalXP: number;
  /** True once AsyncStorage has been read on app launch. */
  _hasHydrated: boolean;

  setSelectedLanguage: (code: LanguageCode) => void;
  clearSelectedLanguage: () => void;
  setHasHydrated: (hydrated: boolean) => void;
  completeLesson: (lessonId: string, xpReward: number) => void;
  setInProgressLesson: (lessonId: string | null) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      selectedLanguage: null,
      completedLessonIds: [],
      inProgressLessonId: null,
      totalXP: 0,
      _hasHydrated: false,

      setSelectedLanguage: (code) => set({ selectedLanguage: code }),
      clearSelectedLanguage: () => set({ selectedLanguage: null }),
      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),

      completeLesson: (lessonId, xpReward) =>
        set((state) => ({
          completedLessonIds: state.completedLessonIds.includes(lessonId)
            ? state.completedLessonIds
            : [...state.completedLessonIds, lessonId],
          inProgressLessonId:
            state.inProgressLessonId === lessonId
              ? null
              : state.inProgressLessonId,
          totalXP: state.totalXP + xpReward,
        })),

      setInProgressLesson: (lessonId) => set({ inProgressLessonId: lessonId }),
    }),
    {
      name: "muolingo-progress",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedLanguage: state.selectedLanguage,
        completedLessonIds: state.completedLessonIds,
        inProgressLessonId: state.inProgressLessonId,
        totalXP: state.totalXP,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
