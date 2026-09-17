import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { createPost } from "@/services/dataService";
import Button from "@/components/Button";

// Ecran "Que veux-tu partager ?" simplifie au type texte pour le MVP.
// Les types photo/video/sondage/document partagent la meme structure Post
// (imageUrls, etc.) et peuvent etre ajoutes ici sans changer l'architecture.
export default function CreatePostScreen() {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const [content, setContent] = useState("");

  const publish = async () => {
    if (!content.trim()) return;
    await createPost({
      id: `p_${Date.now()}`,
      schoolId: user.schoolId,
      authorId: user.id,
      content,
      createdAt: new Date().toISOString(),
      likeUserIds: [],
      commentIds: [],
    });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 20, paddingTop: 60 }}>
      <Text style={[styles.title, { color: theme.text }]}>Que veux-tu partager ?</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Ecris quelque chose a partager avec ton ecole..."
        placeholderTextColor={theme.textMuted}
        multiline
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
      />
      <Button label="Publier" onPress={publish} disabled={!content.trim()} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  input: { minHeight: 140, borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 20, textAlignVertical: "top" },
});
