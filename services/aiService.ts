// Service IA "Unify AI". Deux modes :
// 1) EXPO_PUBLIC_AI_BACKEND_URL configuree -> on delegue a la Cloud Function
//    (voir /functions/askUnifyAI) qui appelle le modele avec la cle API cote
//    serveur. C'est le mode a utiliser en production.
// 2) Sinon (demo hors-ligne) -> un moteur local qui interroge reellement les
//    donnees de l'utilisateur (emploi du temps, salles, evenements, groupes)
//    au lieu de renvoyer des reponses ecrites en dur.
import { AIContext } from "@/types";
import { getRoomById } from "@/services/dataService";

const BACKEND_URL = process.env.EXPO_PUBLIC_AI_BACKEND_URL;

export async function askUnifyAI(question: string, context: AIContext): Promise<string> {
  if (BACKEND_URL) {
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context }),
      });
      if (!res.ok) throw new Error(`Backend IA: ${res.status}`);
      const data = await res.json();
      return data.answer as string;
    } catch (err) {
      // Repli silencieux vers le moteur local si le backend est indisponible.
      return localAnswer(question, context);
    }
  }
  return localAnswer(question, context);
}

async function localAnswer(question: string, context: AIContext): Promise<string> {
  const q = question.toLowerCase();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const nextCourse = () => {
    const now = new Date();
    return context.schedule
      .filter((c) => c.date >= today)
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
      .find((c) => c.date > today || c.date === today && c.startTime >= now.toTimeString().slice(0, 5));
  };

  const roomLabel = async (roomId: string) => {
    const room = await getRoomById(roomId);
    return room ? `salle ${room.name.replace("Salle ", "")}, ${room.building}, ${room.floor}` : "salle inconnue";
  };

  if (/prochain cours|mon cours|quel cours/.test(q)) {
    const c = nextCourse();
    if (!c) return "Je ne trouve pas de cours a venir dans ton emploi du temps.";
    return `Ton prochain cours est ${c.subject} le ${c.date} de ${c.startTime} a ${c.endTime}, en ${await roomLabel(c.roomId)}.`;
  }

  if (/demain/.test(q) && /cours/.test(q)) {
    const courses = context.schedule.filter((c) => c.date === tomorrow);
    if (courses.length === 0) return "Tu n'as pas cours demain.";
    const lines = await Promise.all(
      courses.map(async (c) => `${c.startTime}-${c.endTime} ${c.subject} (${await roomLabel(c.roomId)})`)
    );
    return `Oui, demain : ${lines.join(" | ")}.`;
  }

  if (/salle/.test(q)) {
    const c = nextCourse();
    if (!c) return "Je ne trouve pas de cours associe a une salle pour le moment.";
    return `Ton cours de ${c.subject} est en ${await roomLabel(c.roomId)}.`;
  }

  if (/examen|partiel/.test(q)) {
    const exam = context.events
      .filter((e) => e.category === "examen" && e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    if (!exam) return "Je ne vois aucun examen a venir dans ton calendrier.";
    return `Ton prochain examen est ${exam.title}, le ${exam.date}${exam.time ? ` a ${exam.time}` : ""}${exam.location ? `, ${exam.location}` : ""}.`;
  }

  if (/evenement/.test(q)) {
    const upcoming = context.events.filter((e) => e.date >= today).slice(0, 3);
    if (upcoming.length === 0) return "Aucun evenement a venir pour le moment.";
    return `Evenements a venir : ${upcoming.map((e) => `${e.title} (${e.date})`).join(", ")}.`;
  }

  if (/groupe/.test(q)) {
    if (context.groups.length === 0) return "Tu n'es dans aucun groupe pour le moment.";
    return `Tu es dans : ${context.groups.map((g) => g.name).join(", ")}.`;
  }

  if (/professeur|prof /.test(q)) {
    const c = nextCourse();
    if (!c) return "Je ne trouve pas de cours a venir.";
    return `${c.subject} est donne par ${c.teacher}.`;
  }

  return "Je peux t'aider sur ton emploi du temps, tes salles, tes examens, tes groupes et les evenements de l'ecole. Reformule ta question, ou utilise un des raccourcis ci-dessous.";
}
