import { ErnestCyberChat } from '@/components/ernest/ErnestCyberChat';
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Listen to Ernest events for potential analytics integration
    const handleErnestEvent = (event: CustomEvent) => {
      console.log('Ernest Event:', event.detail);
    };

    window.addEventListener('ernest_event' as any, handleErnestEvent);
    return () => {
      window.removeEventListener('ernest_event' as any, handleErnestEvent);
    };
  }, []);

  return (
    <div className="ernest-app flex-1 w-full min-w-0 max-w-full overflow-x-hidden flex flex-col min-h-[100dvh]">
      <ErnestCyberChat
        onEvent={(event) => {
          // Optional: handle events in parent component
          console.log('Ernest event from prop:', event);
        }}
      />
    </div>
  );
};

export default Index;
