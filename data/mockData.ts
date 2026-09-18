import {
  School,
  UserProfile,
  Room,
  Course,
  CalendarEvent,
  Group,
  Post,
  Comment,
  Conversation,
  Message,
} from "@/types";

// ---------------------------------------------------------------------------
// Environnement de demo : schoolId = "esce". Toute la donnee est isolee par
// schoolId pour prefigurer le multi-tenant (voir services/firebase.ts).
// ---------------------------------------------------------------------------

export const CURRENT_SCHOOL_ID = "esce";

export const SCHOOLS: School[] = [
  { id: "esce", name: "ESCE Paris", campuses: ["Paris"] },
  { id: "isc", name: "ISC Paris", campuses: ["Paris"] },
];

export const CURRENT_USER_ID = "u_giovanni";

export const USERS: UserProfile[] = [
  {
    id: "u_giovanni",
    schoolId: "esce",
    firstName: "Giovanni",
    lastName: "Danial",
    email: "giovanni.danial@esce.fr",
    campus: "Paris",
    program: "PGE",
    year: "AN4",
    specialization: "Finance",
    passionIds: ["finance", "entrepreneuriat", "musculation", "gastronomie", "technologie"],
    role: "student",
  },
  {
    id: "u_emma",
    schoolId: "esce",
    firstName: "Emma",
    lastName: "Martin",
    email: "emma.martin@esce.fr",
    campus: "Paris",
    program: "M1",
    year: "AN4",
    specialization: "Finance",
    passionIds: ["finance", "voyage", "entrepreneuriat"],
    role: "student",
  },
  {
    id: "u_lucas",
    schoolId: "esce",
    firstName: "Lucas",
    lastName: "Bernard",
    email: "lucas.bernard@esce.fr",
    campus: "Paris",
    program: "PGE",
    year: "AN3",
    specialization: "Marketing",
    passionIds: ["mode", "networking", "nightlife"],
    role: "student",
  },
];

export const ROOMS: Room[] = [
  { id: "r_101", schoolId: "esce", name: "Salle 101", building: "Batiment A", floor: "1er etage" },
  { id: "r_204", schoolId: "esce", name: "Salle 204", building: "Batiment B", floor: "2e etage" },
  { id: "r_301", schoolId: "esce", name: "Salle 301", building: "Batiment B", floor: "3e etage" },
  { id: "r_118", schoolId: "esce", name: "Salle 118", building: "Batiment A", floor: "1er etage" },
];

// Dates relatives au jour d'execution pour que la demo reste credible.
const today = new Date();
const iso = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export const COURSES: Course[] = [
  {
    id: "c1",
    schoolId: "esce",
    subject: "Finance d'entreprise",
    teacher: "M. Roubaud",
    date: iso(0),
    startTime: "09:00",
    endTime: "11:00",
    roomId: "r_204",
    program: "PGE",
    campus: "Paris",
    promotion: "PGE AN4",
  },
  {
    id: "c2",
    schoolId: "esce",
    subject: "Management de projet",
    teacher: "Mme Lefevre",
    date: iso(0),
    startTime: "11:00",
    endTime: "13:00",
    roomId: "r_301",
    program: "PGE",
    campus: "Paris",
    promotion: "PGE AN4",
  },
  {
    id: "c3",
    schoolId: "esce",
    subject: "Controle de gestion",
    teacher: "M. Nasri",
    date: iso(0),
    startTime: "14:00",
    endTime: "16:00",
    roomId: "r_118",
    program: "PGE",
    campus: "Paris",
    promotion: "PGE AN4",
  },
  {
    id: "c4",
    schoolId: "esce",
    subject: "Finance d'entreprise",
    teacher: "M. Roubaud",
    date: iso(1),
    startTime: "09:00",
    endTime: "11:00",
    roomId: "r_204",
    program: "PGE",
    campus: "Paris",
    promotion: "PGE AN4",
  },
];

export const EVENTS: CalendarEvent[] = [
  {
    id: "e1",
    schoolId: "esce",
    title: "Partiel Finance d'entreprise",
    description: "Examen ecrit, 2h, calculatrice autorisee",
    date: iso(3),
    time: "14:00",
    location: "Salle 301",
    organizer: "Administration ESCE",
    category: "examen",
    participantIds: ["u_giovanni", "u_emma"],
  },
  {
    id: "e2",
    schoolId: "esce",
    title: "Soiree d'integration BDE",
    description: "Soiree annuelle organisee par le BDE",
    date: iso(5),
    time: "20:00",
    location: "Le Carmen, Paris",
    organizer: "BDE ESCE",
    category: "etudiant",
    participantIds: [],
  },
  {
    id: "e3",
    schoolId: "esce",
    title: "Conference Finance & IA",
    description: "Intervenants issus de la finance de marche",
    date: iso(7),
    time: "18:00",
    location: "Amphi principal",
    organizer: "Association Finance Club",
    category: "ecole",
    participantIds: [],
  },
];

export const GROUPS: Group[] = [
  {
    id: "g_pge_an4",
    schoolId: "esce",
    name: "PGE AN4",
    type: "promotion",
    description: "Groupe officiel de la promotion PGE AN4",
    memberIds: ["u_giovanni", "u_emma", "u_lucas"],
    adminIds: ["u_emma"],
  },
  {
    id: "g_finance",
    schoolId: "esce",
    name: "M1 Finance",
    type: "formation",
    description: "Etudiants specialisation Finance",
    memberIds: ["u_giovanni", "u_emma"],
    adminIds: ["u_giovanni"],
  },
  {
    id: "g_finance_club",
    schoolId: "esce",
    name: "Finance Club",
    type: "passion",
    description: "Pour les passionnes de finance et d'investissement",
    memberIds: ["u_giovanni", "u_emma"],
    adminIds: ["u_emma"],
  },
];

export const POSTS: Post[] = [
  {
    id: "p1",
    schoolId: "esce",
    authorId: "u_emma",
    content:
      "Le partiel de Finance d'entreprise approche, quelqu'un a des fiches de revision a partager ?",
    createdAt: new Date().toISOString(),
    likeUserIds: ["u_giovanni", "u_lucas"],
    commentIds: ["cm1"],
  },
  {
    id: "p2",
    schoolId: "esce",
    authorId: "u_lucas",
    groupId: "g_pge_an4",
    content: "Rappel : inscriptions ouvertes pour la soiree d'integration du BDE !",
    createdAt: new Date().toISOString(),
    likeUserIds: ["u_giovanni"],
    commentIds: [],
  },
];

export const COMMENTS: Comment[] = [
  {
    id: "cm1",
    postId: "p1",
    authorId: "u_giovanni",
    content: "Je peux t'envoyer les miennes ce soir",
    createdAt: new Date().toISOString(),
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv_ai",
    schoolId: "esce",
    type: "ai",
    participantIds: ["u_giovanni", "unify-ai"],
    title: "Unify AI",
    lastMessagePreview: "Pose-moi une question sur ta vie etudiante",
  },
  {
    id: "conv_emma",
    schoolId: "esce",
    type: "direct",
    participantIds: ["u_giovanni", "u_emma"],
    lastMessagePreview: "Je peux t'envoyer les miennes ce soir",
    lastMessageAt: new Date().toISOString(),
  },
  {
    id: "conv_group_finance",
    schoolId: "esce",
    type: "group",
    participantIds: ["u_giovanni", "u_emma"],
    title: "M1 Finance",
    lastMessagePreview: "Emma: Quelqu'un a le poly du dernier cours ?",
    lastMessageAt: new Date().toISOString(),
  },
];

export const MESSAGES: Message[] = [
  {
    id: "m1",
    conversationId: "conv_emma",
    senderId: "u_emma",
    content: "Salut ! Tu as des fiches de revision pour le partiel ?",
    createdAt: new Date().toISOString(),
    read: true,
  },
  {
    id: "m2",
    conversationId: "conv_emma",
    senderId: "u_giovanni",
    content: "Oui, je t'envoie ca ce soir",
    createdAt: new Date().toISOString(),
    read: true,
  },
];
