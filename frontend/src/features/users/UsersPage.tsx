import { useCallback, useEffect, useState } from "react";
import type { CreateUserPayload, PaginatedResponse, UpdateUserPayload, User } from "@/types/api";
import { httpClient } from "@/services/httpClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserStatusBadge } from "./components/UserStatusBadge";
import { UserFormDialog } from "./components/UserFormDialog";
import { format } from "date-fns";

export function UsersPage() {
  const [data, setData] = useState<PaginatedResponse<User> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await httpClient<PaginatedResponse<User>>(`/users/?page=${p}`);
      setData(res);
    } catch {
      // handled by httpClient
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(page);
  }, [page, fetchUsers]);

  const handleCreate = async (payload: CreateUserPayload | UpdateUserPayload) => {
    await httpClient("/users/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    fetchUsers(page);
  };

  const handleUpdate = async (payload: CreateUserPayload | UpdateUserPayload) => {
    if (!editingUser) return;
    await httpClient(`/users/${editingUser.id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    fetchUsers(page);
  };

  const openCreate = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Usuários</CardTitle>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {data?.count ?? 0} registros
            </span>
            <Button variant="secondary" size="sm" onClick={openCreate}>
              Criar Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Sobrenome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <span className="font-mono text-sm text-muted-foreground">
                      Carregando...
                    </span>
                  </TableCell>
                </TableRow>
              ) : !data?.results.length ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <span className="font-mono text-sm text-muted-foreground">
                      Nenhum usuário encontrado.
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                data.results.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => openEdit(user)}
                  >
                    <TableCell>
                      <Avatar className="h-8 w-8 rounded-md">
                        <AvatarImage src={user.photo ?? undefined} className="rounded-md" />
                        <AvatarFallback className="rounded-md font-mono text-xs">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{user.first_name}</TableCell>
                    <TableCell className="font-mono text-sm">{user.last_name}</TableCell>
                    <TableCell className="font-mono text-sm">{user.email}</TableCell>
                    <TableCell>
                      <UserStatusBadge
                        isActive={user.is_active}
                        isStaff={user.is_staff}
                        isSuperuser={user.is_superuser}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatDate(user.date_joined)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(user);
                        }}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {data && (data.next || data.previous) && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <Button
                variant="ghost"
                size="sm"
                disabled={!data.previous}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <span className="font-mono text-xs text-muted-foreground">
                Página {page}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={!data.next}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        onSubmit={editingUser ? handleUpdate : handleCreate}
      />
    </div>
  );
}
