import { create } from "zustand";

const THEME_KEY = "app-theme";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system",
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_KEY, theme);
    }
    set({ theme });
  },
}));

/** Call once on app load to sync store from localStorage (does not write) */
export function hydrateThemeFromStorage(): void {
  const saved = getThemeFromStorage();
  if (saved) useThemeStore.setState({ theme: saved });
}

export function getThemeFromStorage(): Theme | null {
  if (typeof window === "undefined") return null;
  const t = window.localStorage.getItem(THEME_KEY);
  if (t === "light" || t === "dark" || t === "system") return t;
  return null;
}

export { THEME_KEY };
