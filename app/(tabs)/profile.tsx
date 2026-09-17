import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { PASSIONS } from "@/constants/passions";
import Avatar from "@/components/Avatar";

export default function ProfileScreen() {
  const { theme, preference, setPreference } = useAppTheme();
  const { user } = useAuth();
  const passionLabels = user.passionIds
    .map((id) => PASSIONS.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Avatar firstName={user.firstName} lastName={user.lastName} avatarUrl={user.avatarUrl} size={88} />
        <Text style={{ color: theme.text, fontSize: 22, fontWeight: "700", marginTop: 12 }}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={{ color: theme.textMuted, marginTop: 4 }}>
          {user.program} · {user.specialization} · {user.year}
        </Text>
        <Text style={{ color: theme.textMuted }}>{user.campus}</Text>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Passions</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {passionLabels.map((p) => (
          <View key={p!.id} style={[styles.tag, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={{ color: theme.text }}>{p!.icon} {p!.label}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { color: theme.textMuted, marginTop: 24 }]}>Apparence</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {(["dark", "light", "auto"] as const).map((mode) => (
          <Pressable
            key={mode}
            onPress={() => setPreference(mode)}
            style={[
              styles.modeChip,
              {
                backgroundColor: preference === mode ? theme.accent : theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={{ color: preference === mode ? "#FFFFFF" : theme.text }}>
              {mode === "dark" ? "Sombre" : mode === "light" ? "Clair" : "Auto"}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontSize: 13, fontWeight: "700", textTransform: "uppercase", marginBottom: 10 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, marginRight: 8, marginBottom: 8 },
  modeChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
});
