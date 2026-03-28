import type { User } from '@/features/users/types';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface JwtTokenPair {
    access: string;
    refresh: string;
}

export type TokenResponse = JwtTokenPair;
export type RefreshResponse = JwtTokenPair;

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}
