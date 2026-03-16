import { useEffect, useRef, useState } from 'react';
import ChatArea from '../components/chat/ChatArea';
import ContactDetails from '../components/chat/ContactDetails';
import ConversationList from '../components/chat/ConversationList';

const conversationNames: Record<string, string> = {
  '1': 'Adriana Hawk',
  '2': 'Samantha Smith',
  '3': 'Jane Lee',
  '4': 'Adam Newbrick',
  '5': 'John Doe',
  '6': 'Tom Hig',
  '7': 'Johnny Len',
  '8': 'Adrian Kolen',
};

export default function Chat() {
  const [selectedId, setSelectedId] = useState<string | null>('2');
  const [showDetails, setShowDetails] = useState(true);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Track closing state for contact details animation
  const [detailsClosing, setDetailsClosing] = useState(false);
  const closingTimeout = useRef<ReturnType<typeof setTimeout>>();

  const selectedName = selectedId
    ? (conversationNames[selectedId] ?? null)
    : null;

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
        <ChatArea conversationName={selectedName} onBack={handleBack} />
      </div>

      {/* Contact details: hidden on mobile, animated on desktop */}
      {(showDetails || detailsClosing) && (
        <div
          className={`hidden md:flex ${detailsClosing ? 'animate-panel-out' : 'animate-panel-in'}`}
        >
          <ContactDetails name={selectedName} onClose={handleCloseDetails} />
        </div>
      )}
    </div>
  );
}
