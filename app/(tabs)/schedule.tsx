import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, Pressable } from "react-native";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Course, Room } from "@/types";
import { getSchedule, getRooms } from "@/services/dataService";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function ScheduleScreen() {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay() - 1);

  useEffect(() => {
    getSchedule(`${user.program} ${user.year}`).then(setCourses);
    getRooms().then(setRooms);
  }, [user.program, user.year]);

  const weekDates = Array.from({ length: 6 }, (_, i) => {
    const monday = new Date();
    const dayOfWeek = monday.getDay() === 0 ? 7 : monday.getDay();
    monday.setDate(monday.getDate() - dayOfWeek + 1 + i);
    return monday.toISOString().slice(0, 10);
  });

  const dayCourses = courses
    .filter((c) => c.date === weekDates[Math.max(0, selectedDayIndex)])
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const roomFor = (roomId: string) => rooms.find((r) => r.id === roomId);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: 56 }}>
      <Text style={[styles.title, { color: theme.text }]}>Emploi du temps</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20, marginBottom: 8 }}>
        {DAYS.map((d, i) => (
          <Pressable
            key={d}
            onPress={() => setSelectedDayIndex(i)}
            style={[
              styles.dayChip,
              {
                backgroundColor: selectedDayIndex === i ? theme.accent : theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={{ color: selectedDayIndex === i ? "#FFFFFF" : theme.text, fontWeight: "600" }}>
              {d}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={dayCourses}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={{ color: theme.textMuted, textAlign: "center", marginTop: 40 }}>
            Pas de cours ce jour-la.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.courseRow, { borderColor: theme.border, backgroundColor: theme.surface }]}>
            <Text style={{ color: theme.accent, fontWeight: "700", width: 56 }}>{item.startTime}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontWeight: "600" }}>{item.subject}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 13 }}>
                {roomFor(item.roomId)?.name} · {item.teacher}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", paddingHorizontal: 20, marginBottom: 8 },
  dayChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  courseRow: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: "center",
  },
});
