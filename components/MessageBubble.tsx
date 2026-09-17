import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Message } from "@/types";
import { useAppTheme } from "@/contexts/ThemeContext";

interface Props {
  message: Message;
  isMine: boolean;
}

export default function MessageBubble({ message, isMine }: Props) {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.row, { justifyContent: isMine ? "flex-end" : "flex-start" }]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isMine ? theme.accent : theme.surface,
            borderColor: theme.border,
            borderWidth: isMine ? 0 : 1,
          },
        ]}
      >
        <Text style={{ color: isMine ? "#FFFFFF" : theme.text }}>{message.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginVertical: 4, paddingHorizontal: 12 },
  bubble: { maxWidth: "78%", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
});
