import { Controller } from 'react-hook-form';
import { useDepartmentForm } from '../hooks';
import type { DepartmentEditData } from '../hooks';
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
    editData?: DepartmentEditData;
}

export function DepartmentDialog({ onSuccess, onClose, editData }: DepartmentDialogProps) {
    const {
        form,
        open,
        handleOpenChange,
        isLoading,
        onSubmit,
    } = useDepartmentForm({ editData, onSuccess, onClose });

    const { register, control, formState: { errors } } = form;

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
                    <form onSubmit={onSubmit} className="space-y-5 py-1 pr-3">
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Informacoes Basicas
                            </p>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Nome <span className="text-destructive">*</span></Label>
                                <Input
                                    {...register('name')}
                                    placeholder="Nome do departamento"
                                    className="bg-secondary border-border"
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Descricao</Label>
                                <Input
                                    {...register('description')}
                                    placeholder="Descricao opcional"
                                    className="bg-secondary border-border"
                                />
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Status
                            </p>
                            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <CircleCheck className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Ativo</p>
                                        <p className="text-xs text-muted-foreground">Indica se o departamento esta ativo</p>
                                    </div>
                                </div>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editData ? 'Salvar Alteracoes' : 'Criar Departamento'}
                        </Button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}