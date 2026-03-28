import { Controller } from 'react-hook-form';
import { useAutomationForm } from '../hooks';
import type { AutomationEditData } from '../hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, Bot, Wrench } from 'lucide-react';

interface AutomationDialogProps {
    onSuccess?: () => void;
    onClose?: () => void;
    editData?: AutomationEditData;
}

export function AutomationDialog({ onSuccess, onClose, editData }: AutomationDialogProps) {
    const {
        form,
        open,
        handleOpenChange,
        isLoading,
        isLoadingDepartments,
        departamentos,
        isLoadingPositions,
        posicoes,
        authCertificate,
        onSubmit,
    } = useAutomationForm({ editData, onSuccess, onClose });

    const { register, control, formState: { errors } } = form;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Automação
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[760px] p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
                        <Bot className="h-5 w-5 text-primary" />
                        {editData ? 'Editar Automação' : 'Nova Automação'}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[78vh]">
                    <form onSubmit={onSubmit} className="space-y-6 px-6 pb-6 pt-2">

                        {/* Informações básicas */}
                        <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Informações Básicas
                            </p>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Nome <span className="text-destructive">*</span></Label>
                                    <Input
                                        {...register('name')}
                                        placeholder="Nome da automação"
                                        className="bg-secondary border-border"
                                    />
                                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Departamento</Label>
                                    <Controller
                                        name="department"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value ? String(field.value) : 'none'}
                                                onValueChange={(val) => field.onChange(val === 'none' ? undefined : Number(val))}
                                            >
                                                <SelectTrigger className="bg-secondary border-border w-full">
                                                    <SelectValue placeholder="Selecione um departamento" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Nenhum</SelectItem>
                                                    {!isLoadingDepartments && departamentos?.map((dept) => (
                                                        <SelectItem key={dept.id} value={String(dept.id)}>
                                                            {dept.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="text-sm text-foreground">Descrição</Label>
                                    <Input
                                        {...register('description')}
                                        placeholder="Descrição opcional"
                                        className="bg-secondary border-border"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Classificação */}
                        <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Classificação
                            </p>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Tempo Manual (seg) <span className="text-destructive">*</span></Label>
                                    <Controller
                                        name="manual_time"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                value={field.value ?? 0}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/\D/g, '');
                                                    field.onChange(raw === '' ? 0 : Number(raw));
                                                }}
                                                className="bg-secondary border-border"
                                            />
                                        )}
                                    />
                                    {errors.manual_time && <p className="text-xs text-destructive">{errors.manual_time.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Cargo <span className="text-destructive">*</span></Label>
                                    <Controller
                                        name="position"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value ? String(field.value) : 'none'}
                                                onValueChange={(val) => field.onChange(val === 'none' ? undefined : Number(val))}
                                            >
                                                <SelectTrigger className="bg-secondary border-border w-full">
                                                    <SelectValue placeholder="Selecione um cargo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Selecione</SelectItem>
                                                    {!isLoadingPositions && posicoes?.map((pos) => (
                                                        <SelectItem key={pos.id} value={String(pos.id)}>
                                                            {pos.name} - {pos.nivel} - R${pos.cost_hour}/h
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Certificado */}
                            <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Certificado
                                </p>
                                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Usa Certificado</p>
                                        <p className="text-xs text-muted-foreground">Habilita autenticação por certificado para esta automação</p>
                                    </div>
                                    <Controller
                                        name="auth_certificate"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        )}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">URL do Certificado</Label>
                                    <Input
                                        type="url"
                                        {...register('url_certificate')}
                                        placeholder="https://..."
                                        className="bg-secondary border-border"
                                        disabled={!authCertificate}
                                    />
                                    {errors.url_certificate && <p className="text-xs text-destructive">{errors.url_certificate.message}</p>}
                                </div>
                            </div>

                            {/* Manutenção */}
                            <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Manutenção
                                </p>
                                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Wrench className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium text-foreground">Em Manutenção</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Desativa execuções desta automação</p>
                                    </div>
                                    <Controller
                                        name="in_manutention"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editData ? 'Salvar Alterações' : 'Criar Automação'}
                        </Button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
