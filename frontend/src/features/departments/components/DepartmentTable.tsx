import { Pencil, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Department } from '../types';

interface DepartmentTableProps {
    data: {
        results: Department[];
        count: number;
    } | undefined;
    isLoading: boolean;
    onEdit: (department: Department) => void;
}

export function DepartmentTable({ data, isLoading, onEdit }: DepartmentTableProps) {
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
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground w-10"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.results.map((dept) => (
                        <TableRow key={dept.id} className="border-border">
                            <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                                {dept.id}
                            </TableCell>
                            <TableCell className="text-foreground font-medium">{dept.name}</TableCell>
                            <TableCell className="text-muted-foreground">{dept.description || '—'}</TableCell>
                            <TableCell>
                                <div
                                    className={`h-2 w-2 rounded-full ${dept.status ? 'bg-success' : 'bg-muted-foreground'
                                        }`}
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(dept)}
                                >
                                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {data?.results.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                Nenhum departamento encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
