import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Course, Room } from "@/types";
import { useAppTheme } from "@/contexts/ThemeContext";

interface Props {
  course: Course;
  room?: Room;
}

export default function ScheduleCard({ course, room }: Props) {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.timeBlock, { borderColor: theme.accent }]}>
        <Text style={{ color: theme.accent, fontWeight: "700" }}>{course.startTime}</Text>
        <Text style={{ color: theme.textMuted, fontSize: 12 }}>{course.endTime}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ color: theme.text, fontWeight: "600", fontSize: 15 }}>{course.subject}</Text>
        <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>{course.teacher}</Text>
        {room && (
          <Text style={{ color: theme.textMuted, fontSize: 13 }}>
            {room.name} · {room.building}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    alignItems: "center",
  },
  timeBlock: { paddingRight: 12, borderRightWidth: 2, minWidth: 56 },
});
