import { Pencil, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import type { ConversationDetail } from '../../api/conversations';
import { useUpdateConversation } from '../../hooks/useConversations';

interface ConversationEditModalProps {
  conversation: ConversationDetail;
  onClose: () => void;
  isClosing: boolean;
}

export default function ConversationEditModal({
  conversation,
  onClose,
  isClosing,
}: ConversationEditModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(conversation.name ?? '');
  const [description, setDescription] = useState(
    conversation.description ?? '',
  );
  const [avatarUrl, setAvatarUrl] = useState(conversation.avatar_url ?? '');
  const updateMutation = useUpdateConversation();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isFormValid = name.trim().length > 0;

  const handleSave = async () => {
    if (!isFormValid) return;

    await updateMutation.mutateAsync({
      id: conversation.id,
      input: {
        name: name.trim(),
        description: description.trim() || undefined,
        avatar_url: avatarUrl.trim() || undefined,
      },
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
          aria-label="Edit conversation"
          className={`pointer-events-auto max-w-md w-full rounded-2xl bg-surface shadow-xl max-h-[85vh] flex flex-col overflow-hidden ${
            isClosing ? 'animate-modal-out' : 'animate-modal-in'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border-light">
            <div className="flex items-center gap-2">
              <Pencil size={18} className="text-grey-500" />
              <h3 className="text-lg font-display font-bold text-text">
                {t('chat.editConversation')}
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
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Name */}
            <div className="px-6 pt-5 pb-4">
              <span className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider mb-3 block">
                {t('chat.name')}
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('chat.namePlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>

            {/* Description */}
            <div className="px-6 pb-4">
              <span className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider mb-3 block">
                {t('chat.description')}
              </span>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('chat.descriptionPlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>

            {/* Avatar URL */}
            <div className="px-6 pb-4">
              <span className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider mb-3 block">
                {t('chat.avatarUrl')}
              </span>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.png"
                className="w-full px-4 py-2.5 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-grey-600 hover:bg-grey-100 transition-colors cursor-pointer"
            >
              {t('chat.cancel')}
            </button>
            <button
              type="button"
              disabled={!isFormValid || updateMutation.isPending}
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm ${
                isFormValid && !updateMutation.isPending
                  ? 'bg-primary-600 text-white hover:bg-primary-700 cursor-pointer'
                  : 'bg-primary-300 text-white cursor-not-allowed'
              }`}
            >
              {updateMutation.isPending ? t('chat.saving') : t('chat.save')}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
