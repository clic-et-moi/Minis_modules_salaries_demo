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
  level: string;
  description?: string;
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
  theme?: {
    primary?: string;
    radius?: number;
    compact?: boolean;
  };
  onEvent?: (event: ErnestEvent) => void;
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
