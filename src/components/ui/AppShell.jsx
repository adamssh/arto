import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import SideNav from './SideNav';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background flex">
      <SideNav />
      <main className="flex-1 md:ml-64 relative pb-24 md:pb-0 min-h-screen">
        <div className="w-full max-w-4xl mx-auto md:p-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
