import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

export default function GreetingHeader() {
  const { data: profile } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest';
  const today = format(new Date(), 'EEEE, d MMMM yyyy', { locale: idLocale });

  return (
    <header className="mb-6 flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Halo, {fullName}</h1>
        <p className="text-text-primary/90 mt-1 text-sm">{today}</p>
      </div>
      <div>
        {!user ? (
          <button 
            onClick={() => navigate('/login')}
            className="bg-transparent border border-text-primary text-text-primary text-xs px-2.5 h-7 flex items-center rounded-lg font-medium hover:bg-text-primary/5 transition-colors"
          >
            Login / Register
          </button>
        ) : (
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 backdrop-blur-md text-primary hover:bg-primary/20 transition-colors"
          >
            <User size={20} />
          </button>
        )}
      </div>
    </header>
  );
}

