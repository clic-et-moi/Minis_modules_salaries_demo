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
      {/* hasProAccess : passer true quand project_id Xano donne accès PRO */}
      <ErnestCyberChat
        hasProAccess={true}
        xanoUserId={import.meta.env.VITE_XANO_USER_ID}
        xanoAuthToken={import.meta.env.VITE_XANO_AUTH_TOKEN}
        onEvent={(event) => {
          console.log('Ernest event from prop:', event);
        }}
      />
    </div>
  );
};

export default Index;
