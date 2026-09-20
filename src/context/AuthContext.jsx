import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { syncLocalDataToCloud } from '../services/syncService';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, fullName) => {
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (res.data?.user) {
      await syncLocalDataToCloud(res.data.user.id);
      window.dispatchEvent(new Event('syncComplete'));
    }
    return res;
  };

  const signIn = async (email, password) => {
    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (res.data?.user) {
      await syncLocalDataToCloud(res.data.user.id);
      window.dispatchEvent(new Event('syncComplete'));
    }
    return res;
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user, signUp, signIn, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

