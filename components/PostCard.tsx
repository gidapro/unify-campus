import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Post, UserProfile } from "@/types";
import { useAppTheme } from "@/contexts/ThemeContext";
import Avatar from "@/components/Avatar";

interface Props {
  post: Post;
  author: UserProfile;
  currentUserId: string;
  commentCount: number;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
}

export default function PostCard({ post, author, currentUserId, commentCount, onLike, onComment }: Props) {
  const { theme } = useAppTheme();
  const liked = post.likeUserIds.includes(currentUserId);

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Avatar firstName={author.firstName} lastName={author.lastName} avatarUrl={author.avatarUrl} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ color: theme.text, fontWeight: "600" }}>
            {author.firstName} {author.lastName}
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 12 }}>
            {author.program} {author.year}
          </Text>
        </View>
      </View>

      <Text style={{ color: theme.text, marginTop: 10, lineHeight: 20 }}>{post.content}</Text>

      <View style={styles.actions}>
        <Pressable onPress={() => onLike(post.id)} style={styles.actionBtn}>
          <Text style={{ color: liked ? theme.accent : theme.textMuted }}>
            {liked ? "❤️" : "🤍"} {post.likeUserIds.length} likes
          </Text>
        </Pressable>
        <Pressable onPress={() => onComment(post.id)} style={styles.actionBtn}>
          <Text style={{ color: theme.textMuted }}>💬 {commentCount} commentaires</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  header: { flexDirection: "row", alignItems: "center" },
  actions: { flexDirection: "row", marginTop: 12, gap: 20 },
  actionBtn: { flexDirection: "row", alignItems: "center" },
});
