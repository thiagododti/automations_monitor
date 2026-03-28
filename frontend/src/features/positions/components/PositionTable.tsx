import { Pencil, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Position } from '../types';

interface PositionTableProps {
    data: {
        results: Position[];
        count: number;
    } | undefined;
    isLoading: boolean;
    onEdit: (position: Position) => void;
}

export function PositionTable({ data, isLoading, onEdit }: PositionTableProps) {
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
                        <TableHead className="text-muted-foreground">Nome</TableHead>
                        <TableHead className="text-muted-foreground">Descrição</TableHead>
                        <TableHead className="text-muted-foreground">Nível</TableHead>
                        <TableHead className="text-muted-foreground">Custo/Hora</TableHead>
                        <TableHead className="text-muted-foreground w-10"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.results.map((position) => (
                        <TableRow key={position.id} className="border-border">
                            <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                                {position.id}
                            </TableCell>
                            <TableCell className="text-foreground font-medium">{position.name}</TableCell>
                            <TableCell className="text-muted-foreground">{position.description || '—'}</TableCell>
                            <TableCell className="text-muted-foreground">{position.nivel || '—'}</TableCell>
                            <TableCell className="text-muted-foreground">{position.cost_hour || '—'}</TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(position)}
                                >
                                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {data?.results.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                Nenhum cargo encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
