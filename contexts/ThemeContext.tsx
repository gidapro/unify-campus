import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, AppTheme } from "@/constants/theme";

type ThemePreference = "dark" | "light" | "auto";

interface ThemeContextValue {
  theme: AppTheme;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("auto");

  const theme = useMemo(() => {
    const resolved = preference === "auto" ? systemScheme ?? "dark" : preference;
    return resolved === "light" ? lightTheme : darkTheme;
  }, [preference, systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme doit etre utilise dans ThemeProvider");
  return ctx;
}
