import { useState, useEffect } from 'react';
import { useCreateAutomation, useUpdateAutomation } from '@/hooks/useAutomations';
import { useDepartmentOptions } from '@/hooks/useDepartments';
import { usePositionOptions } from '@/hooks/usePositions';
import type { AutomationCreate } from '@/types/automation';
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
    editData?: {
        id: number;
        name: string;
        description?: string;
        manual_time: number;
        department?: number;
        position?: number;
        in_manutention?: boolean;
        auth_certificate?: boolean;
        url_certificate?: string;
    };
}

export function AutomationDialog({ onSuccess, onClose, editData }: AutomationDialogProps) {
    const [open, setOpen] = useState(false);
    const createMutation = useCreateAutomation();
    const updateMutation = useUpdateAutomation();
    const [form, setForm] = useState<Partial<AutomationCreate>>({
        name: '',
        description: '',
        manual_time: 0,
        position: undefined,
        in_manutention: false,
        auth_certificate: false,
        url_certificate: '',
    });
    const { data: departamentos, isLoading: isLoadingDepartments } = useDepartmentOptions(open);
    const { data: posicoes, isLoading: isLoadingPositions } = usePositionOptions(open);

    // Abrir dialog e preencher formulário quando editData é fornecido
    useEffect(() => {
        if (editData) {
            setForm({
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
    }, [editData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editData) {
                await updateMutation.mutateAsync({ id: editData.id, data: form });
            } else {
                await createMutation.mutateAsync(form as AutomationCreate);
            }
            setOpen(false);
            setForm({
                name: '',
                description: '',
                manual_time: 0,
                position: undefined,
                in_manutention: false,
                auth_certificate: false,
                url_certificate: '',
            });
            onSuccess?.();
        } catch (error) {
            console.error('Erro ao salvar automação:', error);
        }
    };

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) {
            setForm({
                name: '',
                description: '',
                manual_time: 0,
                position: undefined,
                in_manutention: false,
                auth_certificate: false,
                url_certificate: '',
            });
            onClose?.();
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

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
                    <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6 pt-2">

                        {/* Informações básicas */}
                        <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Informações Básicas
                            </p>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Nome <span className="text-destructive">*</span></Label>
                                    <Input
                                        value={form.name || ''}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Nome da automação"
                                        required
                                        className="bg-secondary border-border"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Departamento</Label>
                                    <Select
                                        value={form.department ? String(form.department) : 'none'}
                                        onValueChange={(val) =>
                                            setForm({ ...form, department: val === 'none' ? undefined : Number(val) })
                                        }
                                    >
                                        <SelectTrigger className="bg-secondary border-border w-full">
                                            <SelectValue placeholder="Selecione um departamento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Nenhum</SelectItem>
                                            {!isLoadingDepartments &&
                                                departamentos?.map((dept) => (
                                                    <SelectItem key={dept.id} value={String(dept.id)}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="text-sm text-foreground">Descrição</Label>
                                    <Input
                                        value={form.description || ''}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                                    <Label className="text-sm text-foreground">Tempo Manual (seg)<span className="text-destructive">*</span></Label>
                                    <Input
                                        required
                                        type="text"
                                        inputMode="numeric"
                                        pattern="^[1-9][0-9]*$"
                                        value={form.manual_time ?? 0}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, '');
                                            setForm({ ...form, manual_time: raw === '' ? 0 : Number(raw) });
                                        }}
                                        className="bg-secondary border-border"
                                        min={1}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Cargo <span className="text-destructive">*</span></Label>
                                    <Select
                                        value={form.position ? String(form.position) : 'none'}
                                        onValueChange={(val) =>
                                            setForm({ ...form, position: val === 'none' ? undefined : Number(val) })
                                        }
                                    >
                                        <SelectTrigger className="bg-secondary border-border w-full">
                                            <SelectValue placeholder="Selecione um cargo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Selecione</SelectItem>
                                            {!isLoadingPositions &&
                                                posicoes?.map((pos) => (
                                                    <SelectItem key={pos.id} value={String(pos.id)}>
                                                        {pos.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
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
                                    <Switch
                                        checked={form.auth_certificate || false}
                                        onCheckedChange={(checked) =>
                                            setForm({
                                                ...form,
                                                auth_certificate: checked,
                                                url_certificate: checked ? form.url_certificate || '' : '',
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">URL do Certificado</Label>
                                    <Input
                                        type="url"
                                        value={form.url_certificate || ''}
                                        onChange={(e) => setForm({ ...form, url_certificate: e.target.value })}
                                        placeholder="https://..."
                                        className="bg-secondary border-border"
                                        disabled={!form.auth_certificate}
                                        required={!!form.auth_certificate}
                                    />
                                </div>
                            </div>

                            {/* Status */}
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
                                    <Switch
                                        checked={form.in_manutention || false}
                                        onCheckedChange={(checked) => setForm({ ...form, in_manutention: checked })}
                                    />
                                </div>
                            </div>
                        </div>

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
