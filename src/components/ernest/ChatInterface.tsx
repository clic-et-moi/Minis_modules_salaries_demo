import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Module, Step, ConversationMessage, Progress } from '@/types/ernest';
import { ChatBubble } from './ChatBubble';
import { ChoiceButtons } from './ChoiceButtons';
import { Button } from '../ui';
import { ArrowLeft, Lightbulb } from 'lucide-react';

interface ChatInterfaceProps {
  module: Module;
  currentStep: Step;
  conversationHistory: ConversationMessage[];
  selectedOption: string | null;
  showFeedback: boolean;
  showTip: boolean;
  progress: Progress;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  onBackToMenu: () => void;
}

export const ChatInterface = ({
  module,
  currentStep,
  conversationHistory,
  selectedOption,
  showFeedback,
  showTip,
  progress,
  onSelectOption,
  onNext,
  onBackToMenu,
}: ChatInterfaceProps) => {
  // Tous les états et refs doivent être déclarés au début du composant
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showChoices, setShowChoices] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [headerContainer, setHeaderContainer] = useState<HTMLElement | null>(null);
  
  // Référence pour le conteneur du titre
  const titleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = document.getElementById('chat-interface-header');
    if (container) {
      setHeaderContainer(container);
    }

    return () => {
      setHeaderContainer(null);
    };
  }, []);

  const latestUserMessage = useMemo(() => {
    return [...conversationHistory]
      .reverse()
      .find((m) => m.sender === 'user' && m.stepId === currentStep.id);
  }, [conversationHistory, currentStep.id]);

  const isNarrativeStep = currentStep.type === 'narrative' || currentStep.type === 'image';
  const selectedOptionData = currentStep.options?.find(
    (opt) => opt.id === selectedOption
  );

  const answeredCount = progress.answeredSteps.length;
  const totalSteps = module.steps.length || 1;
  const progressPercentage = (answeredCount / totalSteps) * 100;

  useEffect(() => {
    // Scroll to bottom when new messages arrive, avoid fighting with CSS animations
    const el = chatEndRef.current;
    if (!el) return;
    // Schedule after layout/paint for smoother result
    requestAnimationFrame(() => {
      // Use instant scroll to avoid double easing with message animations
      el.scrollIntoView({ behavior: 'auto', block: 'end' });
    });
  }, [conversationHistory, showFeedback, displayedMessages]);

  useEffect(() => {
    // Auto-advance after showing feedback
    if (showFeedback) {
      const timer = setTimeout(() => {
        onNext();
      }, 1200); // even faster transition to next question
      return () => clearTimeout(timer);
    }
  }, [showFeedback, onNext]);

  useEffect(() => {
    // Auto-display narrative messages sequentially with cancellable flow
    let aborted = false;
    const run = async () => {
      if (isNarrativeStep && currentStep.messages && currentStep.messages.length > 0) {
        setIsAutoPlaying(true);
        setDisplayedMessages([]);
        for (let index = 0; index < currentStep.messages.length; index++) {
          if (aborted) return;
          await new Promise((r) => setTimeout(r, index === 0 ? 0 : 1200));
          if (aborted) return;
          setDisplayedMessages(prev => [...prev, currentStep.messages![index]]);
        }
        setIsAutoPlaying(false);
        if (currentStep.next) {
          // Allow message appear animation to finish before advancing
          setTimeout(() => { if (!aborted) onNext(); }, 400);
        }
      } else {
        setDisplayedMessages([]);
        setIsAutoPlaying(false);
      }
    };
    run();
    return () => { aborted = true; };
  }, [currentStep.id]);

  useEffect(() => {
    // Delay showing choices for better UX
    if (!isNarrativeStep) {
      const timer = setTimeout(() => setShowChoices(true), 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep.id, isNarrativeStep]);

  // Removed temporary colored answer card; feedback now appears as a normal chat message

  const renderHeader = (className = '') => {
    const handleTitleClick = () => {
      // Afficher le titre complet dans une alerte au clic
      alert(module.title);
    };

    return (
      <div className={`flex items-center gap-3 w-full ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToMenu}
          className="shrink-0 h-10 w-10 min-w-[44px] min-h-[44px] rounded-full bg-card border border-border/60 shadow-sm hover:bg-primary/5 hover:border-primary/30 transition-all flex items-center justify-center p-0 touch-manipulation dark:bg-card/80 dark:border-border/40 dark:hover:bg-primary/10"
          aria-label="Retour au menu"
        >
          <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-foreground -ml-px dark:text-foreground/90" />
        </Button>
        <div className="flex-1 min-w-0 flex flex-col w-full">
          <div 
            ref={titleContainerRef}
            className="w-full overflow-hidden relative flex-1"
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div className="min-w-0 w-full">
              <div className="relative w-full">
                <h2
                  className="text-sm font-semibold text-foreground/90 cursor-pointer w-full truncate px-2"
                  onClick={handleTitleClick}
                  title={module.title}
                >
                  {module.title}
                </h2>
              </div>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-1.5 overflow-hidden min-w-0">
            <div
              className="bg-primary h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progression: ${answeredCount} étapes sur ${totalSteps} complétées`}
            />
          </div>
        </div>
        <div className="text-xs sm:text-sm font-medium text-muted-foreground tabular-nums whitespace-nowrap flex-shrink-0">
          {answeredCount}/{totalSteps}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-w-0 max-w-full min-h-[100dvh] max-h-[100dvh] overflow-hidden bg-white dark:bg-background flex flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))] safe-top">
      {headerContainer ? createPortal(renderHeader('w-full max-w-3xl px-2 sm:px-4'), headerContainer) : null}
      
      {/* En-tête fixe si non dans un conteneur */}
      {!headerContainer && (
        <div className="bg-white dark:bg-background backdrop-blur-sm border-b border-border w-full min-w-0 flex-shrink-0 safe-top">
          <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
            {renderHeader('w-full')}
          </div>
        </div>
      )}

      {/* Conteneur principal : flex-1 + min-h-0 = hauteur responsive sans calc fixe */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden min-w-0">
        {/* Zone de messages avec défilement */}
        <div 
          className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-2 overflow-y-auto overflow-x-hidden no-scrollbar flex-1 min-h-0 min-w-0"
        >
          <div className="space-y-4">
            {/* Messages de la conversation */}
            {conversationHistory.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}

            {/* Messages narratifs */}
            {isNarrativeStep && displayedMessages.map((text, idx) => (
              <ChatBubble 
                key={`narrative-${currentStep.id}-${idx}`} 
                message={{ 
                  id: `narrative-${currentStep.id}-${idx}`, 
                  sender: 'ernest', 
                  text,
                  image: idx === 0 ? currentStep.image : undefined
                }} 
              />
            ))}


            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Zone d'action fixe en bas */}
        <div className="border-t border-border bg-white dark:bg-background backdrop-blur-sm w-full flex-shrink-0 safe-bottom">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4 w-full">
            {!isNarrativeStep && !showFeedback && showChoices && (
              <>
                <ChoiceButtons
                  options={currentStep.options || []}
                  selectedOption={selectedOption}
                  showFeedback={showFeedback}
                  onSelect={onSelectOption}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
