import { useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const handleSyncComplete = () => {
      queryClient.invalidateQueries();
    };
    window.addEventListener('syncComplete', handleSyncComplete);
    return () => window.removeEventListener('syncComplete', handleSyncComplete);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
