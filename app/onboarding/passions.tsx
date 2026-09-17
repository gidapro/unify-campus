import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { PASSIONS } from "@/constants/passions";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import PassionBubble from "@/components/PassionBubble";
import SearchBar from "@/components/SearchBar";
import Button from "@/components/Button";

export default function PassionsScreen() {
  const { theme } = useAppTheme();
  const { completeOnboarding } = useAuth();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = PASSIONS.filter((p) => p.label.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const finish = (ids: string[]) => {
    completeOnboarding(ids);
    router.replace("/(tabs)");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: 60 }}>
      <View style={{ paddingHorizontal: 24 }}>
        <Text style={[styles.title, { color: theme.text }]}>Tes passions</Text>
        <Text style={{ color: theme.textMuted, marginTop: 6, marginBottom: 16 }}>
          Selectionne ce qui te ressemble. Cela personnalise ton profil, les groupes et
          les publications qu'on te propose.
        </Text>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Chercher une passion" />
      </View>

      <ScrollView contentContainerStyle={styles.bubbles}>
        {filtered.map((p) => (
          <PassionBubble key={p.id} passion={p} selected={selected.includes(p.id)} onToggle={toggle} />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Passer cette etape" variant="secondary" onPress={() => finish([])} style={{ marginBottom: 10 }} />
        <Button label={`Continuer (${selected.length})`} onPress={() => finish(selected)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "700" },
  bubbles: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  footer: { padding: 24 },
});
