import { MessageSquare, Settings, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const navItems = [
  {
    path: '/chat',
    labelKey: 'nav.chat',
    icon: <MessageSquare size={22} />,
  },
  {
    path: '/settings',
    labelKey: 'nav.settings',
    icon: <Settings size={22} />,
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <aside className="flex flex-col items-center w-[68px] min-w-[68px] h-screen bg-surface border-r border-border py-6 gap-2">
      {/* Logo */}
      <button
        type="button"
        onClick={() => navigate('/chat')}
        className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center mb-6 hover:bg-primary-700 transition-colors cursor-pointer"
      >
        <span className="text-white font-display font-bold text-sm">R</span>
      </button>

      {/* Nav Items */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              title={t(item.labelKey)}
              className={`
                w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                    : 'text-grey-400 hover:text-grey-700 hover:bg-grey-50'
                }
              `}
            >
              {item.icon}
            </button>
          );
        })}
      </nav>

      {/* Bottom avatar — navigates to profile */}
      <button
        type="button"
        onClick={() => navigate('/profile')}
        title={t('nav.profile')}
        className={`w-9 h-9 rounded-full flex items-center justify-center mt-auto cursor-pointer transition-all duration-200 btn-icon-interactive ${
          location.pathname.startsWith('/profile')
            ? 'bg-primary-100 ring-2 ring-primary-300'
            : 'bg-grey-200 hover:ring-2 hover:ring-grey-300'
        }`}
      >
        <User size={16} className={location.pathname.startsWith('/profile') ? 'text-primary-600' : 'text-grey-500'} />
      </button>
    </aside>
  );
}
