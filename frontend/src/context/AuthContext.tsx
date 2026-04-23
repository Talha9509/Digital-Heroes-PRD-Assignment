import  {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode} from 'react'
import { api } from '../api/client';

/* eslint-disable react-refresh/only-export-components */

type Role = 'SUBSCRIBER' | 'ADMIN';

interface User {
  id: string;
  email: string;
  role: Role;
  subscriptionStatus: 'NONE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  subscriptionPlan?: string | null;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    try {
      const me = await api.get<User & { subscriptionPlan?: string | null }>(
        '/auth/me',
      );
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadMe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{
      token: string;
      user: { id: string; email: string; role: Role };
    }>('/auth/login', { email, password });

    localStorage.setItem('accessToken', res.token);
    await loadMe();
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}