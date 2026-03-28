import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api';
import { queryKeys } from '@/lib/queryKeys';
import { useUserPhotoUpload } from './useUserPhotoUpload';
import { useDepartmentOptions } from '@/features/departments/hooks';
import type { UserCreate, UserUpdate } from '../types';

// ─── Schema ───────────────────────────────────────────────────────────────────

export const userFormSchema = z.object({
    username: z.string().min(1, 'Usuário é obrigatório'),
    email: z.union([z.string().email('Email inválido'), z.literal('')]).optional(),
    first_name: z.string().optional().default(''),
    last_name: z.string().optional().default(''),
    telephone: z.string().optional().default(''),
    birthday: z.string().optional().default(''),
    department: z.number().optional(),
    is_active: z.boolean(),
    is_staff: z.boolean(),
    is_superuser: z.boolean(),
    password: z.string().optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

const defaultValues: UserFormData = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    telephone: '',
    birthday: '',
    department: undefined,
    is_active: true,
    is_staff: false,
    is_superuser: false,
    password: '',
};

export interface UserEditData {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    telephone?: string | null;
    birthday?: string | null;
    department?: number | null;
    is_active?: boolean;
    is_staff?: boolean;
    is_superuser?: boolean;
    photo?: string | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseUserFormProps {
    open: boolean;
    editData?: UserEditData;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useUserForm({ open, editData, onSuccess, onClose }: UseUserFormProps) {
    const qc = useQueryClient();
    const createMutation = useMutation({
        mutationFn: (data: UserCreate) => usersApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all() }),
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UserUpdate }) => usersApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all() }),
    });
    const { data: departamentos, isLoading: isLoadingDepartments } = useDepartmentOptions(open);
    const photo = useUserPhotoUpload();

    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit, setError } = form;

    useEffect(() => {
        if (editData) {
            reset({
                username: editData.username,
                email: editData.email,
                first_name: editData.first_name,
                last_name: editData.last_name,
                telephone: editData.telephone || '',
                birthday: editData.birthday || '',
                department: editData.department ?? undefined,
                is_active: editData.is_active ?? true,
                is_staff: editData.is_staff ?? false,
                is_superuser: editData.is_superuser ?? false,
                password: '',
            });
            photo.setPhotoPreview(editData.photo || null);
        }
    }, [editData, reset]); // eslint-disable-line react-hooks/exhaustive-deps

    const submitHandler = async (data: UserFormData) => {
        if (!editData && !data.password) {
            setError('password', { message: 'Senha é obrigatória' });
            return;
        }
        try {
            if (editData) {
                const updateData: UserUpdate = {
                    username: data.username,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    telephone: data.telephone,
                    birthday: data.birthday,
                    department: data.department,
                    is_active: data.is_active,
                    is_staff: data.is_staff,
                    is_superuser: data.is_superuser,
                };
                if (data.password) updateData.password = data.password;
                if (photo.photoFile) updateData.photo = photo.photoFile;
                await updateMutation.mutateAsync({ id: editData.id, data: updateData });
            } else {
                await createMutation.mutateAsync({
                    username: data.username,
                    email: data.email || '',
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    telephone: data.telephone,
                    birthday: data.birthday,
                    department: data.department,
                    is_active: data.is_active,
                    is_staff: data.is_staff,
                    is_superuser: data.is_superuser,
                    password: data.password!,
                    photo: photo.photoFile,
                });
            }
            reset(defaultValues);
            photo.resetPhoto();
            onSuccess?.();
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            toast.error('Erro ao salvar usuário. Verifique os dados e tente novamente.');
        }
    };

    const onDialogClose = () => {
        reset(defaultValues);
        photo.resetPhoto();
        onClose?.();
    };

    return {
        form,
        onDialogClose,
        isLoading: createMutation.isPending || updateMutation.isPending,
        departamentos,
        isLoadingDepartments,
        // photo (spread para manter API pública idêntica)
        ...photo,
        onSubmit: handleSubmit(submitHandler),
    };
}
