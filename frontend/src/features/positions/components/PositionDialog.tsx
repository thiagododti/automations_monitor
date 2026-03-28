import { Controller } from 'react-hook-form';
import { usePositionForm } from '../hooks';
import type { PositionEditData } from '../hooks';
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
    editData?: PositionEditData;
}

export function PositionDialog({ onSuccess, onClose, editData }: PositionDialogProps) {
    const {
        form,
        open,
        handleOpenChange,
        isLoading,
        nivels,
        isLoadingNivels,
        onSubmit,
    } = usePositionForm({ editData, onSuccess, onClose });

    const { register, control, formState: { errors } } = form;

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
                    <form onSubmit={onSubmit} className="space-y-5 py-1 pr-3">
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
