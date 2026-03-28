import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCreateDepartment, useUpdateDepartment } from '../hooks';

// ─── Schema ───────────────────────────────────────────────────────────────────

const departmentSchema = z.object({
    name: z.string().min(1, 'Nome e obrigatorio'),
    description: z.string().optional(),
    status: z.boolean(),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;

const defaultValues: DepartmentFormData = { name: '', description: '', status: true };

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDepartmentForm({ editData, onSuccess, onClose }: UseDepartmentFormProps) {
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
        }
    }, [editData, reset]);

    const submitHandler = async (data: DepartmentFormData) => {
        try {
            if (editData) {
                await updateMutation.mutateAsync({ id: editData.id, data });
            } else {
                await createMutation.mutateAsync(data);
            }
            reset(defaultValues);
            onSuccess?.();
        } catch (error) {
            console.error('Erro ao salvar departamento:', error);
            toast.error('Erro ao salvar departamento. Verifique os dados e tente novamente.');
        }
    };

    const onDialogClose = () => {
        reset(defaultValues);
        onClose?.();
    };

    return {
        form,
        onDialogClose,
        isLoading: createMutation.isPending || updateMutation.isPending,
        onSubmit: handleSubmit(submitHandler),
    };
}
