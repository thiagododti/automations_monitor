import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { KpisByAutomations } from '../types';
import { formatCurrency, formatPercent, formatCompactSeconds } from '@/lib/formatters';

interface KpisByAutomationTableProps {
    data: KpisByAutomations[];
    isLoading: boolean;
}

export function KpisByAutomationTable({ data, isLoading }: KpisByAutomationTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">KPIs por Automação</CardTitle>
                <CardDescription>
                    Ranking de performance individual das automações (ordenado por execuções)
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="rounded-md border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
                        Nenhuma automação encontrada para os filtros selecionados.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Automação</TableHead>
                                <TableHead className="text-right">Execuções</TableHead>
                                <TableHead className="text-right">Eficiência</TableHead>
                                <TableHead className="text-right">Economia</TableHead>
                                <TableHead className="text-right">Custo Evitado</TableHead>
                                <TableHead className="text-right">Tempo Economizado</TableHead>
                                <TableHead className="text-right">Erros</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.automation_id}>
                                    <TableCell className="font-medium">{item.automation_name}</TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {item.total_executions.toLocaleString('pt-BR')}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {formatPercent(item.avg_efficiency_percent)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {formatCurrency(item.total_cost_economy)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {formatCurrency(item.total_potential_cost)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {formatCompactSeconds(item.total_time_economy_seconds)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {item.total_errors.toLocaleString('pt-BR')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
