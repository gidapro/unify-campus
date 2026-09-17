# Unify Campus — MVP mobile

Application mobile (iOS/Android) pour la vie etudiante : fil d'actualite,
groupes, messagerie, emploi du temps, evenements et un assistant **Unify AI**
integre dans les messages.

## Stack

- React Native + Expo (SDK 51) + TypeScript
- Expo Router (navigation par fichiers)
- Firebase (Auth + Firestore) — pret a brancher, voir plus bas
- Architecture multi-etablissement (`schoolId` sur chaque donnee)

## Etat actuel de ce depot

Ce depot est une **base reelle et fonctionnelle**, pas une maquette :
tous les ecrans listes ci-dessous s'executent, naviguent entre eux et
lisent/ecrivent de la donnee via `services/dataService.ts`.

Pour aller vite sans compte Firebase, cette donnee vit en memoire
(`data/mockData.ts`) : ecrire un like, envoyer un message ou publier un post
fonctionne reellement dans l'app, mais est reinitialise si vous relancez le
serveur Expo. Le chapitre "Brancher Firebase" plus bas explique comment
remplacer ce stockage en memoire par Firestore sans toucher aux ecrans
(les fonctions de `dataService.ts` ont les memes signatures).

### Ecrans implementes

- Onboarding : identite (ecole, campus, formation, annee) puis selection de
  passions (recherche + bulles + "Passer cette etape")
- Accueil : fil d'actualite (like, compteur de commentaires, creation de post,
  pull-to-refresh, empty state)
- Groupes : listes par promotion / formation / projet / centres d'interet
- Planning : emploi du temps par jour de la semaine, avec salle et professeur
- Messages : liste des conversations avec **Unify AI en tete de liste**,
  conversation directe et conversation de groupe
- **Unify AI** : conversation dediee avec raccourcis rapides (emploi du temps,
  prochain cours, examens, groupes, evenements) — l'IA interroge reellement
  les donnees de l'utilisateur (voir `services/aiService.ts`)
- Profil : identite, passions, choix du theme (sombre / clair / auto)

### Ce qui reste a construire pour la V1 complete

Le prompt d'origine couvre un perimetre tres large (sondages, documents dans
les posts, administration ecole, notifications push, recherche globale,
photos/videos dans les messages...). L'architecture ci-dessous est concue
pour recevoir ces ecrans sans refonte :

- ajouter un type de champ dans `types/index.ts` (ex: `Post.pollOptions`)
- ajouter une fonction dans `dataService.ts`
- ajouter un ecran dans `app/`

## Installation

```bash
npm install
npx expo start
```

Puis scannez le QR code avec l'app **Expo Go** (iPhone/Android), ou appuyez
sur `i` / `a` pour un simulateur/emulateur.

L'app demarre directement sur l'onboarding (aucun compte pre-existant tant
que Firebase Auth n'est pas branche).

## Brancher Firebase

1. Creer un projet sur https://console.firebase.google.com
2. Activer **Authentication > Email/Password**
3. Creer une base **Firestore** (mode production)
4. Dans "Parametres du projet > Vos applications", ajouter une app Web et
   copier la config dans un fichier `.env` a la racine (voir `.env.example`)
5. Deployer les regles de securite fournies :

```bash
firebase deploy --only firestore:rules
```

(`firestore.rules` a la racine du depot)

6. Remplacer le contenu de chaque fonction de `services/dataService.ts` par
   l'appel Firestore equivalent (`getDocs`, `addDoc`, `onSnapshot`...). Les
   signatures des fonctions ne changent pas : aucun ecran n'a besoin d'etre
   modifie.
7. Dans `contexts/AuthContext.tsx`, remplacer l'utilisateur en dur par
   `onAuthStateChanged(auth, ...)` + lecture du document `users/{uid}`.

## Unify AI — architecture

- `services/aiService.ts` expose `askUnifyAI(question, context)`.
- Si `EXPO_PUBLIC_AI_BACKEND_URL` est definie dans `.env`, l'app appelle une
  Cloud Function (exemple fourni dans `functions/askUnifyAI/index.js`) qui
  appelle le modele avec la cle API **cote serveur uniquement** (jamais dans
  le bundle mobile).
- Sinon, un moteur local (`localAnswer`) interroge reellement le contexte de
  l'utilisateur (emploi du temps, salles, evenements, groupes) — ce n'est pas
  un chatbot a reponses figees : la reponse depend des donnees reelles.

Pour deployer la Cloud Function :

```bash
cd functions
npm install
firebase functions:config:set anthropic.key="VOTRE_CLE"  # ou variable d'env ANTHROPIC_API_KEY
firebase deploy --only functions:askUnifyAI
```

## Structure du projet

```text
app/                 ecrans (Expo Router)
  onboarding/         identite + passions
  (tabs)/             accueil, groupes, planning, messages, profil
  create-post.tsx     creation de publication
components/          composants reutilisables (PostCard, Avatar, ...)
services/            acces donnees (dataService), IA (aiService), Firebase
contexts/            theme (sombre/clair/auto) et authentification
data/                donnees de demonstration (ecole, cours, salles, ...)
types/               types TypeScript partages
constants/            theme, liste des 40 passions
functions/            exemple de Cloud Function securisee pour l'IA
firestore.rules       regles de securite Firestore (isolation par schoolId)
```

## Multi-etablissement

Chaque enregistrement (utilisateur, cours, salle, groupe, post...) porte un
`schoolId`. Les regles Firestore (`firestore.rules`) verifient que
l'utilisateur connecte n'accede qu'aux donnees de son propre etablissement.
Pour ajouter une ecole : creer un document dans `schools/{schoolId}` et
rattacher les nouveaux utilisateurs a ce `schoolId` a l'inscription.
