import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await signIn(email, password);
    
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-2">Selamat Datang</h1>
        <p className="text-text-secondary text-sm mb-6">Masuk ke akun Arto kamu.</p>
        
        {error && (
          <div className="bg-expense/10 text-expense p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            label="Email" 
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Password" 
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Masuk...' : 'Masuk'}
          </Button>
        </form>

        <p className="text-sm text-center mt-6 text-text-secondary">
          Belum punya akun?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Daftar
          </Link>
        </p>
      </Card>
    </div>
  );
}

