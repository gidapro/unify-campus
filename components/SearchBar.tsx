import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useAppTheme } from "@/contexts/ThemeContext";

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = "Rechercher" }: Props) {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        style={{ color: theme.text, fontSize: 15 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
});
