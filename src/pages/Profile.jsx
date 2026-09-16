import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Profile() {
  const { signOut, user } = useAuth();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-8 mt-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
      </header>

      <Card className="flex flex-col items-center justify-center py-8 text-center mb-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 border-2 border-primary/20">
          <span className="text-primary text-3xl font-medium">
            {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <h2 className="font-medium text-xl">{user?.user_metadata?.full_name || 'User'}</h2>
        <p className="text-text-secondary">{user?.email}</p>
      </Card>

      <Button variant="secondary" className="w-full" onClick={signOut}>
        Keluar
      </Button>
    </div>
  );
}

