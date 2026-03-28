import { useMemo, useState } from 'react';
import { KeyRound, Loader2, Copy, RefreshCcw, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useCreateToken, useRegenerateToken, useToken } from '../hooks';
import { useAuth } from '@/features/auth/hooks';
import type { User } from '../types';

interface UserTokenDialogProps {
    user: User;
}

function formatDate(dateString: string) {
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(dateString));
}

export function UserTokenDialog({ user }: UserTokenDialogProps) {
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { user: authenticatedUser } = useAuth();
    const tokenQuery = useToken(user.id, open);
    const createToken = useCreateToken();
    const regenerateToken = useRegenerateToken();

    const token = tokenQuery.data;
    const canManageToken = !!authenticatedUser?.is_staff;
    const isMutating = createToken.isPending || regenerateToken.isPending;

    const dialogTitle = useMemo(() => {
        const fullName = `${user.first_name} ${user.last_name}`.trim();
        return fullName || user.username;
    }, [user.first_name, user.last_name, user.username]);

    const handleCreateToken = async () => {
        setErrorMessage(null);
        try {
            await createToken.mutateAsync({ user_id: user.id });
        } catch {
            setErrorMessage('Nao foi possivel criar o token deste usuario.');
        }
    };

    const handleRegenerateToken = async () => {
        setErrorMessage(null);
        try {
            await regenerateToken.mutateAsync({ user_id: user.id });
        } catch {
            setErrorMessage('Nao foi possivel regenerar o token deste usuario.');
        }
    };

    const handleCopy = async () => {
        if (!token?.key) return;
        setErrorMessage(null);

        try {
            await navigator.clipboard.writeText(token.key);
        } catch {
            setErrorMessage('Nao foi possivel copiar o token.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-primary" />
                        Token de API
                    </DialogTitle>
                    <DialogDescription>
                        Usuario: <span className="font-medium text-foreground">{dialogTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {tokenQuery.isLoading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando token...
                        </div>
                    )}

                    {!tokenQuery.isLoading && token && (
                        <div className="space-y-2 rounded-md border border-border bg-secondary/40 p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Token atual</p>
                            <p className="break-all rounded bg-background px-2 py-1 font-mono text-xs text-foreground">
                                {token.key}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Criado em: {formatDate(token.created)}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                className="mt-1"
                            >
                                <Copy className="h-4 w-4" />
                                Copiar token
                            </Button>
                        </div>
                    )}

                    {!tokenQuery.isLoading && !token && (
                        <div className="rounded-md border border-dashed border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
                            Nenhum token encontrado para este usuario.
                        </div>
                    )}

                    {!canManageToken && (
                        <p className="text-xs text-muted-foreground">
                            O usuario autenticado nao possui permissao staff. Criacao e regeneracao de token estao bloqueadas.
                        </p>
                    )}

                    {canManageToken && (
                        <div className="flex items-center justify-end gap-2">
                            {!token ? (
                                <Button onClick={handleCreateToken} disabled={isMutating || tokenQuery.isLoading}>
                                    {createToken.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {!createToken.isPending && <PlusCircle className="h-4 w-4" />}
                                    Criar token
                                </Button>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button disabled={isMutating || tokenQuery.isLoading}>
                                            {regenerateToken.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                            {!regenerateToken.isPending && <RefreshCcw className="h-4 w-4" />}
                                            Gerar novo token
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Confirmar geração do novo token</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Se você continuar, será gerado um novo token para este usuário,
                                                e isso pode afetar a autenticação de todas as automações que utilizam
                                                o token atual. Ao prosseguir, será necessário atualizar o
                                                token das automações que ainda estiverem com o token antigo.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleRegenerateToken}
                                                disabled={isMutating || tokenQuery.isLoading}
                                            >
                                                Confirmar e gerar novo token
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    )}

                    {tokenQuery.isError && (
                        <p className="text-sm text-destructive">
                            Ocorreu um erro ao buscar o token deste usuario.
                        </p>
                    )}

                    {errorMessage && (
                        <p className="text-sm text-destructive">{errorMessage}</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
