import { NavLink, useNavigate } from 'react-router-dom';
import { Home, PieChart, WalletCards, Target, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SideNav() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { icon: <Home size={24} />, label: 'Beranda', path: '/' },
    { icon: <Target size={24} />, label: 'Budget', path: '/goals' },
    { icon: <WalletCards size={24} />, label: 'Riwayat', path: '/history' },
    { icon: <PieChart size={24} />, label: 'Analisis', path: '/analytics' },
    { icon: <Settings size={24} />, label: 'Kelola', path: '/manage' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-screen bg-surface border-r border-sage/10 fixed left-0 top-0 pt-8 pb-6 px-4 z-40 shadow-soft">
      <div className="mb-10 px-4 flex items-center gap-3">
        <img src="/icon.png" alt="Arto Logo" className="w-8 h-8 object-cover rounded-lg" />
        <h1 className="text-3xl font-bold text-primary tracking-tight">Arto</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl2 font-medium transition-colors ${
                isActive 
                  ? 'bg-primary text-surface shadow-soft' 
                  : 'text-text-secondary hover:bg-sage/10 hover:text-text-primary'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full text-left rounded-xl2 font-medium text-text-secondary hover:bg-expense/10 hover:text-expense transition-colors"
        >
          <LogOut size={24} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}

