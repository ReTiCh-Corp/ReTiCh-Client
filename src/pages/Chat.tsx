import { useEffect, useRef, useState } from 'react';
import ChatArea from '../components/chat/ChatArea';
import ContactDetails from '../components/chat/ContactDetails';
import ConversationList from '../components/chat/ConversationList';
import { useConversation } from '../hooks/useConversations';
import { useWebSocket } from '../hooks/useWebSocket';

export default function Chat() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(true);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Track closing state for contact details animation
  const [detailsClosing, setDetailsClosing] = useState(false);
  const closingTimeout = useRef<ReturnType<typeof setTimeout>>();

  const { status: wsStatus, sendEvent } = useWebSocket();
  const { data: conversationData } = useConversation(selectedId ?? '');
  const conversation = conversationData?.data;
  const selectedName = conversation?.name ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileView('chat');
  };

  const handleBack = () => {
    setMobileView('list');
  };

  const handleCloseDetails = () => {
    setDetailsClosing(true);
    closingTimeout.current = setTimeout(() => {
      setShowDetails(false);
      setDetailsClosing(false);
    }, 220);
  };

  useEffect(() => {
    return () => {
      if (closingTimeout.current) clearTimeout(closingTimeout.current);
    };
  }, []);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Conversation list: always visible on desktop, animated on mobile */}
      <div
        className={`
          ${mobileView === 'list' ? 'flex flex-1 animate-slide-in-left' : 'hidden'}
          md:flex md:flex-none
        `}
      >
        <ConversationList selectedId={selectedId} onSelect={handleSelect} />
      </div>

      {/* Chat area: always visible on desktop, animated on mobile */}
      <div
        className={`
          ${mobileView === 'chat' ? 'flex flex-1 animate-slide-in-right' : 'hidden'}
          md:flex md:flex-1 min-w-0
        `}
      >
        <ChatArea conversationId={selectedId} conversationName={selectedName} wsStatus={wsStatus} sendWsEvent={sendEvent} onBack={handleBack} />
      </div>

      {/* Contact details: hidden on mobile, animated on desktop */}
      {(showDetails || detailsClosing) && (
        <div
          className={`hidden md:flex ${detailsClosing ? 'animate-panel-out' : 'animate-panel-in'}`}
        >
          <ContactDetails
            conversationId={selectedId}
            onClose={handleCloseDetails}
          />
        </div>
      )}
    </div>
  );
}
