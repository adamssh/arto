import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../context/AuthContext';
import AuthProfileButton from '../ui/AuthProfileButton';

export default function GreetingHeader() {
  const { data: profile } = useProfile();
  const { user } = useAuth();
  
  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest';
  const today = format(new Date(), 'EEEE, d MMMM yyyy', { locale: idLocale });

  return (
    <header className="mb-6 flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Halo, {fullName}</h1>
        <p className="text-text-primary/90 mt-1 text-sm">{today}</p>
      </div>
      <AuthProfileButton />
    </header>
  );
}

