import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { positionsApi } from './api';
import { queryKeys } from '@/lib/queryKeys';
import type { PositionFilters, PositionCreate, PositionUpdate } from './types';

// ─── Query hooks ──────────────────────────────────────────────────────────────

export function usePositions(filters?: PositionFilters, page = 1) {
    return useQuery({
        queryKey: queryKeys.positions.list(filters, page),
        queryFn: () => positionsApi.list({ ...filters, page }).then((res) => res.data),
    });
}

export function usePosition(id: number) {
    return useQuery({
        queryKey: queryKeys.positions.detail(id),
        queryFn: () => positionsApi.getById(id).then((res) => res.data),
        enabled: !!id,
    });
}

export function useCreatePosition() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: PositionCreate) => positionsApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.positions.all() }),
    });
}

export function useUpdatePosition() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: PositionUpdate }) =>
            positionsApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.positions.all() }),
    });
}

export function usePositionOptions(enabled: boolean) {
    return useQuery({
        queryKey: queryKeys.positions.options(),
        queryFn: () => positionsApi.getOptions().then((res) => res.data),
        enabled,
    });
}

export function usePositionNivels(enabled: boolean) {
    return useQuery({
        queryKey: queryKeys.positions.nivels(),
        queryFn: () => positionsApi.getNivels().then((res) => res.data),
        enabled,
    });
}

// ─── Form hook ────────────────────────────────────────────────────────────────

const positionSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    description: z.string().optional().default(''),
    nivel: z.string().min(1, 'Nível é obrigatório'),
    cost_hour: z.string().min(1, 'Custo por hora é obrigatório'),
});

export type PositionFormData = z.infer<typeof positionSchema>;

const defaultValues: PositionFormData = { name: '', description: '', nivel: '', cost_hour: '' };

export interface PositionEditData {
    id: number;
    name: string;
    description: string;
    nivel: string;
    cost_hour: string;
}

interface UsePositionFormProps {
    editData?: PositionEditData;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function usePositionForm({ editData, onSuccess, onClose }: UsePositionFormProps) {
    const [open, setOpen] = useState(false);
    const createMutation = useCreatePosition();
    const updateMutation = useUpdatePosition();
    const { data: nivels, isLoading: isLoadingNivels } = usePositionNivels(open);

    const form = useForm<PositionFormData>({
        resolver: zodResolver(positionSchema),
        defaultValues,
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (editData) {
            reset({
                name: editData.name,
                description: editData.description || '',
                nivel: editData.nivel,
                cost_hour: editData.cost_hour || '',
            });
            setOpen(true);
        }
    }, [editData, reset]);

    const submitHandler = async (data: PositionFormData) => {
        try {
            if (editData) {
                await updateMutation.mutateAsync({ id: editData.id, data });
            } else {
                await createMutation.mutateAsync(data);
            }
            setOpen(false);
            reset(defaultValues);
            onSuccess?.();
        } catch (error) {
            console.error('Erro ao salvar cargo:', error);
            toast.error('Erro ao salvar cargo. Verifique os dados e tente novamente.');
        }
    };

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) {
            reset(defaultValues);
            onClose?.();
        }
    };

    return {
        form,
        open,
        handleOpenChange,
        isLoading: createMutation.isPending || updateMutation.isPending,
        nivels,
        isLoadingNivels,
        onSubmit: handleSubmit(submitHandler),
    };
}
