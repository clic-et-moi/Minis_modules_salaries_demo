import { useEffect, useRef, useState } from 'react';
import { ConversationMessage } from '@/types/ernest';
import { Sparkles } from 'lucide-react';

interface ChatBubbleProps {
  message: ConversationMessage;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isErnest = message.sender === 'ernest';
  const text = message.text || '';
  const isCorrect = !isErnest && /✅/.test(text);
  const isIncorrect = !isErnest && /❌/.test(text);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    // Ne pas réinitialiser l'animation si le message existe déjà
    if (node.classList.contains('message-appear-active')) return;
    
    // Déclencher l'animation après un court délai pour assurer que le DOM est prêt
    const timeoutId = setTimeout(() => {
      node.classList.add('message-appear-active');
    }, 10);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message.id]); // Ne dépendre que de l'ID du message

  const bubbleBaseClass = isErnest
    ? 'chat-bubble-ernest'
    : isCorrect
      ? 'chat-bubble-user-correct'
      : isIncorrect
        ? 'chat-bubble-user-incorrect'
        : 'chat-bubble-user';

  const [showTyping, setShowTyping] = useState(!!message.typing);
  const [showContent, setShowContent] = useState(!message.typing);
  const contentRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message.typing && showTyping) {
      // Commencer la transition de fondu
      const timer = setTimeout(() => {
        setShowTyping(false);
        setShowContent(true);
      }, 300); // Temps pour le fondu de sortie
      
      return () => clearTimeout(timer);
    }
  }, [message.typing, showTyping]);

  return (
    <div
      ref={wrapperRef}
      className={`flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4 message-appear will-change-transform-opacity min-w-0 ${
        isErnest ? 'justify-start' : 'justify-end'
      }`}
    >
      {isErnest && (
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 p-0.5 sm:p-1 ml-0 sm:ml-1 -mr-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200 text-blue-600 shadow-sm ring-1 ring-primary/20">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          </div>
        </div>
      )}
      
      <div className={`${bubbleBaseClass} relative`}>
        {/* Conteneur pour les points de suspension avec transition */}
        <div 
          ref={typingRef}
          className={`transition-opacity duration-300 ${showTyping ? 'opacity-100' : 'opacity-0 absolute'}`}
          aria-hidden={!showTyping}
        >
          <div className="typing-dots" aria-label="En train d'écrire">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
        
        {/* Contenu du message avec transition */}
        <div 
          ref={contentRef}
          className={`transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className="leading-relaxed whitespace-pre-line">{message.text}</p>
          {message.image && isErnest && (
            <img 
              src={message.image} 
              alt="Illustration de la conversation sur la cybersécurité" 
              className="mt-3 rounded-lg w-full max-w-full sm:max-w-md object-contain"
            />
          )}
        </div>
      </div>

      {!isErnest && (
        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center text-white text-base sm:text-xl">
          👤
        </div>
      )}
    </div>
  );
};
