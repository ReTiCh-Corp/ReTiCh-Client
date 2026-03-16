import { Outlet } from 'react-router-dom';
import MobileNavbar from './MobileNavbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 min-w-0 overflow-hidden pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom navbar */}
      <MobileNavbar />
    </div>
  );
}
