import { Button } from '../ui';
import { ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="flex-1 w-full min-w-0 max-w-full min-h-[100dvh] bg-gradient-to-br from-[#0EA5E9] via-[#06B6D4] to-[#0EA5E9] text-white flex items-center justify-center p-3 xs:p-4 sm:p-6 safe-area relative overflow-hidden">
      {/* Geometric pattern background - similar to reference image */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-[40%] blur-3xl"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-white/10 rounded-[40%] blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-[40%] blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-white/10 rounded-[40%] blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full min-w-0 text-center space-y-5 sm:space-y-8 relative z-10 animate-fade-in px-1">
        {/* Ernest Logo */}
        <div className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-bold text-lg sm:text-xl border-2 border-white shadow-lg">
          Ernest
        </div>
        
        {/* Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-1">
          Sécurité Intelligente à Portée de Main !
        </h1>
        
        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-xl mx-auto leading-relaxed px-2">
          De La Protection De Base À La Défense Avancée, Ernest Vous Aide À Rester En Sécurité.
        </p>

        {/* CTA Button */}
        <div className="pt-2 sm:pt-4">
          <Button
            onClick={onStart}
            size="lg"
            className="bg-white text-foreground hover:bg-white/95 font-semibold text-sm sm:text-base md:text-lg px-6 py-5 sm:px-8 sm:py-6 h-auto rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] group min-h-[44px] touch-manipulation"
          >
            <span>Commencer</span>
            <ArrowRight className="ml-2 h-5 w-5 inline-block transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Info */}
        <div className="pt-4 sm:pt-6 text-xs sm:text-sm text-white/85">
          <p>5 modules interactifs · 4-6 min chacun</p>
        </div>
      </div>
    </div>
  );
};
