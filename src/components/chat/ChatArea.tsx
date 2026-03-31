import {
  Check,
  ChevronLeft,
  ChevronRight,
  CornerUpLeft,
  Edit3,
  FileIcon,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
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
  useSearchMessages,
  useSendMessage,
  useUpdateMessage,
} from '../../hooks/useMessages';
import { useAddReaction, useRemoveReaction, useUpdateReadReceipt } from '../../hooks/useSocial';
import { useUploadFile } from '../../hooks/useUploads';
import type { WSStatus } from '../../hooks/useWebSocket';
import { useAuthStore } from '../../stores/useAuthStore';
import { useMessageStore } from '../../stores/useMessageStore';

interface ChatAreaProps {
  conversationId: string | null;
  conversationName: string | null;
  wsStatus?: WSStatus;
  sendWsEvent?: (type: string, conversationId: string, payload?: unknown) => void;
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

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

function MessageBubble({
  msg,
  isMe,
  conversationName,
  conversationId,
  replyToMessage,
}: {
  msg: Message;
  isMe: boolean;
  conversationName: string;
  conversationId: string;
  replyToMessage?: Message;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setEditingMessage, setReplyingTo } = useMessageStore();
  const deleteMutation = useDeleteMessage();
  const addReactionMutation = useAddReaction();
  const removeReactionMutation = useRemoveReaction();
  const currentUserId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setShowEmojiPicker(false);
      }
    }
    if (showMenu || showEmojiPicker)
      document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, showEmojiPicker]);

  const handleEdit = () => {
    setShowMenu(false);
    setEditingMessage({ id: msg.id, content: msg.content ?? '' });
  };

  const handleDelete = () => {
    setShowMenu(false);
    deleteMutation.mutate({ messageId: msg.id, conversationId });
  };

  const handleReply = () => {
    setShowMenu(false);
    setReplyingTo({
      id: msg.id,
      content: msg.content ?? '',
      senderName: isMe ? 'You' : conversationName,
    });
  };

  const handleReaction = (emoji: string) => {
    setShowEmojiPicker(false);
    setShowMenu(false);
    // Toggle: if user already reacted with this emoji, remove it
    const alreadyReacted = msg.reactions?.some(
      (r) => r.emoji === emoji && r.user_id === currentUserId,
    );
    if (alreadyReacted) {
      removeReactionMutation.mutate({ messageId: msg.id, emoji });
    } else {
      addReactionMutation.mutate({ messageId: msg.id, emoji });
    }
  };

  // Group reactions by emoji
  const groupedReactions = (msg.reactions ?? []).reduce(
    (acc, r) => {
      if (!acc[r.emoji]) acc[r.emoji] = [];
      acc[r.emoji].push(r.user_id);
      return acc;
    },
    {} as Record<string, string[]>,
  );

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
          {/* Reply preview */}
          {replyToMessage && (
            <div
              className={`text-xs px-3 py-1.5 mb-0.5 rounded-t-xl border-l-2 ${
                isMe
                  ? 'bg-primary-700/30 border-primary-300 text-primary-100'
                  : 'bg-grey-50 border-grey-300 text-grey-500'
              }`}
            >
              <span className="font-medium">
                {replyToMessage.sender_id === currentUserId
                  ? 'You'
                  : conversationName}
              </span>
              <p className="truncate opacity-80">
                {replyToMessage.content}
              </p>
            </div>
          )}

          <div
            className={`
              px-4 py-2.5 text-sm leading-relaxed
              ${
                isMe
                  ? 'bg-primary-600 text-white rounded-2xl rounded-br-md'
                  : 'bg-surface text-text rounded-2xl rounded-bl-md shadow-sm border border-border-light'
              }
              ${replyToMessage ? 'rounded-t-lg' : ''}
            `}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowMenu(true);
            }}
          >
            {msg.content}
          </div>

          {/* Reactions display */}
          {Object.keys(groupedReactions).length > 0 && (
            <div
              className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}
            >
              {Object.entries(groupedReactions).map(([emoji, userIds]) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleReaction(emoji)}
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs border cursor-pointer transition-colors ${
                    userIds.includes(currentUserId ?? '')
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'bg-grey-50 border-grey-200 text-grey-600 hover:bg-grey-100'
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{userIds.length}</span>
                </button>
              ))}
            </div>
          )}

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
          {showMenu && (
            <div
              ref={menuRef}
              className={`absolute ${isMe ? 'right-0' : 'left-0'} bottom-full mb-1 bg-surface border border-border rounded-lg shadow-lg z-10 overflow-hidden min-w-[140px]`}
            >
              {/* Quick emoji row */}
              <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border-light">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleReaction(emoji)}
                    className="w-7 h-7 rounded-full hover:bg-grey-100 flex items-center justify-center text-sm cursor-pointer transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleReply}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-grey-50 w-full cursor-pointer"
              >
                <CornerUpLeft size={14} />
                Reply
              </button>
              {isMe && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-grey-50 w-full cursor-pointer"
                >
                  <Edit3 size={14} />
                  Edit
                </button>
              )}
              {isMe && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full cursor-pointer"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
            </div>
          )}

          {/* Hover action */}
          {!showMenu && (
            <button
              type="button"
              onClick={() => setShowMenu(true)}
              className={`absolute ${isMe ? '-left-8' : '-right-8'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full hover:bg-grey-100 flex items-center justify-center text-grey-400 transition-opacity cursor-pointer`}
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

const TYPING_DEBOUNCE_MS = 2000;
const TYPING_TIMEOUT_MS = 5000;

export default function ChatArea({
  conversationId,
  conversationName,
  wsStatus,
  sendWsEvent,
  onBack,
}: ChatAreaProps) {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const editingMessage = useMessageStore((s) => s.editingMessage);
  const replyingTo = useMessageStore((s) => s.replyingTo);
  const setEditingMessage = useMessageStore((s) => s.setEditingMessage);
  const setReplyingTo = useMessageStore((s) => s.setReplyingTo);
  const draft = useMessageStore((s) => s.drafts[conversationId ?? ''] ?? '');
  const setDraft = useMessageStore((s) => s.setDraft);
  const clearDraft = useMessageStore((s) => s.clearDraft);

  const [inputValue, setInputValue] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useMessages(conversationId ?? '', {
    limit: 50,
  });
  const sendMutation = useSendMessage();
  const updateMutation = useUpdateMessage();
  const uploadMutation = useUploadFile();
  const readReceiptMutation = useUpdateReadReceipt();
  const { data: searchData, isLoading: isSearching } = useSearchMessages(
    conversationId ?? '',
    searchQuery,
  );
  const lastReadIdRef = useRef<string | null>(null);

  // Typing indicator logic
  const typingUsers = useMessageStore(
    (s) => s.typingUsers[conversationId ?? ''] ?? [],
  );
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const sendTypingStart = useCallback(() => {
    if (!conversationId || !sendWsEvent || isTypingRef.current) return;
    isTypingRef.current = true;
    const userId = useAuthStore.getState().user?.id;
    sendWsEvent('typing.start', conversationId, { user_id: userId });
  }, [conversationId, sendWsEvent]);

  const sendTypingStop = useCallback(() => {
    if (!conversationId || !sendWsEvent || !isTypingRef.current) return;
    isTypingRef.current = false;
    const userId = useAuthStore.getState().user?.id;
    sendWsEvent('typing.stop', conversationId, { user_id: userId });
  }, [conversationId, sendWsEvent]);

  // Auto-cleanup typing timeouts for remote users
  useEffect(() => {
    if (typingUsers.length === 0) return;
    const timeout = setTimeout(() => {
      // Force remove all typing users after TYPING_TIMEOUT_MS
      const store = useMessageStore.getState();
      for (const userId of typingUsers) {
        store.removeTypingUser(conversationId ?? '', userId);
      }
    }, TYPING_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [typingUsers, conversationId]);

  // Reset typing state when switching conversations
  useEffect(() => {
    isTypingRef.current = false;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  }, [conversationId]);

  const messages = data?.data ?? [];
  // API returns DESC order, reverse for display (oldest first)
  const displayMessages = [...messages].reverse();

  // Auto mark conversation as read when messages load
  // Use messages[0] (most recent, API returns DESC) to avoid depending on reversed array
  const latestMessageId = messages[0]?.id;
  useEffect(() => {
    if (conversationId && latestMessageId && latestMessageId !== lastReadIdRef.current) {
      lastReadIdRef.current = latestMessageId;
      readReceiptMutation.mutate({
        conversationId,
        lastReadMessageId: latestMessageId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, latestMessageId]);

  // Restore draft when switching conversations
  useEffect(() => {
    if (conversationId && !editingMessage) {
      setInputValue(draft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Save draft on input change
  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (conversationId && !editingMessage) {
      setDraft(conversationId, value);
    }

    // Typing indicator: send start, debounce stop
    if (value.trim()) {
      sendTypingStart();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(sendTypingStop, TYPING_DEBOUNCE_MS);
    } else {
      sendTypingStop();
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleSend = useCallback(() => {
    if ((!inputValue.trim() && !pendingFile) || !conversationId) return;

    // Stop typing indicator on send
    sendTypingStop();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

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
            setInputValue(draft);
          },
        },
      );
    } else {
      const fileToUpload = pendingFile;
      const messageContent = inputValue.trim() || (fileToUpload ? `📎 ${fileToUpload.name}` : '');
      if (!messageContent) return;

      sendMutation.mutate(
        {
          conversationId,
          input: {
            content: messageContent,
            reply_to_id: replyingTo?.id,
          },
        },
        {
          onSuccess: (data) => {
            setInputValue('');
            clearDraft(conversationId);
            setReplyingTo(null);
            setPendingFile(null);
            // Upload file if pending
            if (fileToUpload && data?.data?.id) {
              uploadMutation.mutate({
                messageId: data.data.id,
                conversationId,
                file: fileToUpload,
              });
            }
          },
        },
      );
    }
  }, [
    inputValue,
    pendingFile,
    conversationId,
    editingMessage,
    replyingTo,
    sendMutation,
    updateMutation,
    uploadMutation,
    sendTypingStop,
    setEditingMessage,
    setReplyingTo,
    draft,
    clearDraft,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      if (editingMessage) {
        setEditingMessage(null);
        setInputValue(conversationId ? draft : '');
      } else if (replyingTo) {
        setReplyingTo(null);
      }
    }
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setInputValue(conversationId ? draft : '');
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
            onClick={() => {
              setShowSearch(!showSearch);
              if (showSearch) setSearchQuery('');
            }}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              showSearch
                ? 'bg-primary-100 text-primary-600'
                : 'hover:bg-grey-100 text-grey-400 hover:text-grey-600'
            }`}
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

      {/* Search bar */}
      {showSearch && (
        <div className="px-6 py-2 bg-surface border-b border-border">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400"
            />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-8 pr-8 py-2 rounded-lg bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full hover:bg-grey-200 flex items-center justify-center text-grey-400 cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>
          {searchQuery.length >= 2 && (
            <p className="text-[11px] text-grey-400 mt-1">
              {isSearching
                ? 'Searching...'
                : `${searchData?.data?.length ?? 0} result${(searchData?.data?.length ?? 0) !== 1 ? 's' : ''}`}
            </p>
          )}
        </div>
      )}

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
      >
        {(() => {
          // Show search results when searching
          if (showSearch && searchQuery.length >= 2) {
            const searchResults = [...(searchData?.data ?? [])].reverse();
            if (isSearching) return <MessageSkeleton />;
            if (searchResults.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Search size={20} className="text-grey-300 mb-2" />
                  <p className="text-sm text-grey-500">No results found</p>
                </div>
              );
            }
            return searchResults.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isMe={msg.sender_id === currentUserId}
                conversationName={conversationName}
                conversationId={conversationId}
              />
            ));
          }

          // Normal message display
          if (isLoading) return <MessageSkeleton />;
          if (displayMessages.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 rounded-xl bg-grey-100 flex items-center justify-center mb-3">
                  <MessageSquare size={20} className="text-grey-400" />
                </div>
                <p className="text-sm text-grey-500">No messages yet</p>
                <p className="text-xs text-grey-400 mt-1">
                  Send the first message!
                </p>
              </div>
            );
          }
          return displayMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isMe={msg.sender_id === currentUserId}
              conversationName={conversationName}
              conversationId={conversationId}
              replyToMessage={
                msg.reply_to_id
                  ? displayMessages.find((m) => m.id === msg.reply_to_id)
                  : undefined
              }
            />
          ));
        })()}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="px-6 py-1.5 text-xs text-grey-500 flex items-center gap-1.5">
          <span className="flex gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-grey-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-grey-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-grey-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          <span>
            {typingUsers.length === 1
              ? `Someone is typing...`
              : `${typingUsers.length} people are typing...`}
          </span>
        </div>
      )}

      {/* Reply banner */}
      {replyingTo && !editingMessage && (
        <div className="px-6 py-2 bg-grey-50 border-t border-grey-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-grey-600 min-w-0">
            <CornerUpLeft size={14} className="shrink-0" />
            <span className="truncate">
              Replying to <strong>{replyingTo.senderName}</strong>:{' '}
              {replyingTo.content}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setReplyingTo(null)}
            className="w-6 h-6 rounded-full hover:bg-grey-200 flex items-center justify-center text-grey-400 cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

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

      {/* Pending file preview */}
      {pendingFile && (
        <div className="px-6 py-2 bg-grey-50 border-t border-grey-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-grey-600 min-w-0">
            {pendingFile.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(pendingFile)}
                alt={pendingFile.name}
                className="w-10 h-10 rounded object-cover"
              />
            ) : (
              <FileIcon size={16} className="shrink-0" />
            )}
            <span className="truncate">{pendingFile.name}</span>
            <span className="text-grey-400 shrink-0">
              ({(pendingFile.size / 1024).toFixed(0)} KB)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPendingFile(null)}
            className="w-6 h-6 rounded-full hover:bg-grey-200 flex items-center justify-center text-grey-400 cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 bg-surface border-t border-border">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 rounded-full hover:bg-grey-100 flex items-center justify-center text-grey-400 hover:text-grey-600 transition-colors shrink-0 cursor-pointer"
          >
            <Paperclip size={20} />
          </button>
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
              disabled={(!inputValue.trim() && !pendingFile) || sendMutation.isPending}
              className={`
                w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer
                ${
                  inputValue.trim() || pendingFile
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
