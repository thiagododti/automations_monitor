import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { automationsApi } from '../api';
import { queryKeys } from '@/lib/queryKeys';
import { useDepartmentOptions } from '@/features/departments/hooks';
import { usePositionOptions } from '@/features/positions/hooks';
import type { AutomationCreate, AutomationUpdate } from '../types';

// ─── Schema ───────────────────────────────────────────────────────────────────

export const automationSchema = z
    .object({
        name: z.string().min(1, 'Nome é obrigatório'),
        description: z.string().optional(),
        manual_time: z.coerce.number().int().min(1, 'Deve ser maior que zero'),
        department: z.coerce.number().optional(),
        position: z.coerce.number().optional(),
        in_manutention: z.boolean(),
        auth_certificate: z.boolean(),
        url_certificate: z.string().optional(),
    })
    .refine((data) => !data.auth_certificate || !!data.url_certificate?.trim(), {
        message: 'URL do certificado é obrigatória',
        path: ['url_certificate'],
    });

export type AutomationFormData = z.infer<typeof automationSchema>;

const defaultValues: AutomationFormData = {
    name: '',
    description: '',
    manual_time: 0,
    department: undefined,
    position: undefined,
    in_manutention: false,
    auth_certificate: false,
    url_certificate: '',
};

export interface AutomationEditData {
    id: number;
    name: string;
    description?: string;
    manual_time: number;
    department?: number;
    position?: number;
    in_manutention?: boolean;
    auth_certificate?: boolean;
    url_certificate?: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseAutomationFormProps {
    editData?: AutomationEditData;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useAutomationForm({ editData, onSuccess, onClose }: UseAutomationFormProps) {
    const [open, setOpen] = useState(false);
    const qc = useQueryClient();
    const createMutation = useMutation({
        mutationFn: (data: AutomationCreate) => automationsApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.automations.all() }),
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: AutomationUpdate }) => automationsApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.automations.all() }),
    });
    const { data: departamentos, isLoading: isLoadingDepartments } = useDepartmentOptions(open);
    const { data: posicoes, isLoading: isLoadingPositions } = usePositionOptions(open);

    const form = useForm<AutomationFormData>({
        resolver: zodResolver(automationSchema),
        defaultValues,
    });

    const { reset, watch, handleSubmit } = form;
    const authCertificate = watch('auth_certificate');

    useEffect(() => {
        if (editData) {
            reset({
                name: editData.name,
                description: editData.description || '',
                manual_time: editData.manual_time,
                department: editData.department,
                position: editData.position,
                in_manutention: editData.in_manutention || false,
                auth_certificate: editData.auth_certificate || false,
                url_certificate: editData.url_certificate || '',
            });
            setOpen(true);
        }
    }, [editData, reset]);

    const submitHandler = async (data: AutomationFormData) => {
        try {
            if (editData) {
                await updateMutation.mutateAsync({ id: editData.id, data: data as AutomationUpdate });
            } else {
                await createMutation.mutateAsync(data as AutomationCreate);
            }
            setOpen(false);
            reset(defaultValues);
            onSuccess?.();
        } catch (error) {
            console.error('Erro ao salvar automação:', error);
            toast.error('Erro ao salvar automação. Verifique os dados e tente novamente.');
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
        isLoadingDepartments,
        departamentos,
        isLoadingPositions,
        posicoes,
        authCertificate,
        onSubmit: handleSubmit(submitHandler),
    };
}
