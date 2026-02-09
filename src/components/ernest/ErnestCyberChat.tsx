import { useState, useEffect } from 'react';
import { ErnestCyberChatProps, ErnestState, ConversationMessage, Module, Step } from '@/types/ernest';
import { useErnestProgress } from '@/hooks/useErnestProgress';
import defaultModulesData from '@/data/modules.json';
import { WelcomeScreen } from './WelcomeScreen';
import { ModuleMenu } from './ModuleMenu';
import { ChatInterface } from './ChatInterface';
import { ModuleSummary } from './ModuleSummary';

export const ErnestCyberChat = ({
  modules: customModules,
  theme,
  onEvent,
}: ErnestCyberChatProps) => {
  const modules = (customModules || defaultModulesData.modules) as Module[];
  const progressHook = useErnestProgress();

  const [state, setState] = useState<ErnestState>({
    currentView: 'menu',
    selectedModule: null,
    currentStep: null,
    selectedOption: null,
    showFeedback: false,
    showTip: false,
    conversationHistory: [],
    progress: progressHook.progress,
  });

  // Apply custom theme if provided
  useEffect(() => {
    if (theme?.primary) {
      document.documentElement.style.setProperty('--primary', theme.primary);
    }
    if (theme?.radius) {
      document.documentElement.style.setProperty('--radius', `${theme.radius}px`);
    }
  }, [theme]);

  // Sync progress
  useEffect(() => {
    setState((prev) => ({ ...prev, progress: progressHook.progress }));
  }, [progressHook.progress]);

  const dispatchEvent = (type: string, payload?: any) => {
    const event = { type, payload: { ...payload, timestamp: Date.now() } };
    
    // Custom callback
    if (onEvent) {
      onEvent(event as any);
    }
    
    // Window event for analytics
    window.dispatchEvent(
      new CustomEvent('ernest_event', { detail: event })
    );
  };

  const handleStart = () => {
    setState((prev) => ({ ...prev, currentView: 'menu' }));
  };

  const handleSelectModule = (module: Module) => {
    const moduleProgress = progressHook.getModuleProgress(module.id);
    
    // Find current step or start from beginning
    let startStep: Step;
    if (moduleProgress.currentStepId) {
      startStep = module.steps.find((s) => s.id === moduleProgress.currentStepId) || module.steps[0];
    } else {
      startStep = module.steps[0];
    }

    // Don't initialize conversation here - let ChatInterface handle it
    setState((prev) => ({
      ...prev,
      currentView: 'module',
      selectedModule: module,
      currentStep: startStep,
      conversationHistory: [],
      selectedOption: null,
      showFeedback: false,
      showTip: false,
    }));

    progressHook.setCurrentStep(module.id, startStep.id);
    dispatchEvent('module_start', { moduleId: module.id });
  };

  // Ensure Ernest's question is persisted in history on step change
  useEffect(() => {
    const step = state.currentStep;
    if (!step) return;
    const isQuestion = step.type !== 'narrative' && !!step.message;
    if (!isQuestion) return;

    const alreadyLogged = state.conversationHistory.some(
      (m) => m.stepId === step.id && m.sender === 'ernest' && m.text === step.message
    );
    if (alreadyLogged) return;

    const ernestQuestion: ConversationMessage = {
      id: `q-${step.id}`,
      sender: 'ernest',
      text: step.message!,
      stepId: step.id,
    };

    setState((prev) => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, ernestQuestion],
    }));
  }, [state.currentStep]);

  const handleSelectOption = (optionId: string) => {
    if (!state.currentStep || state.showFeedback || state.selectedOption) return;

    const option = state.currentStep.options?.find((opt) => opt.id === optionId);
    if (!option) return;

    // Add user message with correctness tick/cross
    const userMessage: ConversationMessage = {
      id: `user-${state.currentStep.id}`,
      sender: 'user',
      text: `${option.correct ? '✅' : '❌'} ${option.label}`,
      stepId: state.currentStep.id,
    };

    const typingId = `typing-${state.currentStep.id}`;
    const typingMessage: ConversationMessage = {
      id: typingId,
      sender: 'ernest',
      text: '',
      typing: true,
      stepId: state.currentStep.id,
    };

    const currentStepId = state.currentStep.id;
    const feedbackText = option.feedback?.trim();
    const ernestFeedback: ConversationMessage | null = feedbackText
      ? {
          id: `fbk-${currentStepId}`,
          sender: 'ernest',
          text: feedbackText,
          stepId: currentStepId,
        }
      : null;

    setState((prev) => ({
      ...prev,
      selectedOption: optionId,
      conversationHistory: [...prev.conversationHistory, userMessage, typingMessage],
    }));

    setTimeout(() => {
      setState((prev) => {
        const updatedHistory = prev.conversationHistory.filter((m) => m.id !== typingId);

        if (ernestFeedback) {
          updatedHistory.push(ernestFeedback);
        }

        return {
          ...prev,
          showFeedback: true,
          conversationHistory: updatedHistory,
        };
      });
    }, 700);

    // Mark step as answered
    if (state.selectedModule) {
      progressHook.markStepAnswered(state.selectedModule.id, state.currentStep.id);
    }

    dispatchEvent('step_answered', {
      moduleId: state.selectedModule?.id,
      stepId: state.currentStep.id,
      optionId,
      correct: option.correct,
    });
  };

  const handleNext = () => {
    if (!state.currentStep || !state.selectedModule) return;

    const nextStepId = state.currentStep.next;

    if (!nextStepId) {
      // Module completed ; réinitialisation automatique si tous les modules sont terminés
      progressHook.completeModule(state.selectedModule.id, modules.length);
      setState((prev) => ({ ...prev, currentView: 'summary' }));
      dispatchEvent('module_complete', { moduleId: state.selectedModule?.id });
      return;
    }

  // Find next step
  const nextStep = state.selectedModule.steps.find((s) => s.id === nextStepId);
  if (!nextStep) return;

  // Update state - ChatInterface will handle displaying messages
  setState((prev) => ({
    ...prev,
    currentStep: nextStep,
    selectedOption: null,
    showFeedback: false,
    showTip: false,
  }));

  progressHook.setCurrentStep(state.selectedModule.id, nextStep.id);
};

  const handleToggleTip = () => {
    setState((prev) => ({ ...prev, showTip: !prev.showTip }));
    if (!state.showTip) {
      dispatchEvent('tip_viewed', {
        moduleId: state.selectedModule?.id,
        stepId: state.currentStep?.id,
      });
    }
  };

  const handleBackToMenu = () => {
    setState((prev) => ({
      ...prev,
      currentView: 'menu',
      selectedModule: null,
      currentStep: null,
      conversationHistory: [],
      selectedOption: null,
      showFeedback: false,
      showTip: false,
    }));
  };

  const handleContinueFromSummary = () => {
    if (!state.selectedModule) {
      handleBackToMenu();
      return;
    }

    // Find next incomplete module
    const currentIndex = modules.findIndex((m) => m.id === state.selectedModule!.id);
    const nextModule = modules.slice(currentIndex + 1).find((m) => {
      const prog = progressHook.getModuleProgress(m.id);
      return !prog.completed;
    });

    if (nextModule) {
      handleSelectModule(nextModule);
    } else {
      handleBackToMenu();
    }
  };

  return (
    <div className="ernest-cyber-chat flex-1 w-full min-w-0 max-w-full overflow-x-hidden flex flex-col min-h-0" id="ernest-root">
      {state.currentView === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}

      {state.currentView === 'menu' && (
        <ModuleMenu
          modules={modules}
          progress={state.progress}
          overallProgress={progressHook.getOverallProgress(modules.length)}
          onSelectModule={handleSelectModule}
        />
      )}

      {state.currentView === 'module' && state.selectedModule && state.currentStep && (
        <ChatInterface
          module={state.selectedModule}
          currentStep={state.currentStep}
          conversationHistory={state.conversationHistory}
          selectedOption={state.selectedOption}
          showFeedback={state.showFeedback}
          showTip={state.showTip}
          progress={progressHook.getModuleProgress(state.selectedModule.id)}
          onSelectOption={handleSelectOption}
          onNext={handleNext}
          onToggleTip={handleToggleTip}
          onBackToMenu={handleBackToMenu}
        />
      )}

      {state.currentView === 'summary' && state.selectedModule && (
        <ModuleSummary
          module={state.selectedModule}
          onContinue={handleContinueFromSummary}
          onBackToMenu={handleBackToMenu}
        />
      )}

    </div>
  );
};
