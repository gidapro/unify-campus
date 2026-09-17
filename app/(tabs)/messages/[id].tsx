import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Message } from "@/types";
import { getMessages, sendMessage, getSchedule, getRooms, getEvents, getGroupsForUser } from "@/services/dataService";
import { SCHOOLS, CURRENT_SCHOOL_ID } from "@/data/mockData";
import { askUnifyAI } from "@/services/aiService";
import MessageBubble from "@/components/MessageBubble";

const QUICK_ACTIONS = [
  { label: "📅 Mon emploi du temps", question: "Quel est mon emploi du temps de demain ?" },
  { label: "📍 Mon prochain cours", question: "Quel est mon prochain cours et dans quelle salle ?" },
  { label: "📝 Mes examens", question: "Quand est mon prochain examen ?" },
  { label: "🎓 Mes groupes", question: "Dans quels groupes suis-je ?" },
  { label: "🎉 Evenements", question: "Quels evenements sont organises cette semaine ?" },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);
  const isAI = id === "conv_ai";

  useEffect(() => {
    navigation.setOptions({ title: isAI ? "Unify AI" : "Conversation" });
  }, [navigation, isAI]);

  const reload = () => getMessages(id).then(setMessages);

  useEffect(() => {
    reload();
  }, [id]);

  const send = async (text: string) => {
    if (!text.trim() || sending) return;
    setSending(true);
    setInput("");
    const now = new Date().toISOString();
    await sendMessage({
      id: `m_${Date.now()}`,
      conversationId: id,
      senderId: user.id,
      content: text,
      createdAt: now,
      read: true,
    });
    reload();

    if (isAI) {
      const [schedule, rooms, events, groups] = await Promise.all([
        getSchedule(`${user.program} ${user.year}`),
        getRooms(),
        getEvents(),
        getGroupsForUser(user.id),
      ]);
      const school = SCHOOLS.find((s) => s.id === CURRENT_SCHOOL_ID)!;
      const answer = await askUnifyAI(text, { user, school, schedule, rooms, events, groups });
      await sendMessage({
        id: `m_${Date.now() + 1}`,
        conversationId: id,
        senderId: "unify-ai",
        content: answer,
        createdAt: new Date().toISOString(),
        read: true,
      });
      reload();
    }
    setSending(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => <MessageBubble message={item} isMine={item.senderId === user.id} />}
      />

      {isAI && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRow}>
          {QUICK_ACTIONS.map((qa) => (
            <Pressable
              key={qa.label}
              style={[styles.quickChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => send(qa.question)}
            >
              <Text style={{ color: theme.text, fontSize: 13 }}>{qa.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={[styles.inputRow, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={isAI ? "Pose une question sur ta vie etudiante..." : "Ecrire un message..."}
          placeholderTextColor={theme.textMuted}
          style={{ flex: 1, color: theme.text, paddingVertical: 10 }}
          onSubmitEditing={() => send(input)}
        />
        <Pressable onPress={() => send(input)} disabled={sending}>
          <Text style={{ color: theme.accent, fontWeight: "700", marginLeft: 10 }}>Envoyer</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  quickRow: { paddingHorizontal: 12, marginBottom: 8 },
  quickChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
  },
});
