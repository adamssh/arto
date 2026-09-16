import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Extract name from user metadata, fallback to email if not found
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="p-6 max-w-md mx-auto">
      <header className="mb-8 mt-4">
        <h1 className="text-2xl font-semibold">Halo, {fullName}</h1>
        <p className="text-text-secondary mt-1">Selamat datang di Arto</p>
      </header>

      <Card className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
          <span className="text-primary text-2xl">💸</span>
        </div>
        <h3 className="font-medium text-lg mb-1">Belum ada data transaksi</h3>
        <p className="text-sm text-text-secondary">Mulai catat pengeluaranmu hari ini.</p>
      </Card>
    </div>
  );
}

