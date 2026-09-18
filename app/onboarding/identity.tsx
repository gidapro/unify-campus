import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAppTheme } from "@/contexts/ThemeContext";
import Button from "@/components/Button";

// Etape 1 de l'onboarding : identite + rattachement etablissement.
// En production ce formulaire alimente Firebase Auth (createUserWithEmailAndPassword)
// + un document Firestore users/{uid}.
export default function IdentityScreen() {
  const { theme } = useAppTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("ESCE");
  const [program, setProgram] = useState("PGE");
  const [year, setYear] = useState("4");

  const canContinue = firstName.length > 0 && lastName.length > 0 && email.includes("@");

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: theme.text }]}>Bienvenue sur Unify Campus</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        Commencons par ton identite etudiante
      </Text>

      {[
        { label: "Prenom", value: firstName, onChange: setFirstName },
        { label: "Nom", value: lastName, onChange: setLastName },
        { label: "Email etudiant", value: email, onChange: setEmail },
        { label: "Ecole", value: school, onChange: setSchool },
        { label: "Programme", value: program, onChange: setProgram },
        { label: "Annee", value: year, onChange: setYear },
      ].map((field) => (
        <View key={field.label} style={styles.field}>
          <Text style={{ color: theme.textMuted, marginBottom: 6 }}>{field.label}</Text>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder={field.label}
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
          />
        </View>
      ))}

      <Button
        label="Continuer"
        disabled={!canContinue}
        onPress={() => router.push("/onboarding/passions")}
        style={{ marginTop: 12 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { fontSize: 15, marginTop: 6, marginBottom: 24 },
  field: { marginBottom: 14 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
});
