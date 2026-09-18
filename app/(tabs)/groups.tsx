import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Group } from "@/types";
import { getGroupsForUser } from "@/services/dataService";
import GroupCard from "@/components/GroupCard";

const SECTIONS: { key: Group["type"]; label: string }[] = [
  { key: "promotion", label: "Promotion" },
  { key: "formation", label: "Formation" },
  { key: "projet", label: "Projets" },
  { key: "passion", label: "Centres d'interet" },
];

export default function GroupsScreen() {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    getGroupsForUser(user.id).then(setGroups);
  }, [user.id]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: 56 }}>
      <Text style={[styles.title, { color: theme.text }]}>Groupes</Text>
      <FlatList
        data={SECTIONS}
        keyExtractor={(s) => s.key}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item: section }) => {
          const sectionGroups = groups.filter((g) => g.type === section.key);
          if (sectionGroups.length === 0) return null;
          return (
            <View style={{ marginBottom: 16 }}>
              <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{section.label}</Text>
              {sectionGroups.map((g) => (
                <GroupCard key={g.id} group={g} onPress={() => {}} />
              ))}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", paddingHorizontal: 20, marginBottom: 8 },
  sectionLabel: { fontSize: 13, fontWeight: "700", textTransform: "uppercase", marginBottom: 8 },
});
