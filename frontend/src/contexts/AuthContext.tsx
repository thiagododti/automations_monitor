import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import type { LoginCredentials, User } from "@/types/api";
import { tokenStorage } from "@/services/tokenStorage";
import { getUserIdFromToken, isTokenExpired } from "@/lib/jwt";
import { httpClient } from "@/services/httpClient";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    window.location.href = "/login";
  }, []);

  const fetchUser = useCallback(async (token: string) => {
    const userId = getUserIdFromToken(token);
    if (!userId) throw new Error("Invalid token");
    const userData = await httpClient<User>(`/users/${userId}/`);
    setUser(userData);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const res = await fetch("/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Credenciais inválidas");
    }

    const tokens = await res.json();
    tokenStorage.set(tokens);
    await fetchUser(tokens.access);
  }, [fetchUser]);

  useEffect(() => {
    const init = async () => {
      const access = tokenStorage.getAccess();
      const refresh = tokenStorage.getRefresh();

      if (!access || !refresh) {
        setIsLoading(false);
        return;
      }

      if (isTokenExpired(refresh)) {
        tokenStorage.clear();
        setIsLoading(false);
        return;
      }

      try {
        await fetchUser(access);
      } catch {
        tokenStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
