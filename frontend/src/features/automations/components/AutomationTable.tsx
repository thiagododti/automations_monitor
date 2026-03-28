import { useState } from 'react';
import { Pencil, Loader2, Bot, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { formatManualTime, formatCurrency } from '@/lib/formatters';
import type { Automation } from '../types';
import { toast } from 'sonner';
import { useClearTestExecutions } from '@/features/executions/hooks';

interface AutomationTableProps {
    data: {
        results: Automation[];
        count: number;
    } | undefined;
    isLoading: boolean;
    isStaff: boolean;
    onEdit: (automation: Automation) => void;
}

export function AutomationTable({ data, isLoading, isStaff, onEdit }: AutomationTableProps) {
    const clearTestExecutions = useClearTestExecutions();
    const [clearTargetId, setClearTargetId] = useState<number | null>(null);
    const [clearTargetName, setClearTargetName] = useState<string>('');

    const handleConfirmClear = () => {
        if (clearTargetId !== null) {
            clearTestExecutions.mutate(clearTargetId, {
                onSuccess: () => {
                    setClearTargetId(null);
                    toast.success('Execuções de teste limpas com sucesso!', {
                        description: `Automação: ${clearTargetName}`,
                    });
                },
                onError: () => {
                    toast.error('Erro ao limpar execuções de teste.', {
                        description: 'Verifique sua conexão e tente novamente.',
                    });
                },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <>
            <div className="rounded-lg border border-border bg-card shadow-surface-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent bg-muted/30">
                            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider w-14">ID</TableHead>
                            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Nome</TableHead>
                            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Departamento</TableHead>
                            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Cargo</TableHead>
                            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Custo/Hora</TableHead>
                            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Tempo Manual</TableHead>
                            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Status</TableHead>
                            <TableHead className="w-10" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.results.map((auto) => (
                            <TableRow key={auto.id} className="border-border hover:bg-muted/20 transition-colors">
                                <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                                    #{auto.id}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="text-foreground font-medium leading-snug">{auto.name}</p>
                                        {auto.description && (
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                                {auto.description}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {auto.department_data?.name || '—'}
                                </TableCell>
                                <TableCell className="text-sm font-medium text-foreground">
                                    {auto.position_data ? `${auto.position_data.name} - ${auto.position_data.nivel}` : '—'}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground tabular-nums">
                                    {auto.position_data?.cost_hour ? formatCurrency(auto.position_data.cost_hour) : '—'}
                                </TableCell>
                                <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                                    {formatManualTime(auto.manual_time)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span
                                            className={cn(
                                                'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                                                auto.is_active
                                                    ? 'bg-success/15 text-success'
                                                    : 'bg-muted text-muted-foreground'
                                            )}
                                        >
                                            {auto.is_active ? 'Ativo' : 'Inativo'}
                                        </span>
                                        {auto.in_manutention && (
                                            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-warning/15 text-warning">
                                                Manutenção
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        {isStaff && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setClearTargetId(auto.id);
                                                    setClearTargetName(auto.name);
                                                }}
                                                className="h-8 w-8 p-0"
                                                title="Limpar execuções de teste"
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(auto)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {data?.results.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="py-16">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Bot className="h-8 w-8 opacity-30" />
                                        <p className="text-sm">Nenhuma automação encontrada.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog
                open={clearTargetId !== null}
                onOpenChange={(open) => {
                    if (!open && !clearTestExecutions.isPending) setClearTargetId(null);
                }}
            >
                <AlertDialogContent>
                    {clearTestExecutions.isPending ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-6">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Limpando execuções de teste...</p>
                        </div>
                    ) : (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Limpar execuções de teste</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja limpar todas as execuções de teste da automação{' '}
                                    <strong>{clearTargetName}</strong>? Essa ação não pode ser desfeita.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleConfirmClear}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Limpar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
