import api from '@/lib/axios';
import type { Token, TokenCreate, TokenRegenerate } from '@/types/token';


export const tokenApi = {
    getById: (id: number) =>
        api.get<Token>(`/api/tokens/${id}/`),

    create: (data: TokenCreate) =>
        api.post<Token>('/api/tokens/', data),

    regenerate: (data: TokenRegenerate) =>
        api.post<Token>(`/api/tokens/regenerate/`, data),
}