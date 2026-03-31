import {
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Search,
  Smile,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Message } from '../../api/messages';
import {
  useDeleteMessage,
  useMessages,
  useSendMessage,
  useUpdateMessage,
} from '../../hooks/useMessages';
import type { WSStatus } from '../../hooks/useWebSocket';
import { useAuthStore } from '../../stores/useAuthStore';
import { useMessageStore } from '../../stores/useMessageStore';

interface ChatAreaProps {
  conversationId: string | null;
  conversationName: string | null;
  wsStatus?: WSStatus;
  onBack?: () => void;
}

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) {
    return `yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function MessageBubble({
  msg,
  isMe,
  conversationName,
  conversationId,
}: {
  msg: Message;
  isMe: boolean;
  conversationName: string;
  conversationId: string;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setEditingMessage } = useMessageStore();
  const deleteMutation = useDeleteMessage();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleEdit = () => {
    setShowMenu(false);
    setEditingMessage({ id: msg.id, content: msg.content ?? '' });
  };

  const handleDelete = () => {
    setShowMenu(false);
    deleteMutation.mutate({ messageId: msg.id, conversationId });
  };

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={`flex items-end gap-2 max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}
      >
        {!isMe && (
          <div className="w-8 h-8 rounded-full bg-grey-200 flex items-center justify-center shrink-0 mb-5">
            <span className="text-xs font-display font-semibold text-grey-600">
              {conversationName
                .split(' ')
                .map((w) => w[0])
                .join('')}
            </span>
          </div>
        )}
        <div className="relative">
          <div
            className={`
              px-4 py-2.5 text-sm leading-relaxed
              ${
                isMe
                  ? 'bg-primary-600 text-white rounded-2xl rounded-br-md'
                  : 'bg-surface text-text rounded-2xl rounded-bl-md shadow-sm border border-border-light'
              }
            `}
            onContextMenu={(e) => {
              if (isMe) {
                e.preventDefault();
                setShowMenu(true);
              }
            }}
          >
            {msg.content}
          </div>
          <div
            className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}
          >
            <span className="text-[11px] text-grey-400">
              {formatMessageTime(msg.created_at)}
            </span>
            {msg.is_edited && (
              <span className="text-[10px] text-grey-400 flex items-center gap-0.5">
                <Pencil size={9} />
                edited
              </span>
            )}
          </div>

          {/* Context menu */}
          {showMenu && isMe && (
            <div
              ref={menuRef}
              className="absolute right-0 bottom-full mb-1 bg-surface border border-border rounded-lg shadow-lg z-10 overflow-hidden"
            >
              <button
                type="button"
                onClick={handleEdit}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-grey-50 w-full cursor-pointer"
              >
                <Edit3 size={14} />
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full cursor-pointer"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}

          {/* Hover action (for non-context-menu) */}
          {isMe && !showMenu && (
            <button
              type="button"
              onClick={() => setShowMenu(true)}
              className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full hover:bg-grey-100 flex items-center justify-center text-grey-400 transition-opacity cursor-pointer"
            >
              <MoreHorizontal size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className="space-y-4 px-6 py-4">
      {[false, true, false, true, false].map((isMe, i) => (
        <div
          key={i}
          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`flex items-end gap-2 max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}
          >
            {!isMe && (
              <div className="w-8 h-8 rounded-full bg-grey-100 animate-pulse shrink-0" />
            )}
            <div>
              <div
                className={`h-10 rounded-2xl animate-pulse ${isMe ? 'bg-primary-100 rounded-br-md' : 'bg-grey-100 rounded-bl-md'}`}
                style={{ width: `${120 + Math.random() * 160}px` }}
              />
              <div className="h-3 w-10 bg-grey-100 animate-pulse rounded mt-1 ml-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChatArea({
  conversationId,
  conversationName,
  wsStatus,
  onBack,
}: ChatAreaProps) {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { editingMessage, setEditingMessage, getDraft, setDraft, clearDraft } =
    useMessageStore();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useMessages(conversationId ?? '', {
    limit: 50,
  });
  const sendMutation = useSendMessage();
  const updateMutation = useUpdateMessage();

  const messages = data?.data ?? [];
  // API returns DESC order, reverse for display (oldest first)
  const displayMessages = [...messages].reverse();

  // Restore draft when switching conversations
  useEffect(() => {
    if (conversationId && !editingMessage) {
      setInputValue(getDraft(conversationId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Save draft on input change
  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (conversationId && !editingMessage) {
      setDraft(conversationId, value);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [displayMessages.length]);

  // Set input to editing content
  useEffect(() => {
    if (editingMessage) {
      setInputValue(editingMessage.content);
    }
  }, [editingMessage]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || !conversationId) return;

    if (editingMessage) {
      updateMutation.mutate(
        {
          messageId: editingMessage.id,
          conversationId,
          input: { content: inputValue.trim() },
        },
        {
          onSuccess: () => {
            setEditingMessage(null);
            setInputValue(getDraft(conversationId));
          },
        },
      );
    } else {
      sendMutation.mutate(
        {
          conversationId,
          input: { content: inputValue.trim() },
        },
        {
          onSuccess: () => {
            setInputValue('');
            clearDraft(conversationId);
          },
        },
      );
    }
  }, [
    inputValue,
    conversationId,
    editingMessage,
    sendMutation,
    updateMutation,
    setEditingMessage,
    getDraft,
    clearDraft,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape' && editingMessage) {
      setEditingMessage(null);
      setInputValue(conversationId ? getDraft(conversationId) : '');
    }
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setInputValue(conversationId ? getDraft(conversationId) : '');
  };

  if (!conversationId || !conversationName) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-alt">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <MessageSquare
              size={28}
              strokeWidth={1.5}
              className="text-primary-500"
            />
          </div>
          <h3 className="font-display font-bold text-lg text-text mb-1">
            {t('chat.selectConversation')}
          </h3>
          <p className="text-sm text-text-muted">
            {t('chat.startMessaging')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface-alt">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-surface border-b border-border">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              aria-label={t('chat.back')}
              onClick={onBack}
              className="md:hidden w-9 h-9 rounded-lg hover:bg-grey-100 flex items-center justify-center text-grey-500 hover:text-grey-700 transition-colors cursor-pointer -ml-1"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center font-display font-semibold text-sm text-primary-700">
            {conversationName
              .split(' ')
              .map((w) => w[0])
              .join('')}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">
              {conversationName}
            </h3>
            <span
              className={`text-xs flex items-center gap-1 ${
                wsStatus === 'connected'
                  ? 'text-leaf-600'
                  : wsStatus === 'reconnecting' || wsStatus === 'connecting'
                    ? 'text-amber-500'
                    : 'text-grey-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block ${
                  wsStatus === 'connected'
                    ? 'bg-leaf-500'
                    : wsStatus === 'reconnecting' || wsStatus === 'connecting'
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-grey-300'
                }`}
              />
              {wsStatus === 'connected'
                ? t('chat.online')
                : wsStatus === 'reconnecting'
                  ? 'Reconnecting...'
                  : wsStatus === 'connecting'
                    ? 'Connecting...'
                    : 'Offline'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="w-9 h-9 rounded-lg hover:bg-grey-100 flex items-center justify-center text-grey-400 hover:text-grey-600 transition-colors cursor-pointer"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-lg hover:bg-grey-100 flex items-center justify-center text-grey-400 hover:text-grey-600 transition-colors cursor-pointer"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
      >
        {isLoading ? (
          <MessageSkeleton />
        ) : displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-xl bg-grey-100 flex items-center justify-center mb-3">
              <MessageSquare size={20} className="text-grey-400" />
            </div>
            <p className="text-sm text-grey-500">No messages yet</p>
            <p className="text-xs text-grey-400 mt-1">
              Send the first message!
            </p>
          </div>
        ) : (
          displayMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isMe={msg.sender_id === currentUserId}
              conversationName={conversationName}
              conversationId={conversationId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Editing banner */}
      {editingMessage && (
        <div className="px-6 py-2 bg-primary-50 border-t border-primary-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-primary-700">
            <Edit3 size={14} />
            <span>Editing message</span>
          </div>
          <button
            type="button"
            onClick={cancelEdit}
            className="w-6 h-6 rounded-full hover:bg-primary-100 flex items-center justify-center text-primary-500 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 bg-surface border-t border-border">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="w-9 h-9 rounded-full hover:bg-grey-100 flex items-center justify-center text-grey-400 hover:text-grey-600 transition-colors shrink-0 cursor-pointer"
          >
            <Smile size={20} />
          </button>
          <input
            type="text"
            placeholder={
              editingMessage
                ? 'Edit your message...'
                : t('chat.whisper', {
                    name: conversationName.split(' ')[0],
                  })
            }
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 py-2.5 px-4 rounded-xl border text-sm text-text placeholder:text-grey-400 outline-none transition-all ${
              editingMessage
                ? 'bg-primary-50 border-primary-300 focus:ring-2 focus:ring-primary-100'
                : 'bg-grey-50 border-border-light focus:border-primary-300 focus:ring-2 focus:ring-primary-100'
            }`}
          />
          {editingMessage ? (
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputValue.trim() || updateMutation.isPending}
              className={`
                w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer
                ${inputValue.trim() ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm' : 'bg-grey-100 text-grey-400'}
              `}
            >
              <Check size={16} strokeWidth={2.5} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputValue.trim() || sendMutation.isPending}
              className={`
                w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer
                ${
                  inputValue.trim()
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                    : 'bg-grey-100 text-grey-400'
                }
              `}
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
