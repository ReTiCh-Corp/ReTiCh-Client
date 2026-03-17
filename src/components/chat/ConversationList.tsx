import { Loader2, Plus, Search } from 'lucide-react';
import { useEffect } from 'react';
import type { Conversation } from '../../api/conversations';
import { useConversations } from '../../hooks/useConversations';
import { useDebounce } from '../../hooks/useDebounce';
import { useConversationStore } from '../../stores/useConversationStore';

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

interface ConversationListProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  selectedId,
  onSelect,
}: ConversationListProps) {
  const searchTerm = useConversationStore((s) => s.searchTerm);
  const setSearchTerm = useConversationStore((s) => s.setSearchTerm);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data, isLoading, error } = useConversations(
    debouncedSearch ? { search: debouncedSearch } : undefined,
  );

  const conversations: Conversation[] = data?.data ?? [];

  useEffect(() => {
    useConversationStore.getState().setSearchResults(data?.data ?? []);
  }, [data?.data]);

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-grey-400">
            <Loader2 size={20} className="animate-spin" />
          </div>
        )}
        {error && (
          <p className="text-sm text-red-500 text-center py-4">
            Failed to load conversations
          </p>
        )}
        {conversations.map((conv) => (
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
                {getInitials(conv.name)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className={`text-sm font-semibold truncate ${selectedId === conv.id ? 'text-primary-900' : 'text-text'}`}
                >
                  {conv.name ?? 'Direct message'}
                </span>
                <span className="text-[11px] text-grey-400 shrink-0 ml-2">
                  {formatTime(conv.last_message_at ?? conv.created_at)}
                </span>
              </div>
              <p className="text-xs text-text-muted truncate">
                {conv.description ?? conv.type}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
