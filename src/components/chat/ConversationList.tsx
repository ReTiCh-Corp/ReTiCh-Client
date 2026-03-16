import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Adriana Hawk',
    avatar: 'AH',
    lastMessage: 'In fact, this was an option for all colleagu...',
    time: '1 min',
    unread: 4,
    online: true,
  },
  {
    id: '2',
    name: 'Samantha Smith',
    avatar: 'SS',
    lastMessage: 'Biggie Smalls – Sky is the limit.mp3',
    time: 'Yesterday',
    unread: 0,
    online: true,
  },
  {
    id: '3',
    name: 'Jane Lee',
    avatar: 'JL',
    lastMessage: 'Nice one!',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: '4',
    name: 'Adam Newbrick',
    avatar: 'AN',
    lastMessage: 'See you soon :)',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: '5',
    name: 'John Doe',
    avatar: 'JD',
    lastMessage: 'Big up, and take care man :)',
    time: '2 days ago',
    unread: 0,
    online: true,
  },
  {
    id: '6',
    name: 'Tom Hig',
    avatar: 'TH',
    lastMessage: 'Sure!',
    time: '2 days ago',
    unread: 0,
    online: false,
  },
  {
    id: '7',
    name: 'Johnny Len',
    avatar: 'JL',
    lastMessage: 'Last time it was amazing, where did you ...',
    time: '23/09/2019',
    unread: 2,
    online: false,
  },
  {
    id: '8',
    name: 'Adrian Kolen',
    avatar: 'AK',
    lastMessage: 'Ol times good times man. Preciate latest ...',
    time: '23/09/2019',
    unread: 0,
    online: false,
  },
];

interface ConversationListProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  selectedId,
  onSelect,
}: ConversationListProps) {
  const [search, setSearch] = useState('');

  const filtered = mockConversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full w-full md:w-[320px] md:min-w-[320px] border-r border-border bg-white">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-text">Messages</h2>
          <button
            type="button"
            className="w-8 h-8 rounded-lg hover:bg-grey-100 flex items-center justify-center text-grey-400 hover:text-grey-600 transition-colors cursor-pointer"
          >
            <Plus size={18} />
          </button>
        </div>
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400"
          />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {filtered.map((conv) => (
          <button
            key={conv.id}
            type="button"
            onClick={() => onSelect(conv.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 cursor-pointer text-left
              ${
                selectedId === conv.id
                  ? 'bg-primary-50 border border-primary-100'
                  : 'hover:bg-grey-50 border border-transparent'
              }
            `}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className={`
                w-11 h-11 rounded-full flex items-center justify-center font-display font-semibold text-sm
                ${
                  selectedId === conv.id
                    ? 'bg-primary-200 text-primary-800'
                    : 'bg-grey-200 text-grey-600'
                }
              `}
              >
                {conv.avatar}
              </div>
              {conv.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-leaf-500 border-2 border-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className={`text-sm font-semibold truncate ${selectedId === conv.id ? 'text-primary-900' : 'text-text'}`}
                >
                  {conv.name}
                </span>
                <span className="text-[11px] text-grey-400 shrink-0 ml-2">
                  {conv.time}
                </span>
              </div>
              <p className="text-xs text-text-muted truncate">
                {conv.lastMessage}
              </p>
            </div>

            {/* Unread badge */}
            {conv.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {conv.unread}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
