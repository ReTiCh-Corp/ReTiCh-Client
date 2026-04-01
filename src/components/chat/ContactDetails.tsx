import { Image, Loader2, LogOut, UserPlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../api/client';
import {
  useConversation,
  useLeaveConversation,
  useRemoveParticipant,
} from '../../hooks/useConversations';
import { useAuthStore } from '../../stores/useAuthStore';
import AddParticipantModal from './AddParticipantModal';
import ParticipantList from './ParticipantList';

interface ContactDetailsProps {
  conversationId: string | null;
  onClose: () => void;
  isOtherUserOnline?: boolean;
}

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ContactDetails({
  conversationId,
  onClose,
  isOtherUserOnline,
}: ContactDetailsProps) {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const { data: conversationData, isLoading } = useConversation(
    conversationId ?? '',
  );
  const conversation = conversationData?.data;
  const currentUser = useAuthStore((s) => s.user);

  const removeParticipantMutation = useRemoveParticipant();
  const leaveConversationMutation = useLeaveConversation();

  if (!conversationId) return null;

  if (isLoading) {
    return (
      <div className="w-[280px] min-w-[280px] h-full border-l border-border bg-surface flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-grey-400" />
      </div>
    );
  }

  if (!conversation) return null;

  const name = conversation.name;
  const initials = getInitials(name);
  const isGroupOrChannel =
    conversation.type === 'group' || conversation.type === 'channel';
  const participants = conversation.participants ?? [];

  const currentParticipant = participants.find(
    (p) => p.user_id === currentUser?.id,
  );
  const currentUserRole = currentParticipant?.role ?? 'member';
  const canManageMembers =
    currentUserRole === 'owner' || currentUserRole === 'admin';

  const handleCloseAddModal = () => {
    setModalClosing(true);
    modalTimeout.current = setTimeout(() => {
      setShowAddModal(false);
      setModalClosing(false);
    }, 200);
  };

  const handleRemoveParticipant = async (userId: string) => {
    if (!conversationId) return;
    setRemovingUserId(userId);
    try {
      await removeParticipantMutation.mutateAsync({
        conversationId,
        userId,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setErrorMessage(t('chat.permissionRemove'));
      } else {
        setErrorMessage(t('chat.errorRemove'));
      }
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleLeave = async () => {
    if (!conversationId) return;
    try {
      await leaveConversationMutation.mutateAsync(conversationId);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setErrorMessage(t('chat.permissionLeave'));
      } else {
        setErrorMessage(t('chat.errorLeave'));
      }
    }
  };

  return (
    <div className="w-[280px] min-w-[280px] h-full border-l border-border bg-surface flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-xs font-semibold text-grey-500 uppercase tracking-wider">
          {t('chat.details')}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-grey-100 flex items-center justify-center text-grey-400 hover:text-grey-600 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Avatar & Name */}
      <div className="flex flex-col items-center px-5 pb-6">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-3 relative">
          <span className="font-display font-bold text-2xl text-primary-700">
            {initials}
          </span>
          {!isGroupOrChannel && (
            <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
              isOtherUserOnline ? 'bg-leaf-500' : 'bg-grey-300'
            }`} />
          )}
        </div>
        <h3 className="font-display font-bold text-lg text-text">
          {name ?? t('chat.directMessage')}
        </h3>
        {conversation.description && (
          <span className="text-sm text-text-muted text-center mt-1">
            {conversation.description}
          </span>
        )}
        {isGroupOrChannel && (
          <span className="text-xs text-grey-400 mt-1">
            {t('chat.memberCount', { count: participants.length })}
          </span>
        )}
      </div>

      {/* Participants Section (group/channel only) */}
      {isGroupOrChannel && participants.length > 0 && (
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider">
              {t('chat.members')}
            </h4>
            {canManageMembers && (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1 text-[11px] text-primary-600 font-medium hover:text-primary-700 cursor-pointer transition-colors"
              >
                <UserPlus size={12} />
                {t('chat.addMember')}
              </button>
            )}
          </div>
          <ParticipantList
            participants={participants}
            currentUserId={currentUser?.id ?? ''}
            currentUserRole={currentUserRole}
            onRemove={handleRemoveParticipant}
            removingUserId={removingUserId}
          />
        </div>
      )}

      {/* Contact Info (direct only) */}
      {!isGroupOrChannel && (
        <div className="px-5 pb-5">
          <h4 className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider mb-3">
            {t('chat.contactInfo')}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">{t('chat.members')}</span>
              <span className="text-xs text-grey-600">
                {participants.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">{t('chat.created')}</span>
              <span className="text-xs text-grey-600">
                {new Date(conversation.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Shared Media */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider">
            {t('chat.sharedMedia')}
          </h4>
          <button
            type="button"
            className="text-[11px] text-primary-600 font-medium hover:text-primary-700 cursor-pointer"
          >
            {t('chat.viewAll')}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-grey-100 flex items-center justify-center"
            >
              <Image size={16} strokeWidth={1.5} className="text-grey-300" />
            </div>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="px-5 pb-3">
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Leave button (group/channel only) */}
      {isGroupOrChannel && (
        <div className="px-5 pb-5 mt-auto">
          <button
            type="button"
            onClick={handleLeave}
            disabled={leaveConversationMutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {leaveConversationMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogOut size={16} />
            )}
            {leaveConversationMutation.isPending
              ? t('chat.leaving')
              : t('chat.leaveConversation')}
          </button>
        </div>
      )}

      {/* Add Participant Modal */}
      {showAddModal && conversationId && (
        <AddParticipantModal
          conversationId={conversationId}
          existingParticipantIds={participants.map((p) => p.user_id)}
          onClose={handleCloseAddModal}
          isClosing={modalClosing}
        />
      )}
    </div>
  );
}
