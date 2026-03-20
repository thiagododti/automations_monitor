import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/types/user';
import { authApi } from '@/api/auth';
import { usersApi } from '@/api/users';
import { decodeJwt, isTokenExpired } from '@/lib/jwt';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUserById(userId: number): Promise<User | null> {
  try {
    const { data } = await usersApi.getById(userId);
    return data;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    window.location.href = '/login';
  }, []);

  const login = async (username: string, password: string) => {
    const { data } = await authApi.login({ username, password });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    const decoded = decodeJwt(data.access);
    const userId = Number(decoded?.user_id);

    if (!Number.isFinite(userId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw new Error('Token sem user_id valido');
    }

    const fullUser = await fetchUserById(userId);
    if (!fullUser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw new Error('Nao foi possivel carregar o usuario autenticado');
    }

    setUser(fullUser);
  };

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      let validToken: string | null = null;

      if (accessToken && !isTokenExpired(accessToken)) {
        validToken = accessToken;
      } else if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          const { data } = await authApi.refresh(refreshToken);
          localStorage.setItem('access_token', data.access);
          validToken = data.access;
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }

      if (validToken) {
        const decoded = decodeJwt(validToken);
        const userId = Number(decoded?.user_id);

        if (Number.isFinite(userId)) {
          const fullUser = await fetchUserById(userId);
          if (fullUser) {
            setUser(fullUser);
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        } else {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
