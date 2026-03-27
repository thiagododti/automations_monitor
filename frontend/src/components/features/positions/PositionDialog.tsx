import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePosition, useUpdatePosition, usePositionNivels } from '@/hooks/usePositions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, BriefcaseBusiness } from 'lucide-react';

const positionSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    description: z.string().optional().default(''),
    nivel: z.string().min(1, 'Nível é obrigatório'),
    cost_hour: z.string().min(1, 'Custo por hora é obrigatório'),
});

type PositionFormData = z.infer<typeof positionSchema>;

const defaultValues: PositionFormData = { name: '', description: '', nivel: '', cost_hour: '' };

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

export function PositionDialog({ onSuccess, onClose, editData }: PositionDialogProps) {
    const [open, setOpen] = useState(false);
    const createMutation = useCreatePosition();
    const updateMutation = useUpdatePosition();
    const { data: nivels, isLoading: isLoadingNivels } = usePositionNivels(open);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<PositionFormData>({
        resolver: zodResolver(positionSchema),
        defaultValues,
    });

    useEffect(() => {
        if (editData) {
            reset({
                name: editData.name,
                description: editData.description || '',
                nivel: editData.nivel,
                cost_hour: editData.cost_hour || '',
            });
            setOpen(true);
        }
    }, [editData, reset]);

    const onSubmit = async (data: PositionFormData) => {
        try {
            if (editData) {
                await updateMutation.mutateAsync({ id: editData.id, data });
            } else {
                await createMutation.mutateAsync(data);
            }
            setOpen(false);
            reset(defaultValues);
            onSuccess?.();
        } catch (error) {
            console.error('Erro ao salvar cargo:', error);
        }
    };

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) {
            reset(defaultValues);
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
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-1 pr-3">
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Informações Básicas
                            </p>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Nome <span className="text-destructive">*</span></Label>
                                <Input
                                    {...register('name')}
                                    placeholder="Nome do cargo"
                                    className="bg-secondary border-border"
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Descrição</Label>
                                <Input
                                    {...register('description')}
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
                                <Controller
                                    name="nivel"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value || 'none'}
                                            onValueChange={(val) => field.onChange(val === 'none' ? '' : val)}
                                        >
                                            <SelectTrigger className="bg-secondary border-border w-full">
                                                <SelectValue placeholder="Selecione um nível" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Selecione</SelectItem>
                                                {!isLoadingNivels && nivels?.map((nivel) => (
                                                    <SelectItem key={nivel.value} value={nivel.value}>
                                                        {nivel.display}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.nivel && <p className="text-xs text-destructive">{errors.nivel.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Custo por Hora <span className="text-destructive">*</span></Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    {...register('cost_hour')}
                                    placeholder="0.00"
                                    className="bg-secondary border-border"
                                />
                                {errors.cost_hour && <p className="text-xs text-destructive">{errors.cost_hour.message}</p>}
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
