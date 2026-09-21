import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

export default function AuthProfileButton({ className = '' }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={`flex items-center ${className}`}>
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
          aria-label="Profil Pengguna"
        >
          <User size={20} />
        </button>
      )}
    </div>
  );
}

