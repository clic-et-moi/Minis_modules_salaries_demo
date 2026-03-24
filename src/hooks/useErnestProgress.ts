import { useState, useEffect, useRef, useMemo } from 'react';
import { Progress } from '@/types/ernest';

const STORAGE_KEY = 'ernest_progress_v1';

export type UseErnestProgressOptions = {
  /** Progression injectée par l’app hôte (ex. WeWeb après GET Xano). Fusionnée avec le localStorage. */
  initialProgress?: Record<string, Progress>;
  /** Appelé après chaque sauvegarde locale (localStorage + state). Pour POST/PATCH Xano côté hôte. */
  onProgressChange?: (progress: Record<string, Progress>) => void;
};

/** Fusionne deux cartes de progression (union des étapes, completed en OU, étape courante la plus avancée). */
export function mergeProgressRecords(
  a: Record<string, Progress>,
  b: Record<string, Progress>
): Record<string, Progress> {
  const ids = new Set([...Object.keys(a), ...Object.keys(b)]);
  const result: Record<string, Progress> = {};
  for (const moduleId of ids) {
    const pa = a[moduleId];
    const pb = b[moduleId];
    if (!pa && pb) {
      result[moduleId] = { ...pb, moduleId };
    } else if (pa && !pb) {
      result[moduleId] = { ...pa, moduleId };
    } else if (pa && pb) {
      const answeredSteps = [...new Set([...pa.answeredSteps, ...pb.answeredSteps])];
      const completed = pa.completed || pb.completed;
      const pickCurrent =
        pa.answeredSteps.length >= pb.answeredSteps.length
          ? pa.currentStepId
          : pb.currentStepId;
      result[moduleId] = {
        moduleId,
        answeredSteps,
        completed,
        currentStepId: pickCurrent ?? pa.currentStepId ?? pb.currentStepId,
      };
    }
  }
  return result;
}

function loadProgressFromStorage(): Record<string, Progress> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Record<string, Progress>;
    }
  } catch (error) {
    console.error('Failed to load Ernest progress:', error);
  }
  return {};
}

export const useErnestProgress = (options: UseErnestProgressOptions = {}) => {
  const { initialProgress, onProgressChange } = options;
  const onProgressChangeRef = useRef(onProgressChange);
  onProgressChangeRef.current = onProgressChange;

  const [progress, setProgress] = useState<Record<string, Progress>>({});

  const initialProgressKey = useMemo(() => {
    if (initialProgress === undefined) return '__none__';
    return JSON.stringify(initialProgress);
  }, [initialProgress]);

  useEffect(() => {
    const local = loadProgressFromStorage();
    let merged: Record<string, Progress>;
    if (initialProgressKey === '__none__') {
      merged = local;
    } else {
      try {
        const remote = JSON.parse(initialProgressKey) as Record<string, Progress>;
        merged = mergeProgressRecords(local, remote);
      } catch {
        merged = local;
      }
    }
    setProgress(merged);
    try {
      if (Object.keys(merged).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to persist merged Ernest progress:', error);
    }
  }, [initialProgressKey]);

  const saveProgress = (newProgress: Record<string, Progress>) => {
    try {
      if (Object.keys(newProgress).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      setProgress(newProgress);
      onProgressChangeRef.current?.(newProgress);
    } catch (error) {
      console.error('Failed to save Ernest progress:', error);
    }
  };

  const updateModuleProgress = (
    moduleId: string,
    updates: Partial<Progress>
  ) => {
    const newProgress = {
      ...progress,
      [moduleId]: {
        ...(progress[moduleId] || {
          moduleId,
          currentStepId: null,
          completed: false,
          answeredSteps: [],
        }),
        ...updates,
      },
    };
    saveProgress(newProgress);
  };

  const markStepAnswered = (moduleId: string, stepId: string) => {
    const moduleProgress = progress[moduleId] || {
      moduleId,
      currentStepId: null,
      completed: false,
      answeredSteps: [],
    };

    if (!moduleProgress.answeredSteps.includes(stepId)) {
      updateModuleProgress(moduleId, {
        answeredSteps: [...moduleProgress.answeredSteps, stepId],
      });
    }
  };

  const setCurrentStep = (moduleId: string, stepId: string | null) => {
    updateModuleProgress(moduleId, { currentStepId: stepId });
  };

  const completeModule = (moduleId: string, totalModules?: number) => {
    const newProgress = {
      ...progress,
      [moduleId]: {
        ...(progress[moduleId] || {
          moduleId,
          currentStepId: null,
          completed: false,
          answeredSteps: [],
        }),
        completed: true,
        currentStepId: null,
      },
    };
    const completedCount = Object.values(newProgress).filter((p) => p.completed).length;
    if (totalModules !== undefined && totalModules > 0 && completedCount >= totalModules) {
      saveProgress({});
    } else {
      saveProgress(newProgress);
    }
  };

  const getModuleProgress = (moduleId: string): Progress => {
    return (
      progress[moduleId] || {
        moduleId,
        currentStepId: null,
        completed: false,
        answeredSteps: [],
      }
    );
  };

  const getOverallProgress = (totalModules: number): number => {
    const completedCount = Object.values(progress).filter(
      (p) => p.completed
    ).length;
    const calculatedProgress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
    return Math.min(calculatedProgress, 100);
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({});
    onProgressChangeRef.current?.({});
  };

  return {
    progress,
    updateModuleProgress,
    markStepAnswered,
    setCurrentStep,
    completeModule,
    getModuleProgress,
    getOverallProgress,
    resetProgress,
  };
};
