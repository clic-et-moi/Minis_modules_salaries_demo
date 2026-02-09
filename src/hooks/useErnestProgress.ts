import { useState, useEffect } from 'react';
import { Progress } from '@/types/ernest';

const STORAGE_KEY = 'ernest_progress_v1';

export const useErnestProgress = () => {
  const [progress, setProgress] = useState<Record<string, Progress>>({});

  // Load progress from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load Ernest progress:', error);
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (newProgress: Record<string, Progress>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
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
    // Ensure progress is capped at 100%
    const calculatedProgress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
    return Math.min(calculatedProgress, 100);
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({});
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
