import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/features/users/types';
import { authApi } from '@/features/auth/api';
import { usersApi } from '@/features/users/api';
import { decodeJwt, isTokenExpired, getTokenExpiry } from '@/lib/jwt';

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
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    const refreshToken = localStorage.getItem('refresh_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    if (refreshToken) {
      authApi.blacklist(refreshToken).catch(() => { });
    }
    navigate('/login');
  }, [navigate]);

  const scheduleLogout = useCallback((refreshToken: string) => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    const expiry = getTokenExpiry(refreshToken);
    if (!expiry) return;

    const msUntilLogout = expiry.getTime() - Date.now();
    if (msUntilLogout <= 0) {
      logout();
      return;
    }

    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, msUntilLogout);
  }, [logout]);

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
    scheduleLogout(data.refresh);
  };

  // Escuta eventos emitidos pelo interceptor do axios
  useEffect(() => {
    const handleTokenRefreshed = (e: Event) => {
      const { refresh } = (e as CustomEvent<{ access: string; refresh: string }>).detail;
      if (refresh) scheduleLogout(refresh);
    };

    const handleSessionExpired = () => logout();

    window.addEventListener('auth:token-refreshed', handleTokenRefreshed);
    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('auth:token-refreshed', handleTokenRefreshed);
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [logout, scheduleLogout]);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');

      let validToken: string | null = null;
      let latestRefreshToken: string | null = storedRefreshToken;

      if (accessToken && !isTokenExpired(accessToken)) {
        validToken = accessToken;
      } else if (storedRefreshToken && !isTokenExpired(storedRefreshToken)) {
        try {
          const { data } = await authApi.refresh(storedRefreshToken);
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          validToken = data.access;
          latestRefreshToken = data.refresh;
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          latestRefreshToken = null;
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        latestRefreshToken = null;
      }

      if (validToken) {
        const decoded = decodeJwt(validToken);
        const userId = Number(decoded?.user_id);

        if (Number.isFinite(userId)) {
          const fullUser = await fetchUserById(userId);
          if (fullUser) {
            setUser(fullUser);
            if (latestRefreshToken) scheduleLogout(latestRefreshToken);
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

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [scheduleLogout]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
