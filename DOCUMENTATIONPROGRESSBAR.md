# Documentation — progression des modules (barre + synchro hôte)

Ce document décrit les changements ajoutés pour permettre à une **app hôte** (ex. WeWeb) d’injecter la progression issue de **Xano** et d’être notifiée à chaque mise à jour locale, **sans** appeler Xano depuis ce dépôt.

## Fichiers modifiés

| Fichier | Rôle |
|--------|------|
| `src/types/ernest.ts` | Nouvelles props optionnelles sur `ErnestCyberChatProps`. |
| `src/hooks/useErnestProgress.ts` | Options `initialProgress` / `onProgressChange`, fusion avec `localStorage`, export de `mergeProgressRecords`. |
| `src/components/ernest/ErnestCyberChat.tsx` | Transmission des props au hook `useErnestProgress`. |

## Nouvelles props : `ErnestCyberChat`

- **`initialProgress?: Record<string, Progress>`**  
  Carte `moduleId` → objet `Progress` (`moduleId`, `currentStepId`, `completed`, `answeredSteps`).  
  À fournir quand l’hôte a récupéré les données (ex. GET `user_modules_progress`).

- **`onProgressChange?: (progress: Record<string, Progress>) => void`**  
  Appelée **après** chaque persistance réussie dans `localStorage` (et mise à jour du state React).  
  Permet à l’hôte d’enchaîner **POST** / **PATCH** Xano.  
  Aussi appelée avec `{}` après **`resetProgress`**.

## Comportement du hook `useErnestProgress`

- **Sans** `initialProgress` : comme avant — chargement depuis `localStorage` (`ernest_progress_v1`).

- **Avec** `initialProgress` : au montage et **chaque fois que le contenu sérialisé change** (`JSON.stringify`), fusion :
  - **localStorage** ∪ **initialProgress** via **`mergeProgressRecords`** (voir ci-dessous).
  - Le résultat est réécrit dans `localStorage` pour garder un cache cohérent.

- **`onProgressChange`** : invoquée via une **ref** pour éviter les re-renders inutiles du hook quand la callback change.

## Fonction `mergeProgressRecords`

Exportée depuis `src/hooks/useErnestProgress.ts`.

Pour chaque `moduleId` présent dans l’une ou l’autre source :

- **`answeredSteps`** : union des ids (sans doublons).
- **`completed`** : `true` si l’une des deux sources est `true`.
- **`currentStepId`** : prise sur la source qui a le **plus** d’étapes dans `answeredSteps` ; sinon repli sur l’autre.

Objectif : réconcilier **cache local** et **données serveur** (ex. téléphone vs bureau) sans écraser brutalement l’une par l’autre.

## Exemple d’usage côté hôte (pseudo-code)

```tsx
<ErnestCyberChat
  hasProAccess={true}
  initialProgress={mapXanoRowsToProgress(xanoList)}
  onProgressChange={(progress) => {
    // debouncer + POST ou PATCH selon module_id / id Xano
  }}
/>
```

La conversion des lignes Xano (`module_id`, `answered_steps`, `current_step_id`, `completed`) vers `Record<string, Progress>` reste de la responsabilité de l’hôte.

## Ce qui n’a pas changé

- Aucun appel HTTP vers Xano dans ce projet.
- Les barres de progression par module (`ProgressBar`) et le calcul global (`getOverallProgress`) utilisent toujours la même forme de `Progress`.
- `onEvent` (`module_start`, `step_answered`, etc.) existe toujours pour l’analytics ; **`onProgressChange`** porte l’**état complet** après sauvegarde locale.

## Publier / intégrer WeWeb plus tard

Quand WeWeb sera disponible : **GET** au chargement → construire `initialProgress` → workflows **POST** / **PATCH** déclenchés depuis `onProgressChange` (éventuellement avec debounce).
