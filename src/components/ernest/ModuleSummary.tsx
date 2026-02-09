import { Module } from '@/types/ernest';
import { Button } from '../ui';
import { CheckCircle2, Lightbulb, Target, ArrowLeft } from 'lucide-react';

interface ModuleSummaryProps {
  module: Module;
  onContinue: () => void;
  onBackToMenu: () => void;
}

export const ModuleSummary = ({
  module,
  onContinue,
  onBackToMenu,
}: ModuleSummaryProps) => {
  return (
    <div className="flex-1 w-full min-w-0 max-w-full bg-background flex items-center justify-center p-3 xs:p-4 sm:p-6 safe-area overflow-y-auto overflow-x-hidden">
      <div className="w-full max-w-2xl min-w-0 mx-auto px-0 space-y-4 sm:space-y-5 animate-scale-in py-4">
        {/* Success Banner */}
        <div className="bg-success/10 border border-success/20 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/80 border border-success/20 shadow-sm flex-shrink-0">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-success" />
            </div>
            <div className="flex-1 text-left">
              <h1 className="text-2xl sm:text-[28px] font-semibold text-foreground mb-1">
                Mission réussie ! ✅
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Vous avez terminé le module "{module.title}"
              </p>
            </div>
          </div>
        </div>

        {/* Key Points */}
        <div className="bg-card rounded-2xl p-4 sm:p-6 border-2 border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Target className="w-5 h-5 text-primary flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">À retenir</h2>
          </div>
          <ul className="space-y-2 sm:space-y-3">
            {module.summary.keypoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="text-foreground pt-0.5">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Steps */}
        <div className="bg-warning-light rounded-2xl p-4 sm:p-6 border-2 border-warning/20 shadow-sm">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Lightbulb className="w-5 h-5 text-warning flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              3 actions concrètes
            </h2>
          </div>
          <ul className="space-y-2 sm:space-y-3">
            {module.summary.actions.map((action, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 text-warning text-lg">→</span>
                <span className="text-foreground pt-0.5">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onContinue}
            className="flex-1 py-5 sm:py-6 text-base sm:text-lg rounded-xl min-h-[44px] touch-manipulation"
            size="lg"
          >
            Passer au module suivant
          </Button>
          <Button
            onClick={onBackToMenu}
            variant="outline"
            className="flex-1 py-5 sm:py-6 text-base sm:text-lg rounded-xl flex items-center justify-center gap-2 border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-sm min-h-[44px] touch-manipulation"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au menu</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
