import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Conversation } from "@/types";
import { getConversationsForUser } from "@/services/dataService";
import { USERS } from "@/data/mockData";
import Avatar from "@/components/Avatar";

function conversationTitle(conv: Conversation, currentUserId: string) {
  if (conv.type === "ai") return "Unify AI";
  if (conv.type === "group") return conv.title ?? "Groupe";
  const otherId = conv.participantIds.find((id) => id !== currentUserId);
  const other = USERS.find((u) => u.id === otherId);
  return other ? `${other.firstName} ${other.lastName}` : "Conversation";
}

export default function MessagesScreen() {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    getConversationsForUser(user.id).then((convs) => {
      // Unify AI toujours affichee en premier, comme une conversation normale.
      setConversations(
        [...convs].sort((a, b) => (a.type === "ai" ? -1 : b.type === "ai" ? 1 : 0))
      );
    });
  }, [user.id]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: 56 }}>
      <Text style={[styles.title, { color: theme.text }]}>Messages</Text>
      <FlatList
        data={conversations}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const isAI = item.type === "ai";
          const otherId = item.participantIds.find((id) => id !== user.id);
          const other = USERS.find((u) => u.id === otherId);
          return (
            <Pressable
              style={[styles.row, { borderColor: theme.border }]}
              onPress={() => router.push(`/messages/${item.id}`)}
            >
              {isAI ? (
                <View style={[styles.aiAvatar, { backgroundColor: theme.accent }]}>
                  <Text style={{ fontSize: 22 }}>🤖</Text>
                </View>
              ) : (
                <Avatar
                  firstName={other?.firstName ?? item.title ?? "?"}
                  lastName={other?.lastName ?? ""}
                  avatarUrl={other?.avatarUrl}
                />
              )}
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: theme.text, fontWeight: "600" }}>
                  {conversationTitle(item, user.id)}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 13 }} numberOfLines={1}>
                  {item.lastMessagePreview ?? "Pas encore de message"}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", paddingHorizontal: 20, marginBottom: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  aiAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
