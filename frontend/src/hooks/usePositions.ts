import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { positionsApi } from '@/api/positions';
import type { PositionFilters, PositionCreate, PositionUpdate } from '@/types/position';

export function usePositions(filters?: PositionFilters, page = 1) {
    return useQuery({
        queryKey: ['positions', filters, page],
        queryFn: () => positionsApi.list({ ...filters, page }).then((res) => res.data),
    });
}

export function usePosition(id: number) {
    return useQuery({
        queryKey: ['positions', id],
        queryFn: () => positionsApi.getById(id).then((res) => res.data),
        enabled: !!id,
    });
}

export function useCreatePosition() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: PositionCreate) => positionsApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['positions'] }),
    });
}

export function useUpdatePosition() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: PositionUpdate }) => positionsApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['positions'] }),
    });
}

export function usePositionOptions(enabled: boolean) {
    return useQuery({
        queryKey: ['positionOptions'],
        queryFn: () => positionsApi.getOptions().then((res) => res.data),
        enabled
    });
}

export function usePositionNivels(enabled: boolean) {
    return useQuery({
        queryKey: ['positionNivels'],
        queryFn: () => positionsApi.getNivels().then((res) => res.data),
        enabled
    });
}