import {
  Check,
  Hash,
  Loader2,
  MessageSquare,
  Search,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { User } from '../../api/users';
import { useCreateConversation } from '../../hooks/useConversations';
import { useDebounce } from '../../hooks/useDebounce';
import { useUsers } from '../../hooks/useUsers';

type ConversationType = 'direct' | 'group' | 'channel';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const TYPE_OPTIONS: {
  type: ConversationType;
  icon: typeof MessageSquare;
  label: string;
}[] = [
  { type: 'direct', icon: MessageSquare, label: 'Direct' },
  { type: 'group', icon: Users, label: 'Group' },
  { type: 'channel', icon: Hash, label: 'Channel' },
];

interface ConversationModalCreationProps {
  onClose: () => void;
  isClosing: boolean;
}

export default function ConversationModalCreation({
  onClose,
  isClosing,
}: ConversationModalCreationProps) {
  const [selectedType, setSelectedType] = useState<ConversationType | null>(
    null,
  );
  const [conversationName, setConversationName] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const createMutation = useCreateConversation();
  const debouncedSearch = useDebounce(memberSearch, 300);

  const { data: usersResponse, isLoading } = useUsers({
    search: debouncedSearch || undefined,
    sort: 'new',
  });

  const filteredMembers = usersResponse?.data ?? [];

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleMember = (member: User) => {
    const isSelected = selectedMembers.some((m) => m.id === member.id);
    if (isSelected) {
      setSelectedMembers((prev) => prev.filter((m) => m.id !== member.id));
    } else {
      // Direct type: max 1 member
      if (selectedType === 'direct') {
        setSelectedMembers([member]);
      } else {
        setSelectedMembers((prev) => [...prev, member]);
      }
    }
  };

  const removeMember = (id: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const needsName = selectedType === 'group' || selectedType === 'channel';
  const isFormValid =
    selectedType !== null &&
    selectedMembers.length > 0 &&
    (!needsName || conversationName.trim().length > 0);

  const handleCreate = async () => {
    if (!isFormValid || !selectedType) return;

    await createMutation.mutateAsync({
      type: selectedType,
      ...(needsName && { name: conversationName.trim() }),
      member_ids: selectedMembers.map((m) => m.id),
    });

    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${
          isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'
        } cursor-default`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="New conversation"
          className={`pointer-events-auto max-w-md w-full rounded-2xl bg-white shadow-xl max-h-[85vh] flex flex-col overflow-hidden ${
            isClosing ? 'animate-modal-out' : 'animate-modal-in'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border-light">
            <h3 className="text-lg font-display font-bold text-text">
              New conversation
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-grey-100 flex items-center justify-center text-grey-400 hover:text-grey-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Type Selector */}
            <div className="px-6 pt-5 pb-4">
              <span className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider mb-3 block">
                Type
              </span>
              <div className="grid grid-cols-3 gap-3">
                {TYPE_OPTIONS.map(({ type, icon: Icon, label }) => {
                  const isActive = selectedType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setSelectedType(type);
                        // Reset members if switching to direct
                        if (type === 'direct' && selectedMembers.length > 1) {
                          setSelectedMembers([]);
                        }
                      }}
                      className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                        isActive
                          ? 'bg-primary-50 border-primary-200 text-primary-600'
                          : 'border-border-light hover:bg-grey-50 text-grey-500 hover:text-grey-700'
                      }`}
                    >
                      <Icon size={22} />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name Input (conditional) */}
            {needsName && (
              <div className="px-6 pb-4">
                <span className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider mb-3 block">
                  Name
                </span>
                <input
                  type="text"
                  value={conversationName}
                  onChange={(e) => setConversationName(e.target.value)}
                  placeholder={
                    selectedType === 'group'
                      ? 'Group name...'
                      : 'Channel name...'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
            )}

            {/* Member Selection */}
            <div className="px-6 pb-4">
              <span className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider mb-3 block">
                Members
              </span>

              {/* Search */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400"
                />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>

              {/* Selected Members Pills */}
              {selectedMembers.length > 0 && (
                <div className="flex gap-2 py-3 overflow-x-auto">
                  {selectedMembers.map((member) => (
                    <span
                      key={member.id}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-sm text-primary-700 shrink-0"
                    >
                      {member.username.split(' ')[0]}
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="hover:text-primary-900 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Member List */}
              <div className="mt-2 space-y-1 max-h-[200px] overflow-y-auto">
                {filteredMembers.map((member) => {
                  const isSelected = selectedMembers.some(
                    (m) => m.id === member.id,
                  );
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleMember(member)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 text-left ${
                        isSelected ? 'bg-primary-50' : 'hover:bg-grey-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-grey-200 flex items-center justify-center font-display font-semibold text-xs text-grey-600 shrink-0">
                        {getInitials(member.username)}
                      </div>
                      <span className="text-sm text-text flex-1">
                        {member.username}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
                {isLoading && filteredMembers.length === 0 && (
                  <div className="flex items-center justify-center py-4 text-grey-400">
                    <Loader2 size={18} className="animate-spin" />
                  </div>
                )}
                {!isLoading && filteredMembers.length === 0 && (
                  <p className="text-sm text-grey-400 text-center py-4">
                    No members found
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-grey-600 hover:bg-grey-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!isFormValid || createMutation.isPending}
              onClick={handleCreate}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm ${
                isFormValid && !createMutation.isPending
                  ? 'bg-primary-600 text-white hover:bg-primary-700 cursor-pointer'
                  : 'bg-primary-300 text-white cursor-not-allowed'
              }`}
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
