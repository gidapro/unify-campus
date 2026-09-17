import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CalendarEvent } from "@/types";
import { useAppTheme } from "@/contexts/ThemeContext";

const CATEGORY_LABEL: Record<CalendarEvent["category"], string> = {
  cours: "Cours",
  examen: "Examen",
  deadline: "Deadline",
  ecole: "Ecole",
  etudiant: "Etudiant",
};

export default function EventCard({ event }: { event: CalendarEvent }) {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={{ color: theme.accent, fontSize: 12, fontWeight: "700" }}>
        {CATEGORY_LABEL[event.category]} · {event.date}
        {event.time ? ` ${event.time}` : ""}
      </Text>
      <Text style={{ color: theme.text, fontWeight: "600", fontSize: 16, marginTop: 4 }}>{event.title}</Text>
      {event.location && (
        <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>📍 {event.location}</Text>
      )}
      {event.description && (
        <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 6 }}>{event.description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
});
