// Cloud Function HTTPS "askUnifyAI".
// Recoit { question, context } depuis l'app mobile et appelle le modele
// avec la cle API stockee cote serveur (jamais dans l'app).
//
// Config attendue (Firebase Functions config ou variable d'environnement) :
//   ANTHROPIC_API_KEY
//
// Deploiement : firebase deploy --only functions:askUnifyAI

const functions = require("firebase-functions");

exports.askUnifyAI = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).send("");
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Methode non supportee" });
  }

  const { question, context } = req.body || {};
  if (!question || !context) {
    return res.status(400).json({ error: "question et context sont requis" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY non configuree" });
  }

  const systemPrompt = [
    "Tu es Unify AI, l'assistant de vie etudiante de l'application Unify Campus.",
    "Reponds uniquement a partir du contexte JSON fourni (emploi du temps, salles,",
    "evenements, groupes de l'utilisateur). Ne donne jamais d'information sur un",
    "autre etablissement. Sois concis et concret (jour, heure, salle).",
  ].join(" ");

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Contexte: ${JSON.stringify(context)}\n\nQuestion: ${question}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const answer = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return res.status(200).json({ answer: answer || "Je n'ai pas trouve de reponse." });
  } catch (err) {
    console.error("askUnifyAI error", err);
    return res.status(500).json({ error: "Erreur lors de l'appel au modele" });
  }
});
