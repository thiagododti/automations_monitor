import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import type { User } from '@/types/user';
import { authApi } from '@/api/auth';
import { usersApi } from '@/api/users';
import { decodeJwt, isTokenExpired, getTokenExpiry } from '@/lib/jwt';
import { navigateTo } from '@/lib/navigation';

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
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
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
    navigateTo('/login');
  }, []);

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

  const scheduleTokenRefresh = useCallback((accessToken: string) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    const expiry = getTokenExpiry(accessToken);
    if (!expiry) return;

    const msUntilRefresh = expiry.getTime() - Date.now() - 60_000;
    if (msUntilRefresh <= 0) return;

    refreshTimerRef.current = setTimeout(async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken || isTokenExpired(refreshToken)) {
        logout();
        return;
      }
      try {
        const { data } = await authApi.refresh(refreshToken);
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        scheduleTokenRefresh(data.access);
        scheduleLogout(data.refresh);
      } catch {
        logout();
      }
    }, msUntilRefresh);
  }, [logout, scheduleLogout]);

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
    scheduleTokenRefresh(data.access);
    scheduleLogout(data.refresh);
  };

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
            scheduleTokenRefresh(validToken);
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
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [scheduleTokenRefresh, scheduleLogout]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
