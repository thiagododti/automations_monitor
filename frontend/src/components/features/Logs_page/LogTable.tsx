import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Log } from '@/types/log';

interface LogTableProps {
    data: {
        results: Log[];
        count: number;
    } | undefined;
    isLoading: boolean;
}

export function LogTable({ data, isLoading }: LogTableProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-border bg-card shadow-surface-sm">
            <Table>
                <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">ID</TableHead>
                        <TableHead className="text-muted-foreground">Execução</TableHead>
                        <TableHead className="text-muted-foreground">Descrição</TableHead>
                        <TableHead className="text-muted-foreground">Criado em</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.results.map((log) => (
                        <TableRow key={log.id} className="border-border">
                            <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                                {log.id}
                            </TableCell>
                            <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                                #{log.execution}
                            </TableCell>
                            <TableCell className="text-foreground max-w-md truncate">
                                {log.description || '—'}
                            </TableCell>
                            <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                                {new Date(log.created_at).toLocaleString('pt-BR')}
                            </TableCell>
                        </TableRow>
                    ))}
                    {data?.results.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                Nenhum log encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
