import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { fetchClient } from '../services/apiClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await fetchClient.get<User>('/users/me');
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refreshUser = async () => {
    try {
      const data = await fetchClient.get<User>('/users/me');
      setUser(data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  const logout = () => {
    void fetchClient.post('/auth/logout').finally(() => {
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
