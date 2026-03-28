import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessApi } from './api';
import { queryKeys } from '@/lib/queryKeys';
import type { BusinessFilters, BusinessCreate, BusinessUpdate } from './types';

// ─── Query hooks ──────────────────────────────────────────────────────────────

export function useBusinesses(filters?: BusinessFilters, page = 1) {
    return useQuery({
        queryKey: queryKeys.businesses.list(filters, page),
        queryFn: () => businessApi.list({ ...filters, page }).then((res) => res.data),
    });
}

export function useBusiness(id: number) {
    return useQuery({
        queryKey: queryKeys.businesses.detail(id),
        queryFn: () => businessApi.getById(id).then((res) => res.data),
        enabled: !!id,
    });
}

export function useCreateBusiness() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: BusinessCreate) => businessApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.businesses.all() }),
    });
}

export function useUpdateBusiness() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: BusinessUpdate }) =>
            businessApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.businesses.all() }),
    });
}

export function useBusinessOptions(enabled: boolean) {
    return useQuery({
        queryKey: queryKeys.businesses.options(),
        queryFn: () => businessApi.getOptions().then((res) => res.data),
        enabled,
    });
}

// ─── Form hook ───────────────────────────────────────────────────────────────
// Extraído para hooks/useBusinessForm.ts e hooks/useBusinessCertificate.ts

export type { BusinessFormData } from './hooks/useBusinessForm';
export { useBusinessForm } from './hooks/useBusinessForm';
export { useBusinessCertificate } from './hooks/useBusinessCertificate';
