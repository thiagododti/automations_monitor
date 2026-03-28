import { useState, useEffect } from 'react';
import { useBusinessForm } from '../hooks';
import type { Business } from '../types';
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

export function BusinessDialog({ onSuccess, onClose, editData }: BusinessDialogProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (editData) setOpen(true);
    }, [editData]);

    const handleSuccess = () => {
        setOpen(false);
        onSuccess?.();
    };

    const {
        form,
        onDialogClose,
        isLoading,
        logoFile,
        setLogoFile,
        logoPreview,
        setLogoPreview,
        fileInputRef,
        certFile,
        setCertFile,
        certInputRef,
        certificatePassword,
        setCertificatePassword,
        certificateReadError,
        certificateValidationOk,
        isReadingCertificate,
        handleReadCertificate,
        watchedCertFields,
        onSubmit,
    } = useBusinessForm({ editData, onSuccess: handleSuccess, onClose });

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) onDialogClose();
    };

    const { register, formState: { errors } } = form;
    const [certExpire, subjectCn, subjectC, subjectO, issuerCn, issuerC, issuerO] = watchedCertFields;



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
                    <form onSubmit={onSubmit} className="space-y-6 px-6 pb-6 pt-2">
                        {/* Informações Básicas */}
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
                                                setLogoFile(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
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
                                                setLogoFile(file);
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
                                        {...register('name')}
                                        placeholder="Nome da empresa"
                                        className="border-border bg-secondary"
                                    />
                                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">
                                        CNPJ <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        {...register('cnpj')}
                                        placeholder="00.000.000/0001-00"
                                        className="border-border bg-secondary"
                                    />
                                    {errors.cnpj && <p className="text-xs text-destructive">{errors.cnpj.message}</p>}
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="text-sm text-foreground">Descrição</Label>
                                    <Input
                                        {...register('description')}
                                        placeholder="Descrição da empresa"
                                        className="border-border bg-secondary"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Certificado */}
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
                                                setCertFile(file);
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
                                        {certFile ? 'Alterar certificado' : 'Selecionar certificado'}
                                    </Button>
                                    {certFile && (
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => {
                                                setCertFile(undefined);
                                                setCertificatePassword('');
                                                setCertificateValidationOk(false);
                                                setCertificateReadError(null);
                                                if (certInputRef.current) certInputRef.current.value = '';
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {certFile
                                    ? `Arquivo selecionado: ${certFile.name}`
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
                                    disabled={isReadingCertificate || !certFile}
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
                                <Input type="date" value={certExpire || ''} readOnly className="border-border bg-secondary" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Subject CN</Label>
                                    <Input value={subjectCn || ''} readOnly placeholder="Common Name" className="border-border bg-secondary" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Subject C</Label>
                                    <Input value={subjectC || ''} readOnly placeholder="País" className="border-border bg-secondary" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Subject O</Label>
                                    <Input value={subjectO || ''} readOnly placeholder="Organização" className="border-border bg-secondary" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Issuer CN</Label>
                                    <Input value={issuerCn || ''} readOnly placeholder="Common Name" className="border-border bg-secondary" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Issuer C</Label>
                                    <Input value={issuerC || ''} readOnly placeholder="País" className="border-border bg-secondary" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Issuer O</Label>
                                    <Input value={issuerO || ''} readOnly placeholder="Organização" className="border-border bg-secondary" />
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
