import { Check, Loader2, Search, UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ApiError } from '../../api/client';
import type { User } from '../../api/users';
import { useAddParticipants } from '../../hooks/useConversations';
import { useDebounce } from '../../hooks/useDebounce';
import { useUsers } from '../../hooks/useUsers';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface AddParticipantModalProps {
  conversationId: string;
  existingParticipantIds: string[];
  onClose: () => void;
  isClosing: boolean;
}

export default function AddParticipantModal({
  conversationId,
  existingParticipantIds,
  onClose,
  isClosing,
}: AddParticipantModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const addMutation = useAddParticipants();

  const { data: usersResponse, isLoading } = useUsers({
    search: debouncedSearch || undefined,
    sort: 'new',
  });

  const availableUsers = (usersResponse?.data ?? []).filter(
    (u) => !existingParticipantIds.includes(u.id),
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleUser = (user: User) => {
    setErrorMessage(null);
    const isSelected = selectedUsers.some((u) => u.id === user.id);
    if (isSelected) {
      setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const removeUser = (id: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleAdd = async () => {
    if (selectedUsers.length === 0) return;

    try {
      await addMutation.mutateAsync({
        conversationId,
        participantIds: selectedUsers.map((u) => u.id),
      });

      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setErrorMessage("You don't have permission to add members");
      } else {
        setErrorMessage(
          err instanceof Error ? err.message : 'An error occurred',
        );
      }
    }
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
          aria-label="Add participants"
          className={`pointer-events-auto max-w-md w-full rounded-2xl bg-white shadow-xl max-h-[85vh] flex flex-col overflow-hidden ${
            isClosing ? 'animate-modal-out' : 'animate-modal-in'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border-light">
            <div className="flex items-center gap-2.5">
              <UserPlus size={20} className="text-primary-600" />
              <h3 className="text-lg font-display font-bold text-text">
                Add members
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-grey-100 flex items-center justify-center text-grey-400 hover:text-grey-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
            {/* Search */}
            <div className="relative mb-3">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400"
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>

            {/* Selected Users Pills */}
            {selectedUsers.length > 0 && (
              <div className="flex gap-2 pb-3 overflow-x-auto">
                {selectedUsers.map((user) => (
                  <span
                    key={user.id}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-sm text-primary-700 shrink-0"
                  >
                    {user.username}
                    <button
                      type="button"
                      onClick={() => removeUser(user.id)}
                      className="hover:text-primary-900 transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* User List */}
            <div className="space-y-1 max-h-[280px] overflow-y-auto">
              {availableUsers.map((user) => {
                const isSelected = selectedUsers.some((u) => u.id === user.id);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleUser(user)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 text-left ${
                      isSelected ? 'bg-primary-50' : 'hover:bg-grey-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-grey-200 flex items-center justify-center font-display font-semibold text-xs text-grey-600 shrink-0">
                      {getInitials(user.username)}
                    </div>
                    <span className="text-sm text-text flex-1">
                      {user.username}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
              {isLoading && availableUsers.length === 0 && (
                <div className="flex items-center justify-center py-4 text-grey-400">
                  <Loader2 size={18} className="animate-spin" />
                </div>
              )}
              {!isLoading && availableUsers.length === 0 && (
                <p className="text-sm text-grey-400 text-center py-4">
                  No users found
                </p>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="px-6 pb-4">
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                {errorMessage}
              </p>
            </div>
          )}

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
              disabled={selectedUsers.length === 0 || addMutation.isPending}
              onClick={handleAdd}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm ${
                selectedUsers.length > 0 && !addMutation.isPending
                  ? 'bg-primary-600 text-white hover:bg-primary-700 cursor-pointer'
                  : 'bg-primary-300 text-white cursor-not-allowed'
              }`}
            >
              {addMutation.isPending
                ? 'Adding...'
                : `Add ${selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
