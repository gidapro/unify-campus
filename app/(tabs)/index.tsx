import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl, Pressable } from "react-native";
import { router } from "expo-router";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Post, UserProfile } from "@/types";
import { getFeedPosts, toggleLike, getCommentsForPost, getUserById } from "@/services/dataService";
import { USERS } from "@/data/mockData";
import PostCard from "@/components/PostCard";

export default function FeedScreen() {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const feed = await getFeedPosts();
    setPosts(feed);
    const counts: Record<string, number> = {};
    for (const p of feed) counts[p.id] = (await getCommentsForPost(p.id)).length;
    setCommentCounts(counts);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onLike = async (postId: string) => {
    await toggleLike(postId, user.id);
    load();
  };

  const authorOf = (post: Post): UserProfile =>
    USERS.find((u) => u.id === post.authorId) ?? USERS[0];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Unify Campus</Text>
        <Pressable onPress={() => {}}>
          <Text style={{ fontSize: 22 }}>🔔</Text>
        </Pressable>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
            tintColor={theme.accent}
          />
        }
        ListEmptyComponent={
          <Text style={{ color: theme.textMuted, textAlign: "center", marginTop: 40 }}>
            Aucune publication pour le moment. Sois le premier a publier !
          </Text>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            author={authorOf(item)}
            currentUserId={user.id}
            commentCount={commentCounts[item.id] ?? 0}
            onLike={onLike}
            onComment={() => {}}
          />
        )}
      />

      <Pressable
        style={[styles.fab, { backgroundColor: theme.accent }]}
        onPress={() => router.push("/create-post")}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 28, lineHeight: 30 }}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: "700" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});
