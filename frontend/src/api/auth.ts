import api from '@/lib/axios';
import type { LoginCredentials, TokenResponse, RefreshResponse } from '@/types/auth';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<TokenResponse>('/api/token/', credentials),

  refresh: (refresh: string) =>
    api.post<RefreshResponse>('/api/token/refresh/', { refresh }),

  verify: (token: string) =>
    api.post('/api/token/verify/', { token }),
};
