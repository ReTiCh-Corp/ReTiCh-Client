import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  MoreHorizontal,
  Search,
  Smile,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'me' | 'them';
}

const mockMessages: Message[] = [
  {
    id: '1',
    text: "Hi Matt, I'm curious, you have done your report about Design System. Where could I find it?",
    time: '12:47',
    sender: 'them',
  },
  {
    id: '2',
    text: 'Hi there :) Here is the link: http://bit.ly/2lx3uIr. The Design System is still a buzz word, IMHO.',
    time: '12:47',
    sender: 'me',
  },
  {
    id: '3',
    text: "Sure, frankly speaking, I thought that DS = Style Guide. But, (what I noticed after your article) it's not :).",
    time: '12:49',
    sender: 'them',
  },
  {
    id: '4',
    text: "The hell no! :) It's a connection between code, visual and UX – in a very very big shortcut. But don't be scared, it's still an element of our beloved design :) It can't be hard! ;)",
    time: '12:52',
    sender: 'me',
  },
  {
    id: '5',
    text: 'Hahahah, right. Just like my description under the avatar – Sky is the limit! :)',
    time: '12:53',
    sender: 'them',
  },
];

interface ChatAreaProps {
  conversationName: string | null;
  onBack?: () => void;
}

export default function ChatArea({ conversationName, onBack }: ChatAreaProps) {
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  if (!conversationName) {
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
          {/* Mobile back button */}
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
            <span className="text-xs text-leaf-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-leaf-500 inline-block" />
              {t('chat.online')}
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
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {mockMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-end gap-2 max-w-[70%] ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}
            >
              {msg.sender === 'them' && (
                <div className="w-8 h-8 rounded-full bg-grey-200 flex items-center justify-center shrink-0 mb-5">
                  <span className="text-xs font-display font-semibold text-grey-600">
                    {conversationName
                      .split(' ')
                      .map((w) => w[0])
                      .join('')}
                  </span>
                </div>
              )}
              <div>
                <div
                  className={`
                  px-4 py-2.5 text-sm leading-relaxed
                  ${
                    msg.sender === 'me'
                      ? 'bg-primary-600 text-white rounded-2xl rounded-br-md'
                      : 'bg-surface text-text rounded-2xl rounded-bl-md shadow-sm border border-border-light'
                  }
                `}
                >
                  {msg.text}
                </div>
                <span
                  className={`text-[11px] text-grey-400 mt-1 block ${msg.sender === 'me' ? 'text-right' : ''}`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

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
            placeholder={t('chat.whisper', { name: conversationName.split(' ')[0] })}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
          />
          <button
            type="button"
            className={`
              w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer
              ${
                message.trim()
                  ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                  : 'bg-grey-100 text-grey-400'
              }
            `}
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
