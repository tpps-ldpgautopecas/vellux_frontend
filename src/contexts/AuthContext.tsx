import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (credentials: any) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vellux_token');
    const savedProfile = localStorage.getItem('vellux_profile');
    
    if (token && savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Erro ao ler perfil do storage', e);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (credentials: any) => {
    const data = await api.post('/auth/login', credentials);
    if (data.token && data.usuario) {
      localStorage.setItem('vellux_token', data.token);
      localStorage.setItem('vellux_profile', JSON.stringify(data.usuario));
      setProfile(data.usuario);
    }
  };

  const signUp = async (data: any) => {
    await api.post('/auth/register', data);
    await signIn({ email: data.email, password: data.password });
  };

  const signOut = async () => {
    localStorage.removeItem('vellux_token');
    localStorage.removeItem('vellux_profile');
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user: profile, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
