/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Support for Demo Logins
    const handleDemoLogin = (e: any) => {
      const isAlt = e.detail?.role === 'admin';
      const demoProfile: UserProfile = {
        uid: isAlt ? 'demo-admin' : 'demo-user',
        email: isAlt ? 'admin@exemplovellux.com.br' : 'visitante@exemplovellux.com.br',
        displayName: isAlt ? 'Administrador Chefe' : 'Visitante Ilustre',
        role: isAlt ? UserRole.ADMIN : UserRole.CLIENT,
        createdAt: Date.now(),
      };
      setProfile(demoProfile);
      setLoading(false);
      localStorage.setItem('auth:demo', isAlt ? 'admin' : 'client');
    };

    window.addEventListener('auth:demo', handleDemoLogin as any);

    // Persist demo login
    const savedDemo = localStorage.getItem('auth:demo');
    if (savedDemo) {
      handleDemoLogin({ detail: { role: savedDemo } });
    } else {
      setLoading(false);
    }

    return () => {
      window.removeEventListener('auth:demo', handleDemoLogin);
    };
  }, []);

  const signOut = async () => {
    localStorage.removeItem('auth:demo');
    setProfile(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
