export type UserRole = "student" | "teacher" | "school_admin" | "super_admin";

export interface School {
  id: string; // schoolId, ex: "esce"
  name: string;
  campuses: string[];
}

export interface UserProfile {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  campus: string;
  program: string; // ex: "PGE"
  year: string; // ex: "AN4"
  specialization?: string;
  passionIds: string[];
  role: UserRole;
}

export interface Room {
  id: string;
  schoolId: string;
  name: string; // "Salle 204"
  building: string; // "Batiment B"
  floor: string; // "2e etage"
}

export interface Course {
  id: string;
  schoolId: string;
  subject: string;
  teacher: string;
  date: string; // ISO date "2026-09-16"
  startTime: string; // "09:00"
  endTime: string; // "11:00"
  roomId: string;
  program: string;
  campus: string;
  promotion: string;
}

export interface CalendarEvent {
  id: string;
  schoolId: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  organizer: string;
  category: "cours" | "examen" | "deadline" | "ecole" | "etudiant";
  participantIds: string[];
}

export interface Group {
  id: string;
  schoolId: string;
  name: string;
  type: "promotion" | "formation" | "projet" | "passion";
  description: string;
  avatarUrl?: string;
  memberIds: string[];
  adminIds: string[];
}

export interface Post {
  id: string;
  schoolId: string;
  authorId: string;
  groupId?: string; // absent = public dans l'ecole
  content: string;
  imageUrls?: string[];
  createdAt: string; // ISO datetime
  likeUserIds: string[];
  commentIds: string[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  parentCommentId?: string;
}

export type MessageSender = "user" | "ai";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string; // userId ou "unify-ai"
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  schoolId: string;
  type: "direct" | "group" | "ai";
  participantIds: string[]; // pour "ai": [userId, "unify-ai"]
  title?: string; // pour group / ai
  lastMessagePreview?: string;
  lastMessageAt?: string;
}

export interface Passion {
  id: string;
  label: string;
  icon: string; // emoji ou nom d'icone
}

export interface AIContext {
  user: UserProfile;
  school: School;
  schedule: Course[];
  rooms: Room[];
  events: CalendarEvent[];
  groups: Group[];
}
