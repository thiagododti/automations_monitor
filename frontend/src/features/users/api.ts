import api from '@/lib/axios';
import type { User, UserCreate, UserUpdate, UserFilters, Token, TokenCreate, TokenRegenerate } from './types';
import type { PaginatedResponse } from '@/shared/types/api';

function buildUserFormData(data: UserCreate | UserUpdate): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value instanceof File ? value : String(value));
        }
    });
    return formData;
}

export const usersApi = {
    list: (filters?: UserFilters & { page?: number }) =>
        api.get<PaginatedResponse<User>>('/api/users/', { params: filters }),

    getById: (id: number) =>
        api.get<User>(`/api/users/${id}/`),

    create: (data: UserCreate) =>
        api.post<User>('/api/users/', buildUserFormData(data), {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    patch: (id: number, data: UserUpdate) =>
        api.patch<User>(`/api/users/${id}/`, buildUserFormData(data), {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};

export const tokenApi = {
    getById: (id: number) =>
        api.get<Token>(`/api/tokens/${id}/`),

    create: (data: TokenCreate) =>
        api.post<Token>('/api/tokens/', data),

    regenerate: (data: TokenRegenerate) =>
        api.post<Token>('/api/tokens/regenerate/', data),
};
