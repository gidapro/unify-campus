import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAppTheme } from "@/contexts/ThemeContext";

interface Props {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  size?: number;
}

export default function Avatar({ firstName, lastName, avatarUrl, size = 44 }: Props) {
  const { theme } = useAppTheme();
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.accent,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: "center", justifyContent: "center" },
  initials: { color: "#FFFFFF", fontWeight: "700" },
});
