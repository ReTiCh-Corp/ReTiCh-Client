import { MessageSquare, Settings, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  {
    path: '/chat',
    label: 'Chats',
    icon: <MessageSquare size={22} />,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: <Settings size={22} />,
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: <User size={22} />,
  },
];

export default function MobileNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-stretch justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors duration-200 cursor-pointer relative
                ${isActive ? 'text-primary-600' : 'text-grey-400'}
              `}
            >
              {/* Active indicator pill */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[3px] rounded-b-full bg-primary-500" />
              )}
              {item.icon}
              <span
                className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-primary-600' : 'text-grey-400'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
