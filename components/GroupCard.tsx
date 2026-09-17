import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Group } from "@/types";
import { useAppTheme } from "@/contexts/ThemeContext";

interface Props {
  group: Group;
  onPress: (groupId: string) => void;
}

const TYPE_LABEL: Record<Group["type"], string> = {
  promotion: "Promotion",
  formation: "Formation",
  projet: "Projet",
  passion: "Centre d'interet",
};

export default function GroupCard({ group, onPress }: Props) {
  const { theme } = useAppTheme();
  return (
    <Pressable
      onPress={() => onPress(group.id)}
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.text, fontWeight: "600", fontSize: 16 }}>{group.name}</Text>
        <Text style={{ color: theme.accent, fontSize: 12, marginTop: 2 }}>{TYPE_LABEL[group.type]}</Text>
        <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 6 }} numberOfLines={2}>
          {group.description}
        </Text>
        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 6 }}>
          {group.memberIds.length} membres
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
});
