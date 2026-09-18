import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { useAppTheme } from "@/contexts/ThemeContext";

interface Props {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({ label, onPress, variant = "primary", disabled, style }: Props) {
  const { theme } = useAppTheme();
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        {
          backgroundColor: isPrimary ? theme.accent : "transparent",
          borderColor: theme.accent,
          borderWidth: isPrimary ? 0 : 1,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Text style={{ color: isPrimary ? "#FFFFFF" : theme.accent, fontWeight: "600", fontSize: 16 }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
