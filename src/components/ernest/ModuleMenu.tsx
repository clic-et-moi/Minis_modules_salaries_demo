import { Module, Progress } from '@/types/ernest';
import { Check, Users, ShieldAlert, Lock, Shield, AlertTriangle, MessageCircle, Smartphone } from 'lucide-react';
import { Card } from '../ui';

interface ModuleMenuProps {
  modules: Module[];
  progress: Record<string, Progress>;
  overallProgress: number;
  onSelectModule: (module: Module) => void;
}

export const ModuleMenu = ({
  modules,
  progress,
  overallProgress,
  onSelectModule,
}: ModuleMenuProps) => {
  const getMotivationalMessage = () => {
    if (overallProgress === 100) return "Champion ! Tous les modules sont complétés !";
    if (overallProgress >= 80) return "🌟 Presque au sommet ! Encore un petit effort !";
    if (overallProgress >= 60) return "🚀 Vous êtes sur la bonne voie !";
    if (overallProgress >= 40) return "💪 Continuez, vous progressez bien !";
    if (overallProgress >= 20) return "✨ Excellent départ ! Continuez comme ça !";
    return "🎯 Commencez votre parcours cyber !";
  };

  return (
    <div
      className="flex-1 w-full min-w-0 max-w-full bg-background overflow-x-hidden overflow-y-auto
        px-3 py-4 xs:px-4 xs:py-4 sm:px-4 sm:py-5 md:px-6 md:py-6
        pb-[max(80px,env(safe-area-inset-bottom))]
        pl-[max(12px,env(safe-area-inset-left))]
        pr-[max(12px,env(safe-area-inset-right))]
        pt-[max(16px,env(safe-area-inset-top))]"
    >
      <div className="w-full min-w-0 min-h-[100dvh] px-0 space-y-3 xs:space-y-4 sm:space-y-6">
        <div className="text-center space-y-1 xs:space-y-2">
          <h1 className="text-sm xs:text-base sm:text-lg font-['Work_Sans'] font-bold text-foreground leading-tight">
            Les minis modules cyber
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sécurité intelligente à portée de main
          </p>
        </div>

        {/* Progress Overview with Blue Styling */}
        <Card className="p-3 xs:p-4 sm:p-6 min-w-0 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm">
          <div className="space-y-3 xs:space-y-4">
            <div className="flex items-center justify-between gap-2 xs:gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-primary mb-1 truncate">Votre progression</p>
                <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary tabular-nums">{overallProgress}%</p>
              </div>
              <div className="text-2xl xs:text-3xl sm:text-4xl flex-shrink-0" aria-hidden>
                {overallProgress === 100 ? "🏆" : overallProgress >= 50 ? "⭐" : "🎯"}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2 min-w-0">
              <div className="w-full min-w-0 bg-white/80 rounded-full h-2.5 xs:h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-primary to-primary-glow h-full transition-all duration-500 ease-out rounded-full min-w-[2px]"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <p className="text-xs xs:text-sm font-medium text-primary/80 text-center line-clamp-2">
                {getMotivationalMessage()}
              </p>
            </div>
          </div>
        </Card>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 min-w-0">
          {modules.map((module) => {
            const moduleProgress = progress[module.id];
            const isCompleted = moduleProgress?.completed || false;
            
            // Map module IDs to Lucide icons
            const getModuleIcon = (id: string) => {
              switch (id) {
                case 'cyberharcelement':
                case 'harcelement':
                  return <Users className="w-6 h-6 text-blue-500" />;
                case 'phishing_cible':
                  return <ShieldAlert className="w-6 h-6 text-orange-500" />;
                case 'fuite_de_donnees':
                case 'fuite_donnees':
                  return <AlertTriangle className="w-6 h-6 text-red-500" />;
                case 'mots_de_passe':
                case 'mdp':
                  return <Lock className="w-6 h-6 text-purple-500" />;
                case 'faux_conseiller':
                case 'faux_banque':
                  return <Smartphone className="w-6 h-6 text-green-500" />;
                default:
                  return <MessageCircle className="w-6 h-6 text-gray-500" />;
              }
            };

            // Get difficulty level color
            const getDifficultyColor = (level: string) => {
              switch (level.toLowerCase()) {
                case 'débutant':
                  return 'bg-green-100 text-green-800';
                case 'intermédiaire':
                  return 'bg-orange-100 text-orange-800';
                case 'avancé':
                  return 'bg-red-100 text-red-800';
                default:
                  return 'bg-gray-100 text-gray-800';
              }
            };

            return (
              <button
                key={module.id}
                onClick={() => onSelectModule(module)}
                className="group relative p-3 xs:p-3 sm:p-4 rounded-xl border border-border bg-card text-left transition-all hover:shadow-md hover:border-primary/30 hover:bg-card/80 min-h-[44px] touch-manipulation w-full min-w-0 overflow-hidden"
                aria-label={`${module.title} - ${module.duration} - ${module.level}`}
              >
                <div className="flex flex-col h-full min-w-0">
                  <div className="flex items-start gap-2 xs:gap-2 sm:gap-3 mb-2 xs:mb-2 sm:mb-3 min-w-0">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 text-primary">
                      {getModuleIcon(module.id)}
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className="font-semibold text-sm xs:text-base sm:text-lg text-foreground leading-tight line-clamp-2 break-words">
                        {module.title}
                      </h3>
                    </div>
                    {isCompleted && (
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs sm:text-[14px] text-muted-foreground mb-2 xs:mb-3 sm:mb-4 flex-grow line-clamp-2 sm:line-clamp-none min-w-0 break-words">
                    {module.description}
                  </p>
                  
                  <div className="flex items-center justify-between gap-2 mt-auto min-w-0 flex-wrap">
                    <span className="inline-flex items-center text-xs text-muted-foreground flex-shrink-0">
                      <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="truncate">{module.duration}</span>
                    </span>
                    
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 truncate max-w-full ${getDifficultyColor(module.level)}`}>
                      {module.level}
                    </span>
                  </div>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/30 transition-all pointer-events-none" aria-hidden="true"></div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
