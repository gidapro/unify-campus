import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Passion } from "@/types";
import { useAppTheme } from "@/contexts/ThemeContext";

interface Props {
  passion: Passion;
  selected: boolean;
  onToggle: (id: string) => void;
}

export default function PassionBubble({ passion, selected, onToggle }: Props) {
  const { theme } = useAppTheme();
  return (
    <Pressable
      onPress={() => onToggle(passion.id)}
      style={[
        styles.bubble,
        {
          backgroundColor: selected ? theme.accent : theme.surface,
          borderColor: selected ? theme.accent : theme.border,
        },
      ]}
    >
      <Text style={{ fontSize: 16 }}>{passion.icon}</Text>
      <Text style={{ color: selected ? "#FFFFFF" : theme.text, marginLeft: 6, fontWeight: "500" }}>
        {passion.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
});
