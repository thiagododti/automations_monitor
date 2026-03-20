import { useEffect, useRef, useState } from 'react';
import { useCreateBusiness, useUpdateBusiness } from '@/hooks/useBusiness';
import type { Business, BusinessCreate, BusinessUpdate } from '@/types/business';
import { readDigitalCertificate } from '@/lib/certificate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Camera, FileUp, KeyRound, Loader2, Plus, Shield, X } from 'lucide-react';

interface BusinessDialogProps {
    onSuccess?: () => void;
    onClose?: () => void;
    editData?: Business;
}

const emptyForm: Partial<BusinessCreate> = {
    name: '',
    description: '',
    cnpj: '',
    logo: null,
    certificate_expire: '',
    subject_cn: '',
    subject_c: '',
    subject_o: '',
    issuer_cn: '',
    issuer_c: '',
    issuer_o: '',
};

function normalizeDateForInput(dateValue?: string | null): string {
    if (!dateValue) {
        return '';
    }

    return dateValue.includes('T') ? dateValue.split('T')[0] : dateValue;
}

function onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
}

export function BusinessDialog({ onSuccess, onClose, editData }: BusinessDialogProps) {
    const [open, setOpen] = useState(false);
    const createMutation = useCreateBusiness();
    const updateMutation = useUpdateBusiness();
    const [form, setForm] = useState<Partial<BusinessCreate>>(emptyForm);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [certificatePassword, setCertificatePassword] = useState('');
    const [certificateReadError, setCertificateReadError] = useState<string | null>(null);
    const [certificateValidationOk, setCertificateValidationOk] = useState(false);
    const [isReadingCertificate, setIsReadingCertificate] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const certInputRef = useRef<HTMLInputElement>(null);

    const handleReadCertificate = async () => {
        if (!(form.certificado instanceof File)) {
            setCertificateReadError('Selecione um certificado .pfx ou .p12 antes de ler os dados.');
            return;
        }

        if (!certificatePassword.trim()) {
            setCertificateReadError('Informe a senha do certificado para continuar.');
            return;
        }

        setCertificateReadError(null);
        setIsReadingCertificate(true);

        try {
            const parsed = await readDigitalCertificate(form.certificado, certificatePassword);

            const formCnpjDigits = onlyDigits(form.cnpj || '');
            const certificateCnpjDigits = parsed.certificate_cnpj ? onlyDigits(parsed.certificate_cnpj) : '';

            if (!formCnpjDigits) {
                setCertificateValidationOk(false);
                setCertificateReadError('Informe o CNPJ da empresa antes de validar o certificado.');
                return;
            }

            if (!certificateCnpjDigits) {
                setCertificateValidationOk(false);
                setCertificateReadError('Nao foi possivel identificar o CNPJ dentro do certificado.');
                return;
            }

            if (formCnpjDigits !== certificateCnpjDigits) {
                setCertificateValidationOk(false);
                setCertificateReadError('O CNPJ do certificado e diferente do CNPJ da empresa informada.');
                return;
            }

            setCertificateValidationOk(true);
            setForm((prev) => ({
                ...prev,
                ...parsed,
            }));
        } catch (error) {
            setCertificateValidationOk(false);
            setCertificateReadError(error instanceof Error ? error.message : 'Erro ao ler o certificado.');
        } finally {
            setIsReadingCertificate(false);
        }
    };

    useEffect(() => {
        if (editData) {
            setForm({
                name: editData.name,
                description: editData.description || '',
                cnpj: editData.cnpj,
                logo: null,
                certificate_expire: normalizeDateForInput(editData.certificate_expire),
                subject_cn: editData.subject_cn || '',
                subject_c: editData.subject_c || '',
                subject_o: editData.subject_o || '',
                issuer_cn: editData.issuer_cn || '',
                issuer_c: editData.issuer_c || '',
                issuer_o: editData.issuer_o || '',
            });
            setLogoPreview(editData.logo || null);
            setOpen(true);
        }
    }, [editData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.certificado instanceof File && !certificateValidationOk) {
            setCertificateReadError('Valide o certificado com o CNPJ da empresa antes de salvar.');
            return;
        }

        try {
            if (editData) {
                const updateData: BusinessUpdate = {
                    name: form.name,
                    description: form.description,
                    cnpj: form.cnpj,
                    certificate_expire: form.certificate_expire,
                    subject_cn: form.subject_cn,
                    subject_c: form.subject_c,
                    subject_o: form.subject_o,
                    issuer_cn: form.issuer_cn,
                    issuer_c: form.issuer_c,
                    issuer_o: form.issuer_o,
                };

                if (form.logo instanceof File) {
                    updateData.logo = form.logo;
                }

                if (form.certificado instanceof File) {
                    updateData.certificado = form.certificado;
                }

                await updateMutation.mutateAsync({ id: editData.id, data: updateData });
            } else {
                await createMutation.mutateAsync(form as BusinessCreate);
            }

            setOpen(false);
            setForm(emptyForm);
            setLogoPreview(null);
            setCertificatePassword('');
            setCertificateReadError(null);
            setCertificateValidationOk(false);
            onSuccess?.();
        } catch (error) {
            console.error('Erro ao salvar empresa:', error);
        }
    };

    const handleOpenChange = (value: boolean) => {
        setOpen(value);

        if (!value) {
            setForm(emptyForm);
            setLogoPreview(null);
            setCertificatePassword('');
            setCertificateReadError(null);
            setCertificateValidationOk(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (certInputRef.current) {
                certInputRef.current.value = '';
            }
            onClose?.();
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Empresa
                </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card sm:max-w-[820px] p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="flex items-center gap-2 text-lg text-foreground">
                        <Building2 className="h-5 w-5 text-primary" />
                        {editData ? 'Editar Empresa' : 'Nova Empresa'}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[78vh]">
                    <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6 pt-2">
                        <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Informações Básicas
                            </p>

                            <div className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/40 p-4 sm:flex-row sm:items-center">
                                <div className="relative">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={logoPreview || undefined} />
                                        <AvatarFallback className="bg-secondary text-muted-foreground">
                                            <Building2 className="h-7 w-7" />
                                        </AvatarFallback>
                                    </Avatar>

                                    {logoPreview && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setLogoPreview(null);
                                                setForm({ ...form, logo: null });
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                            className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground hover:bg-destructive/80"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>

                                <div className="flex-1 space-y-1.5">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setForm({ ...form, logo: file });
                                                setLogoPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="border-border bg-secondary hover:bg-secondary/80"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera className="mr-2 h-4 w-4" />
                                        {logoPreview ? 'Alterar logo' : 'Selecionar logo'}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Máx. 5MB.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">
                                        Nome <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        value={form.name || ''}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Nome da empresa"
                                        required
                                        className="border-border bg-secondary"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">
                                        CNPJ <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        value={form.cnpj || ''}
                                        onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                                        placeholder="00.000.000/0001-00"
                                        required
                                        className="border-border bg-secondary"
                                    />
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="text-sm text-foreground">Descrição</Label>
                                    <Input
                                        value={form.description || ''}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Descrição da empresa"
                                        className="border-border bg-secondary"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Certificado
                            </p>

                            <div className="flex flex-col gap-3 rounded-lg border border-border bg-secondary/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                        Arquivo do Certificado
                                    </p>
                                    <p className="text-xs text-muted-foreground">Envie o certificado usado nas integrações da empresa.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={certInputRef}
                                        type="file"
                                        accept=".pfx,.p12"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setForm({ ...form, certificado: file });
                                                setCertificateValidationOk(false);
                                                setCertificateReadError(null);
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="border-border bg-secondary hover:bg-secondary/80"
                                        onClick={() => certInputRef.current?.click()}
                                    >
                                        <FileUp className="mr-2 h-4 w-4" />
                                        {form.certificado instanceof File ? 'Alterar certificado' : 'Selecionar certificado'}
                                    </Button>
                                    {form.certificado instanceof File && (
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => {
                                                setForm({ ...form, certificado: undefined });
                                                setCertificatePassword('');
                                                setCertificateValidationOk(false);
                                                setCertificateReadError(null);
                                                if (certInputRef.current) {
                                                    certInputRef.current.value = '';
                                                }
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground">
                                {form.certificado instanceof File
                                    ? `Arquivo selecionado: ${form.certificado.name}`
                                    : editData?.certificado
                                        ? 'Já existe um certificado cadastrado para esta empresa.'
                                        : 'Nenhum certificado selecionado.'}
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-end">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Senha do Certificado</Label>
                                    <Input
                                        type="password"
                                        value={certificatePassword}
                                        onChange={(e) => setCertificatePassword(e.target.value)}
                                        placeholder="Digite a senha do certificado"
                                        autoComplete="new-password"
                                        name="certificate-password"
                                        className="border-border bg-secondary"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-border bg-secondary hover:bg-secondary/80"
                                    onClick={handleReadCertificate}
                                    disabled={isReadingCertificate || !(form.certificado instanceof File)}
                                >
                                    {isReadingCertificate ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <KeyRound className="mr-2 h-4 w-4" />
                                    )}
                                    Ler Certificado
                                </Button>
                            </div>

                            {certificateReadError && (
                                <p className="text-xs text-destructive">{certificateReadError}</p>
                            )}

                            {certificateValidationOk && (
                                <p className="text-xs text-emerald-600">Certificado validado com o CNPJ informado.</p>
                            )}

                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Validade do Certificado</Label>
                                <Input
                                    type="date"
                                    value={form.certificate_expire || ''}
                                    readOnly
                                    className="border-border bg-secondary"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Subject CN <span className="text-destructive">*</span></Label>
                                    <Input
                                        value={form.subject_cn || ''}
                                        readOnly
                                        placeholder="Common Name"
                                        required
                                        className="border-border bg-secondary"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Subject C <span className="text-destructive">*</span></Label>
                                    <Input
                                        value={form.subject_c || ''}
                                        readOnly
                                        placeholder="País"
                                        required
                                        className="border-border bg-secondary"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Subject O <span className="text-destructive">*</span></Label>
                                    <Input
                                        value={form.subject_o || ''}
                                        readOnly
                                        placeholder="Organização"
                                        required
                                        className="border-border bg-secondary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Issuer CN <span className="text-destructive">*</span></Label>
                                    <Input
                                        value={form.issuer_cn || ''}
                                        readOnly
                                        placeholder="Common Name"
                                        required
                                        className="border-border bg-secondary"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Issuer C <span className="text-destructive">*</span></Label>
                                    <Input
                                        value={form.issuer_c || ''}
                                        readOnly
                                        placeholder="País"
                                        required
                                        className="border-border bg-secondary"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Issuer O <span className="text-destructive">*</span></Label>
                                    <Input
                                        value={form.issuer_o || ''}
                                        readOnly
                                        placeholder="Organização"
                                        required
                                        className="border-border bg-secondary"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editData ? 'Salvar Alterações' : 'Criar Empresa'}
                        </Button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}