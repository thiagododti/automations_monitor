import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessApi } from '@/api/business';
import type { BusinessFilters, BusinessCreate, BusinessUpdate } from '@/types/business';

export function useBusinesses(filters?: BusinessFilters, page = 1) {
    return useQuery({
        queryKey: ['businesses', filters, page],
        queryFn: () => businessApi.list({ ...filters, page }).then((res) => res.data),
    });
}

export function useBusiness(id: number) {
    return useQuery({
        queryKey: ['businesses', id],
        queryFn: () => businessApi.getById(id).then((res) => res.data),
        enabled: !!id,
    });
}

export function useCreateBusiness() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: BusinessCreate) => businessApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['businesses'] }),
    });
}

export function useUpdateBusiness() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: BusinessUpdate }) => businessApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['businesses'] }),
    });
}

export function useBusinessOptions(enabled: boolean) {
    return useQuery({
        queryKey: ['businessOptions'],
        queryFn: () => businessApi.getOptions().then((res) => res.data),
        enabled
    });
}

