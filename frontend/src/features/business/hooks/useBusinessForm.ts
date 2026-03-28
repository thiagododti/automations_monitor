import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { businessApi } from '../api';
import { queryKeys } from '@/lib/queryKeys';
import { useBusinessCertificate } from './useBusinessCertificate';
import type { Business, BusinessCreate, BusinessUpdate } from '../types';

// ─── Schema ───────────────────────────────────────────────────────────────────

export const businessSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    cnpj: z.string().min(1, 'CNPJ é obrigatório'),
    description: z.string().optional(),
    certificate_expire: z.string().optional(),
    subject_cn: z.string().optional(),
    subject_c: z.string().optional(),
    subject_o: z.string().optional(),
    issuer_cn: z.string().optional(),
    issuer_c: z.string().optional(),
    issuer_o: z.string().optional(),
});

export type BusinessFormData = z.infer<typeof businessSchema>;

const defaultValues: BusinessFormData = {
    name: '',
    cnpj: '',
    description: '',
    certificate_expire: '',
    subject_cn: '',
    subject_c: '',
    subject_o: '',
    issuer_cn: '',
    issuer_c: '',
    issuer_o: '',
};

function normalizeDateForInput(dateValue?: string | null): string {
    if (!dateValue) return '';
    return dateValue.includes('T') ? dateValue.split('T')[0] : dateValue;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseBusinessFormProps {
    editData?: Business;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useBusinessForm({ editData, onSuccess, onClose }: UseBusinessFormProps) {
    const qc = useQueryClient();
    const createMutation = useMutation({
        mutationFn: (data: BusinessCreate) => businessApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.businesses.all() }),
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: BusinessUpdate }) => businessApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.businesses.all() }),
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<BusinessFormData>({
        resolver: zodResolver(businessSchema),
        defaultValues,
    });

    const { reset, setValue, watch, handleSubmit } = form;
    const watchedCertFields = watch([
        'certificate_expire',
        'subject_cn',
        'subject_c',
        'subject_o',
        'issuer_cn',
        'issuer_c',
        'issuer_o',
    ]);

    const certificate = useBusinessCertificate({
        getCnpj: () => watch('cnpj'),
        onDataParsed: (parsed) => {
            setValue('certificate_expire', parsed.certificate_expire || '');
            setValue('subject_cn', parsed.subject_cn || '');
            setValue('subject_c', parsed.subject_c || '');
            setValue('subject_o', parsed.subject_o || '');
            setValue('issuer_cn', parsed.issuer_cn || '');
            setValue('issuer_c', parsed.issuer_c || '');
            setValue('issuer_o', parsed.issuer_o || '');
        },
    });

    useEffect(() => {
        if (editData) {
            reset({
                name: editData.name,
                cnpj: editData.cnpj,
                description: editData.description || '',
                certificate_expire: normalizeDateForInput(editData.certificate_expire),
                subject_cn: editData.subject_cn || '',
                subject_c: editData.subject_c || '',
                subject_o: editData.subject_o || '',
                issuer_cn: editData.issuer_cn || '',
                issuer_c: editData.issuer_c || '',
                issuer_o: editData.issuer_o || '',
            });
            setLogoPreview(editData.logo || null);
        }
    }, [editData, reset]);

    const resetState = () => {
        reset(defaultValues);
        setLogoFile(null);
        setLogoPreview(null);
        certificate.resetCertificate();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onDialogClose = () => {
        resetState();
        onClose?.();
    };

    const submitHandler = async (data: BusinessFormData) => {
        if (certificate.certFile && !certificate.certificateValidationOk) {
            certificate.setCertificateReadError('Valide o certificado com o CNPJ da empresa antes de salvar.');
            return;
        }
        try {
            if (editData) {
                const updateData: BusinessUpdate = {
                    name: data.name,
                    description: data.description,
                    cnpj: data.cnpj,
                    certificate_expire: data.certificate_expire,
                    subject_cn: data.subject_cn,
                    subject_c: data.subject_c,
                    subject_o: data.subject_o,
                    issuer_cn: data.issuer_cn,
                    issuer_c: data.issuer_c,
                    issuer_o: data.issuer_o,
                };
                if (logoFile) updateData.logo = logoFile;
                if (certificate.certFile) updateData.certificado = certificate.certFile;
                await updateMutation.mutateAsync({ id: editData.id, data: updateData });
            } else {
                await createMutation.mutateAsync({
                    name: data.name,
                    description: data.description || '',
                    cnpj: data.cnpj,
                    logo: logoFile,
                    certificado: certificate.certFile!,
                    certificate_expire: data.certificate_expire,
                    subject_cn: data.subject_cn || '',
                    subject_c: data.subject_c || '',
                    subject_o: data.subject_o || '',
                    issuer_cn: data.issuer_cn || '',
                    issuer_c: data.issuer_c || '',
                    issuer_o: data.issuer_o || '',
                });
            }
            resetState();
            onSuccess?.();
        } catch (error) {
            console.error('Erro ao salvar empresa:', error);
            toast.error('Erro ao salvar empresa. Verifique os dados e tente novamente.');
        }
    };

    return {
        form,
        onDialogClose,
        isLoading: createMutation.isPending || updateMutation.isPending,
        // logo
        logoFile,
        setLogoFile,
        logoPreview,
        setLogoPreview,
        fileInputRef,
        // certificate (spread para manter API pública idêntica)
        ...certificate,
        watchedCertFields,
        onSubmit: handleSubmit(submitHandler),
    };
}
