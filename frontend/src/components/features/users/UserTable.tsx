import { Pencil, Loader2, ShieldCheck, Crown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { UserTokenDialog } from '@/components/features/users/UserTokenDialog';
import type { User } from '@/types/user';

interface UserTableProps {
    data: {
        results: User[];
        count: number;
    } | undefined;
    isLoading: boolean;
    onEdit: (user: User) => void;
}

function getInitials(firstName: string, lastName: string, username: string): string {
    if (firstName || lastName) {
        return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
}

export function UserTable({ data, isLoading, onEdit }: UserTableProps) {
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
                        <TableHead className="text-muted-foreground">Usuário</TableHead>
                        <TableHead className="text-muted-foreground">Departamento</TableHead>
                        <TableHead className="text-muted-foreground">Telefone</TableHead>
                        <TableHead className="text-muted-foreground">Permissões</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground w-10"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.results.map((user) => (
                        <TableRow key={user.id} className="border-border">

                            {/* Avatar + username + email */}
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 shrink-0">
                                        <AvatarImage src={user.photo ?? undefined} />
                                        <AvatarFallback className="bg-secondary text-xs font-medium text-foreground">
                                            {getInitials(user.first_name, user.last_name, user.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {user.first_name || user.last_name
                                                ? `${user.first_name} ${user.last_name}`.trim()
                                                : user.username}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            @{user.username}
                                            {user.email && ` · ${user.email}`}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>

                            {/* Departamento */}
                            <TableCell className="text-sm text-muted-foreground">
                                {user.department_data?.name || '—'}
                            </TableCell>

                            {/* Telefone */}
                            <TableCell className="text-sm text-muted-foreground">
                                {user.telephone || '—'}
                            </TableCell>

                            {/* Permissões */}
                            <TableCell>
                                <div className="flex items-center gap-1.5">
                                    {user.is_superuser && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                                            <Crown className="h-3 w-3" />
                                            Super
                                        </span>
                                    )}
                                    {user.is_staff && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                                            <ShieldCheck className="h-3 w-3" />
                                            Staff
                                        </span>
                                    )}
                                    {!user.is_superuser && !user.is_staff && (
                                        <span className="text-xs text-muted-foreground">—</span>
                                    )}
                                </div>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                                <span className={cn(
                                    'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                                    user.is_active
                                        ? 'bg-success/15 text-success'
                                        : 'bg-muted text-muted-foreground'
                                )}>
                                    {user.is_active ? 'Ativo' : 'Inativo'}
                                </span>
                            </TableCell>

                            {/* Ações */}
                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    <UserTokenDialog user={user} />
                                    <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {data?.results.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                Nenhum usuário encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
