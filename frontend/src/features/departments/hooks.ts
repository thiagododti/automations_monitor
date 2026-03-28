import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { departmentsApi } from './api';
import { queryKeys } from '@/lib/queryKeys';
import type { DepartmentFilters, DepartmentCreate, DepartmentUpdate } from './types';

// ─── Query hooks ──────────────────────────────────────────────────────────────

export function useDepartments(filters?: DepartmentFilters, page = 1) {
    return useQuery({
        queryKey: queryKeys.departments.list(filters, page),
        queryFn: () => departmentsApi.list({ ...filters, page }).then((res) => res.data),
    });
}

export function useDepartment(id: number) {
    return useQuery({
        queryKey: queryKeys.departments.detail(id),
        queryFn: () => departmentsApi.getById(id).then((res) => res.data),
        enabled: !!id,
    });
}

export function useCreateDepartment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: DepartmentCreate) => departmentsApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.departments.all() }),
    });
}

export function useUpdateDepartment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: DepartmentUpdate }) =>
            departmentsApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.departments.all() }),
    });
}

export function useDepartmentOptions(enabled: boolean) {
    return useQuery({
        queryKey: queryKeys.departments.options(),
        queryFn: () => departmentsApi.getOptions().then((res) => res.data),
        enabled,
    });
}

// ─── Form hook ────────────────────────────────────────────────────────────────

const departmentSchema = z.object({
    name: z.string().min(1, 'Nome e obrigatorio'),
    description: z.string().optional(),
    status: z.boolean(),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;

const defaultValues: DepartmentFormData = { name: '', description: '', status: true };

export interface DepartmentEditData {
    id: number;
    name: string;
    description?: string;
    status?: boolean;
}

interface UseDepartmentFormProps {
    editData?: DepartmentEditData;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useDepartmentForm({ editData, onSuccess, onClose }: UseDepartmentFormProps) {
    const [open, setOpen] = useState(false);
    const createMutation = useCreateDepartment();
    const updateMutation = useUpdateDepartment();

    const form = useForm<DepartmentFormData>({
        resolver: zodResolver(departmentSchema),
        defaultValues,
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (editData) {
            reset({
                name: editData.name,
                description: editData.description || '',
                status: editData.status ?? true,
            });
            setOpen(true);
        }
    }, [editData, reset]);

    const submitHandler = async (data: DepartmentFormData) => {
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
            console.error('Erro ao salvar departamento:', error);
            toast.error('Erro ao salvar departamento. Verifique os dados e tente novamente.');
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
        onSubmit: handleSubmit(submitHandler),
    };
}
