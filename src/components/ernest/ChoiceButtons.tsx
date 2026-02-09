import { Option } from '@/types/ernest';
import { Check, X } from 'lucide-react';

interface ChoiceButtonsProps {
  options: Option[];
  selectedOption: string | null;
  showFeedback: boolean;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
}

export const ChoiceButtons = ({
  options,
  selectedOption,
  showFeedback,
  onSelect,
  disabled = false,
}: ChoiceButtonsProps) => {
  const singleOption = options.length <= 1;
  return (
    <div
      className={`w-full max-w-full min-w-0 animate-fade-in ${
        singleOption
          ? 'flex flex-col items-center justify-center gap-2 xs:gap-3 sm:gap-4'
          : 'grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4 md:gap-4 lg:gap-5 justify-items-stretch'
      }`}
    >
      {options.map((option) => {
        const isSelected = selectedOption === option.id;
        const answered = showFeedback;
        const isCorrect = option.correct && answered && isSelected;
        const isIncorrect = !option.correct && answered && isSelected;

        const buttonEl = (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={disabled || showFeedback}
            aria-label={option.label}
            className={`group relative w-full min-w-0 ${singleOption ? 'max-w-md' : 'max-w-full'}
              py-3 px-3 xs:py-3.5 xs:px-4 sm:py-4 sm:px-4 md:py-4 md:px-5 lg:py-4 lg:px-6
              rounded-lg sm:rounded-xl md:rounded-xl
              min-h-[44px] xs:min-h-[48px] sm:min-h-[52px] md:min-h-[56px] lg:min-h-[56px]
              transition-all duration-300 transform touch-manipulation
              text-center
              ${!answered && 'active:translate-y-0.5 hover:-translate-y-0.5 sm:active:translate-y-1 sm:hover:-translate-y-1'} ${
              isCorrect 
                ? 'bg-gradient-to-br from-success/90 to-success/70 shadow-lg shadow-success/20 ring-2 ring-success/30' 
                : isIncorrect 
                  ? 'bg-gradient-to-br from-error/90 to-error/70 shadow-lg shadow-error/20 ring-2 ring-error/30'
                  : 'bg-gradient-to-br from-card to-muted/80 shadow-md hover:shadow-lg border border-border/50 hover:border-primary/30 hover:shadow-primary/10'
            } ${!answered ? 'hover:shadow-xl' : ''} ${
              disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
            } focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background`}
          >
            {/* Effet de brillance au survol */}
            {!answered && !disabled && (
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
            
            {/* Contenu du bouton */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 xs:gap-2 sm:gap-2 w-full min-w-0 text-center">
              <span className={`block w-full min-w-0 break-words leading-snug sm:leading-relaxed font-medium text-sm sm:text-base md:text-[15px] text-center ${
                isCorrect || isIncorrect ? 'text-white' : 'text-foreground'
              }`}>
                {option.label}
              </span>
              {answered && isSelected && (
                <span className={`inline-flex items-center justify-center w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 rounded-full flex-shrink-0 ${
                  isCorrect 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/20 text-white'
                }`}>
                  {isCorrect ? (
                    <Check className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4" strokeWidth={3} />
                  ) : (
                    <X className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4" strokeWidth={3} />
                  )}
                </span>
              )}
            </div>
          </button>
        );
        return buttonEl;
      })}
    </div>
  );
};
