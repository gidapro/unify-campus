export const palette = {
  black: "#0A0A0A",
  white: "#FFFFFF",
  red: "#E53935",
  grayDark: "#1C1C1E",
  grayMid: "#3A3A3C",
  grayLight: "#E5E5EA",
};

export const darkTheme = {
  mode: "dark" as const,
  background: palette.black,
  surface: palette.grayDark,
  text: palette.white,
  textMuted: "#A0A0A5",
  accent: palette.red,
  border: palette.grayMid,
};

export const lightTheme = {
  mode: "light" as const,
  background: palette.white,
  surface: "#F5F5F7",
  text: palette.black,
  textMuted: "#6B6B6F",
  accent: palette.red,
  border: palette.grayLight,
};

export type AppTheme = typeof darkTheme | typeof lightTheme;
