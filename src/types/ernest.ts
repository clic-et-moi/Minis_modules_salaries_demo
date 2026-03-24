export interface Option {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
}

export interface Step {
  id: string;
  type?: 'question' | 'narrative' | 'image';
  messages?: string[]; // Multiple messages for narrative steps
  message?: string; // Single message for question steps
  image?: string;
  options?: Option[];
  tip?: string;
  next: string | null;
}

export interface ModuleSummary {
  keypoints: string[];
  actions: string[];
}

export interface Module {
  id: string;
  icon: string;
  title: string;
  duration: string;
  level?: string;
  description?: string;
  tag?: 'classic' | 'PRO';
  steps: Step[];
  summary: ModuleSummary;
}

export interface ModulesData {
  modules: Module[];
}

export interface Progress {
  moduleId: string;
  currentStepId: string | null;
  completed: boolean;
  answeredSteps: string[];
}

export interface ErnestState {
  currentView: 'welcome' | 'menu' | 'module' | 'summary';
  selectedModule: Module | null;
  currentStep: Step | null;
  selectedOption: string | null;
  showFeedback: boolean;
  showTip: boolean;
  conversationHistory: ConversationMessage[];
  progress: Record<string, Progress>;
}

export interface ConversationMessage {
  id: string;
  sender: 'ernest' | 'user';
  text: string;
  image?: string;
  stepId?: string;
  typing?: boolean;
}

export interface ErnestCyberChatProps {
  modules?: Module[];
  /** Si true, les modules PRO (modules-pro.json) sont ajoutés. À renseigner selon le project_id Xano. */
  hasProAccess?: boolean;
  /**
   * Progression initiale depuis l’app hôte (ex. WeWeb après GET Xano).
   * Fusionnée avec le contenu du localStorage au chargement / quand la référence change.
   */
  initialProgress?: Record<string, Progress>;
  /**
   * Appelée après chaque mise à jour de progression persistée localement.
   * L’hôte peut enchaîner POST/PATCH Xano sans que ce package appelle Xano directement.
   */
  onProgressChange?: (progress: Record<string, Progress>) => void;
  theme?: {
    primary?: string;
    radius?: number;
    compact?: boolean;
  };
  onEvent?: (event: ErnestEvent) => void;
  /**
   * UUID utilisateur Xano. Si défini, un POST vers `xanoUserModulesProgressUrl`
   * est envoyé à la fin de chaque module (`completed: true`).
   */
  xanoUserId?: string;
  /** Surcharge de l’URL POST (défaut : endpoint `user_modules_progress` du projet). */
  xanoUserModulesProgressUrl?: string;
  /** Bearer optionnel si l’API Xano est protégée. */
  xanoAuthToken?: string;
  /**
   * Datasource Xano (`X-Data-Source`) pour le POST progression.
   * Par défaut côté client : `demo` — ne pas renseigner pour éviter d’écrire sur `live`.
   * Passe `live` seulement quand tu veux la prod.
   */
  xanoDataSource?: string;
}

export interface ErnestEvent {
  type: 'module_start' | 'step_answered' | 'module_complete' | 'tip_viewed';
  payload?: {
    moduleId?: string;
    stepId?: string;
    optionId?: string;
    correct?: boolean;
    timestamp?: number;
  };
}
