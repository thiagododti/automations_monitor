import { useState, useEffect } from 'react';
import { useCreatePosition, useUpdatePosition, usePositionNivels } from '@/hooks/usePositions';
import type { PositionCreate } from '@/types/position';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, BriefcaseBusiness } from 'lucide-react';

interface PositionDialogProps {
    onSuccess?: () => void;
    onClose?: () => void;
    editData?: {
        id: number;
        name: string;
        description: string;
        nivel: string;
        cost_hour: string;
    };
}

const emptyForm: PositionCreate = {
    name: '',
    description: '',
    nivel: '',
    cost_hour: '',
};

export function PositionDialog({ onSuccess, onClose, editData }: PositionDialogProps) {
    const [open, setOpen] = useState(false);
    const createMutation = useCreatePosition();
    const updateMutation = useUpdatePosition();
    const [form, setForm] = useState<PositionCreate>(emptyForm);
    const { data: nivels, isLoading: isLoadingNivels } = usePositionNivels(open);

    useEffect(() => {
        if (editData) {
            setForm({
                name: editData.name,
                description: editData.description || '',
                nivel: editData.nivel,
                cost_hour: editData.cost_hour || '',
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
                await createMutation.mutateAsync(form);
            }
            setOpen(false);
            setForm(emptyForm);
            onSuccess?.();
        } catch (error) {
            console.error('Erro ao salvar cargo:', error);
        }
    };

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) {
            setForm(emptyForm);
            onClose?.();
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cargo
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[520px]">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
                        <BriefcaseBusiness className="h-5 w-5 text-primary" />
                        {editData ? 'Editar Cargo' : 'Novo Cargo'}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-1">
                    <form onSubmit={handleSubmit} className="space-y-5 py-1 pr-3">
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Informações Básicas
                            </p>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Nome <span className="text-destructive">*</span></Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Nome do cargo"
                                    required
                                    className="bg-secondary border-border"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Descrição</Label>
                                <Input
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Descrição do cargo"
                                    className="bg-secondary border-border"
                                />
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Classificação
                            </p>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Nível <span className="text-destructive">*</span></Label>
                                <Select
                                    value={form.nivel || 'none'}
                                    onValueChange={(val) => setForm({ ...form, nivel: val === 'none' ? '' : val })}
                                >
                                    <SelectTrigger className="bg-secondary border-border w-full">
                                        <SelectValue placeholder="Selecione um nível" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Selecione</SelectItem>
                                        {!isLoadingNivels &&
                                            nivels?.map((nivel) => (
                                                <SelectItem key={nivel.value} value={nivel.value}>
                                                    {nivel.display}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Custo por Hora <span className="text-destructive">*</span></Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.cost_hour}
                                    onChange={(e) => setForm({ ...form, cost_hour: e.target.value })}
                                    placeholder="0.00"
                                    required
                                    className="bg-secondary border-border"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editData ? 'Salvar Alterações' : 'Criar Cargo'}
                        </Button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
