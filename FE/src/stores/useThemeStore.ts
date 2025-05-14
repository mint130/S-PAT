import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const useThemeStore = create<ThemeState>()(
  // 새로고침 후에도 상태 유지
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "theme-storage",
    }
  )
);

export default useThemeStore;
