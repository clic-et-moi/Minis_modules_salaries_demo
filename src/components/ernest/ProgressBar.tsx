import { Module, Progress } from '@/types/ernest';
import { Code2 } from 'lucide-react';

interface ProgressBarProps {
  module: Module;
  progress: Progress;
}

export const ProgressBar = ({ module, progress }: ProgressBarProps) => {
  const totalSteps = module.steps.length;
  const completedSteps = progress.answeredSteps.length;
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-foreground/80" />
          <h2 className="font-semibold text-foreground">{module.title}</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {completedSteps} / {totalSteps}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression: ${completedSteps} étapes sur ${totalSteps} complétées`}
        />
      </div>
    </div>
  );
};
