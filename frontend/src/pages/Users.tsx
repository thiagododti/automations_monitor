import { useState, useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';
import type { UserFilters, User } from '@/types/user';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { FilterBar, type FilterField } from '@/components/shared/FilterBar';
import { UserDialog } from '@/components/features/users/UserDialog';
import { UserTable } from '@/components/features/users/UserTable';

const filterFields: FilterField[] = [
  { key: 'username', label: 'Usuário', type: 'text', placeholder: 'Buscar por usuário' },
  { key: 'email', label: 'Email', type: 'text', placeholder: 'Buscar por email' },
  { key: 'first_name', label: 'Nome', type: 'text', placeholder: 'Buscar por nome' },
  { key: 'last_name', label: 'Sobrenome', type: 'text', placeholder: 'Buscar por sobrenome' },
];

export default function UsersPage() {
  const [filters, setFilters] = useState<UserFilters>({});
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data, isLoading } = useUsers(filters, page);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleDialogSuccess = () => {
    setEditingUser(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Usuários</h1>
          <p className="text-sm text-muted-foreground">Gerenciar usuários do sistema</p>
        </div>
        <UserDialog editData={editingUser || undefined} onSuccess={handleDialogSuccess} onClose={() => setEditingUser(null)} />
      </div>

      <FilterBar
        fields={filterFields}
        onFilter={(v) => setFilters(v as UserFilters)}
        onClear={() => setFilters({})}
      />

      <UserTable data={data} isLoading={isLoading} onEdit={handleEditUser} />

      {data && (
        <div className="px-4">
          <PaginationControls count={data.count} page={page} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
