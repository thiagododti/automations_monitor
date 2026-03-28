import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { usersApi, tokenApi } from './api';
import { queryKeys } from '@/lib/queryKeys';
import type { UserFilters, UserCreate, UserUpdate, Token, TokenCreate, TokenRegenerate } from './types';

// ─── Users query hooks ────────────────────────────────────────────────────────

export function useUsers(filters?: UserFilters, page = 1) {
    return useQuery({
        queryKey: queryKeys.users.list(filters, page),
        queryFn: () => usersApi.list({ ...filters, page }).then((res) => res.data),
    });
}

export function useUser(id: number) {
    return useQuery({
        queryKey: queryKeys.users.detail(id),
        queryFn: () => usersApi.getById(id).then((res) => res.data),
        enabled: !!id,
    });
}

export function useCreateUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UserCreate) => usersApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all() }),
    });
}

export function useUpdateUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UserUpdate }) => usersApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all() }),
    });
}

// ─── Token hooks ──────────────────────────────────────────────────────────────

export function useToken(id: number, enabled = true) {
    return useQuery<Token | null>({
        queryKey: queryKeys.tokens.detail(id),
        queryFn: async () => {
            try {
                const response = await tokenApi.getById(id);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 404) {
                    return null;
                }
                throw error;
            }
        },
        enabled: enabled && !!id,
        retry: false,
    });
}

export function useCreateToken() {
    const qc = useQueryClient();
    return useMutation<Token, Error, TokenCreate>({
        mutationFn: (data) => tokenApi.create(data).then((res) => res.data),
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: queryKeys.tokens.detail(variables.user_id) });
        },
    });
}

export function useRegenerateToken() {
    const qc = useQueryClient();
    return useMutation<Token, Error, TokenRegenerate>({
        mutationFn: (data) => tokenApi.regenerate(data).then((res) => res.data),
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: queryKeys.tokens.detail(variables.user_id) });
        },
    });
}

// ─── User form hook ──────────────────────────────────────────────────────────
// Extraído para hooks/useUserForm.ts e hooks/useUserPhotoUpload.ts

export type { UserFormData, UserEditData } from './hooks/useUserForm';
export { useUserForm } from './hooks/useUserForm';
export { useUserPhotoUpload } from './hooks/useUserPhotoUpload';
