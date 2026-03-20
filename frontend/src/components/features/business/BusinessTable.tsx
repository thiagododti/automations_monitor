import { Loader2, Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Business } from '@/types/business';

interface BusinessTableProps {
    data:
    | {
        results: Business[];
        count: number;
    }
    | undefined;
    isLoading: boolean;
    onEdit: (business: Business) => void;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function parseCertificateDate(dateValue: string): Date | null {
    if (!dateValue) {
        return null;
    }

    const normalizedDate = dateValue.includes('T') ? dateValue.split('T')[0] : dateValue;
    const parsedDate = new Date(`${normalizedDate}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return parsedDate;
}

function formatDate(dateValue: string): string {
    if (!dateValue) {
        return 'Nao informado';
    }

    const parsedDate = parseCertificateDate(dateValue);

    if (!parsedDate) {
        return 'Data invalida';
    }

    return parsedDate.toLocaleDateString('pt-BR');
}

function getCertificateStatus(dateValue: string): {
    label: string;
    className: string;
} {
    if (!dateValue) {
        return {
            label: 'Sem validade',
            className: 'border-border text-muted-foreground',
        };
    }

    const expirationDate = parseCertificateDate(dateValue);

    if (!expirationDate) {
        return {
            label: 'Data invalida',
            className: 'border-border text-muted-foreground',
        };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffInMs = expirationDate.getTime() - today.getTime();
    const daysUntilExpiration = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (daysUntilExpiration < 0) {
        return {
            label: 'Expirado',
            className: 'border-destructive/30 bg-destructive/10 text-destructive',
        };
    }

    if (daysUntilExpiration <= 30) {
        return {
            label: `Vence em ${daysUntilExpiration}d`,
            className: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
        };
    }

    return {
        label: 'Em dia',
        className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
    };
}

export function BusinessTable({ data, isLoading, onEdit }: BusinessTableProps) {
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
                        <TableHead className="text-muted-foreground">Empresa</TableHead>
                        <TableHead className="text-muted-foreground">CNPJ</TableHead>
                        <TableHead className="text-muted-foreground">Subject CN</TableHead>
                        <TableHead className="text-muted-foreground">Validade Certificado</TableHead>
                        <TableHead className="text-muted-foreground">Descrição</TableHead>
                        <TableHead className="text-muted-foreground w-10"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.results.map((business) => {
                        const certificateStatus = getCertificateStatus(business.certificate_expire);

                        return (
                            <TableRow key={business.id} className="border-border">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 shrink-0">
                                            <AvatarImage src={business.logo || undefined} />
                                            <AvatarFallback className="bg-secondary text-xs font-medium text-foreground">
                                                {getInitials(business.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{business.name}</p>
                                            <p className="text-xs text-muted-foreground">ID {business.id}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                                    {business.cnpj}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {business.subject_cn || '—'}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground">{formatDate(business.certificate_expire)}</span>
                                        <Badge variant="outline" className={certificateStatus.className}>
                                            {certificateStatus.label}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {business.description || '—'}
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" onClick={() => onEdit(business)}>
                                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {data?.results.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                Nenhuma empresa encontrada.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}