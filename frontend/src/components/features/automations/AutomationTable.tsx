import { Pencil, Loader2, Bot } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Automation } from '@/types/automation';

interface AutomationTableProps {
    data: {
        results: Automation[];
        count: number;
    } | undefined;
    isLoading: boolean;
    onEdit: (automation: Automation) => void;
}

function formatManualTime(seconds: number): string {
    if (!seconds) return '—';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return remaining > 0 ? `${minutes}m ${remaining}s` : `${minutes}m`;
}

function formatCost(cost: string): string {
    if (!cost) return '—';
    const num = parseFloat(cost);
    if (isNaN(num)) return cost;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
}

export function AutomationTable({ data, isLoading, onEdit }: AutomationTableProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
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
                                {formatCost(auto.position_data?.cost_hour || '')}
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
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(auto)}
                                    className="h-8 w-8 p-0"
                                >
                                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
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
    );
}
