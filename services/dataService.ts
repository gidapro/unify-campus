// Couche d'acces aux donnees. Aujourd'hui: donnees de demo en memoire.
// Demain: remplacer le corps de chaque fonction par des appels Firestore
// (les signatures ne changent pas, donc aucun ecran n'a besoin d'etre modifie).
import {
  USERS,
  ROOMS,
  COURSES,
  EVENTS,
  GROUPS,
  POSTS,
  COMMENTS,
  CONVERSATIONS,
  MESSAGES,
  CURRENT_SCHOOL_ID,
} from "@/data/mockData";
import {
  UserProfile,
  Course,
  Room,
  CalendarEvent,
  Group,
  Post,
  Comment,
  Conversation,
  Message,
} from "@/types";

const bySchool = <T extends { schoolId: string }>(items: T[]) =>
  items.filter((i) => i.schoolId === CURRENT_SCHOOL_ID);

export async function getUserById(userId: string): Promise<UserProfile | undefined> {
  return USERS.find((u) => u.id === userId);
}

export async function getSchedule(promotion: string): Promise<Course[]> {
  return bySchool(COURSES).filter((c) => c.promotion === promotion);
}

export async function getScheduleForDate(promotion: string, date: string): Promise<Course[]> {
  return (await getSchedule(promotion)).filter((c) => c.date === date);
}

export async function getRooms(): Promise<Room[]> {
  return bySchool(ROOMS);
}

export async function getRoomById(roomId: string): Promise<Room | undefined> {
  return ROOMS.find((r) => r.id === roomId);
}

export async function getEvents(): Promise<CalendarEvent[]> {
  return bySchool(EVENTS);
}

export async function getGroups(): Promise<Group[]> {
  return bySchool(GROUPS);
}

export async function getGroupsForUser(userId: string): Promise<Group[]> {
  return (await getGroups()).filter((g) => g.memberIds.includes(userId));
}

export async function getFeedPosts(): Promise<Post[]> {
  return bySchool(POSTS)
    .filter((p) => !p.groupId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getGroupPosts(groupId: string): Promise<Post[]> {
  return bySchool(POSTS).filter((p) => p.groupId === groupId);
}

export async function getCommentsForPost(postId: string): Promise<Comment[]> {
  return COMMENTS.filter((c) => c.postId === postId);
}

export async function toggleLike(postId: string, userId: string): Promise<void> {
  const post = POSTS.find((p) => p.id === postId);
  if (!post) return;
  const i = post.likeUserIds.indexOf(userId);
  if (i >= 0) post.likeUserIds.splice(i, 1);
  else post.likeUserIds.push(userId);
}

export async function createPost(post: Post): Promise<void> {
  POSTS.unshift(post);
}

export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  return bySchool(CONVERSATIONS).filter((c) => c.participantIds.includes(userId));
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  return MESSAGES.filter((m) => m.conversationId === conversationId).sort((a, b) =>
    a.createdAt < b.createdAt ? -1 : 1
  );
}

export async function sendMessage(message: Message): Promise<void> {
  MESSAGES.push(message);
  const conv = CONVERSATIONS.find((c) => c.id === message.conversationId);
  if (conv) {
    conv.lastMessagePreview = message.content;
    conv.lastMessageAt = message.createdAt;
  }
}
