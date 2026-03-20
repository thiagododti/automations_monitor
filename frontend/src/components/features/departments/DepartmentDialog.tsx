import { useState, useEffect } from 'react';
import { useCreateDepartment, useUpdateDepartment } from '@/hooks/useDepartments';
import type { DepartmentCreate } from '@/types/department';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, Building2, CircleCheck } from 'lucide-react';

interface DepartmentDialogProps {
    onSuccess?: () => void;
    onClose?: () => void;
    editData?: {
        id: number;
        name: string;
        description?: string;
        status?: boolean;
    };
}

export function DepartmentDialog({ onSuccess, onClose, editData }: DepartmentDialogProps) {
    const [open, setOpen] = useState(false);
    const createMutation = useCreateDepartment();
    const updateMutation = useUpdateDepartment();
    const [form, setForm] = useState<Partial<DepartmentCreate>>({
        name: '',
        description: '',
        status: true,
    });

    // Abrir dialog e preencher formulário quando editData é fornecido
    useEffect(() => {
        if (editData) {
            setForm({
                name: editData.name,
                description: editData.description || '',
                status: editData.status ?? true,
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
                await createMutation.mutateAsync(form as DepartmentCreate);
            }
            setOpen(false);
            setForm({ name: '', description: '', status: true });
            onSuccess?.();
        } catch (error) {
            console.error('Erro ao salvar departamento:', error);
        }
    };

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) {
            setForm({ name: '', description: '', status: true });
            onClose?.();
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Departamento
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[520px]">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
                        <Building2 className="h-5 w-5 text-primary" />
                        {editData ? 'Editar Departamento' : 'Novo Departamento'}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-1">
                    <form onSubmit={handleSubmit} className="space-y-5 py-1 pr-3">

                        {/* Informações básicas */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Informações Básicas
                            </p>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Nome <span className="text-destructive">*</span></Label>
                                <Input
                                    value={form.name || ''}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Nome do departamento"
                                    required
                                    className="bg-secondary border-border"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Descrição</Label>
                                <Input
                                    value={form.description || ''}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Descrição opcional"
                                    className="bg-secondary border-border"
                                />
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        {/* Status */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Status
                            </p>
                            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <CircleCheck className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Ativo</p>
                                        <p className="text-xs text-muted-foreground">Indica se o departamento está ativo</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={form.status ?? true}
                                    onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editData ? 'Salvar Alterações' : 'Criar Departamento'}
                        </Button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
