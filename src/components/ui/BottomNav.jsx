import { Home, PieChart, ArrowLeftRight, Target, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Beranda' },
    { to: '/analytics', icon: PieChart, label: 'Analisis' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transaksi' },
    { to: '/goals', icon: Target, label: 'Budget' },
    { to: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-md border-t border-white/50 pb-4 pt-2 px-6 z-40">
      <nav className="flex justify-between items-center max-w-md mx-auto h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 transition-colors w-16 ${
                  isActive ? 'text-primary' : 'text-text-secondary hover:text-sage'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`px-4 py-1 rounded-xl transition-colors ${isActive ? 'bg-primary/15' : ''}`}>
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
