import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { tokenApi } from '@/api/token';
import { Token, TokenCreate, TokenRegenerate } from '@/types/token';

export function useToken(id: number, enabled = true) {
    return useQuery<Token | null>({
        queryKey: ['token', id],
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
        mutationFn: (data) =>
            tokenApi.create(data).then(res => res.data),

        onSuccess: (_, variables) => {
            qc.invalidateQueries({
                queryKey: ['token', variables.user_id],
            });
        },
    });
}

export function useRegenerateToken() {
    const qc = useQueryClient();

    return useMutation<Token, Error, TokenRegenerate>({
        mutationFn: (data) =>
            tokenApi.regenerate(data).then(res => res.data),

        onSuccess: (_, variables) => {
            qc.invalidateQueries({
                queryKey: ['token', variables.user_id],
            });
        },
    });
}