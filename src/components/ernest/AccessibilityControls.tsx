import { useState } from 'react';
import { Button } from '../ui';
import { Type, Contrast } from 'lucide-react';

export const AccessibilityControls = () => {
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [highContrast, setHighContrast] = useState(false);

  const handleTextSizeChange = () => {
    const sizes: Array<'normal' | 'large' | 'xl'> = ['normal', 'large', 'xl'];
    const currentIndex = sizes.indexOf(textSize);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    setTextSize(nextSize);

    // Apply to document
    document.body.classList.remove('text-mode-normal', 'text-mode-large', 'text-mode-xl');
    document.body.classList.add(`text-mode-${nextSize}`);
  };

  const handleContrastToggle = () => {
    setHighContrast(!highContrast);
    
    // Apply to document
    if (!highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  return (
    <div className="fixed flex gap-2 z-50" style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))', right: 'max(1rem, env(safe-area-inset-right))' }}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleTextSizeChange}
        className="rounded-full shadow-lg bg-card hover:bg-accent min-w-[44px] min-h-[44px] touch-manipulation"
        aria-label={`Taille de texte: ${textSize}`}
        title="Changer la taille du texte"
      >
        <Type className="w-5 h-5" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleContrastToggle}
        className={`rounded-full shadow-lg min-w-[44px] min-h-[44px] touch-manipulation ${
          highContrast ? 'bg-foreground text-background' : 'bg-card hover:bg-accent'
        }`}
        aria-label={highContrast ? 'Désactiver contraste élevé' : 'Activer contraste élevé'}
        title="Basculer le contraste élevé"
      >
        <Contrast className="w-5 h-5" />
      </Button>
    </div>
  );
};
