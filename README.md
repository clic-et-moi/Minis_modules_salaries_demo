# Minis modules salariés + utilisateur Ernest

Application web de **modules de formation interactifs** sous forme de chat. L'assistant **Ernest** guide l'utilisateur à travers des parcours (cyberharcèlement, etc.) avec questions, feedbacks et conseils.

**Démo en ligne :** [https://minimodulesdemo.netlify.app/](https://minimodulesdemo.netlify.app/)

---

## Ce que fait le projet

- **Interface type chat** avec l?assistant Ernest
- **Modules thématiques** définis dans `src/data/modules.json` (durée, étapes, questions à choix)
- **Suivi de progression** et résumé en fin de module
- **Contrôles d?accessibilité** (taille du texte, contraste)
- Stack : **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Radix UI** (shadcn)

---

## Prérequis

- **Node.js** 18 ou plus (recommandé : LTS)  
  Vérifier : `node -v`
- **npm** (livré avec Node)  
  Vérifier : `npm -v`

---

## Installation

1. **Cloner le dépôt** (si ce n?est pas déjà fait) :
   ```bash
   git clone git@github.com:clic-et-moi/Minis_modules_salaries_demo.git
   cd Minis_modules_salaries_demo
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

---

## Lancer le projet

- **Mode développement** (avec rechargement à chaud) :
  ```bash
  npm run dev
  ```
  Puis ouvrir l?URL affichée (souvent `http://localhost:5173`).

- **Build de production** :
  ```bash
  npm run build
  ```
  Les fichiers sont générés dans le dossier `dist/`.

- **Prévisualiser le build** :
  ```bash
  npm run preview
  ```

- **Linter** :
  ```bash
  npm run lint
  ```

---

## Structure utile

| Dossier / Fichier      | Rôle |
|------------------------|------|
| `src/components/ernest/` | Composants du chat Ernest (accueil, menu modules, conversation, résumé) |
| `src/data/modules.json`  | Définition des modules et de leurs étapes |
| `src/pages/Index.tsx`    | Page principale qui affiche Ernest |
| `src/types/ernest.ts`    | Types TypeScript du module Ernest |

---

## Licence

Projet Clic et Moi ? Minis modules salariés.
