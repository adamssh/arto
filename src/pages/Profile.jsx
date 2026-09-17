import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Profile() {
  const { signOut, user } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'Guest';
  const displayEmail = user?.email || 'Belum terdaftar';

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">Profil</h1>
      </header>

      <Card className="flex flex-col items-center justify-center py-8 text-center mb-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 border-2 border-primary/20">
          <span className="text-primary text-3xl font-medium">
            {fullName.charAt(0).toUpperCase()}
          </span>
        </div>
        <h2 className="font-medium text-xl">{fullName}</h2>
        <p className="text-text-secondary">{displayEmail}</p>
      </Card>

      {user ? (
        <Button variant="secondary" className="w-full" onClick={handleSignOut}>
          Keluar
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <Button className="w-full" onClick={() => navigate('/login')}>
            Masuk / Daftar Sekarang
          </Button>
          <p className="text-sm text-center text-text-secondary">
            Simpan data Anda secara permanen di Cloud dengan mendaftarkan akun.
          </p>
        </div>
      )}
    </div>
  );
}

