import { useState } from 'react';
import { useTableState } from '@/hooks/useTableState';
import { useDepartments } from '@/hooks/useDepartments';
import type { DepartmentFilters, Department } from '@/types/department';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { FilterBar, type FilterField } from '@/components/shared/FilterBar';
import { DepartmentDialog } from '@/components/features/departments/DepartmentDialog';
import { DepartmentTable } from '@/components/features/departments/DepartmentTable';

const filterFields: FilterField[] = [
  { key: 'name', label: 'Nome', type: 'text', placeholder: 'Buscar por nome' },
  { key: 'description', label: 'Descrição', type: 'text', placeholder: 'Buscar por descrição' },
];

export default function DepartmentsPage() {
  const { filters, page, setPage, handleFilter, handleClear } = useTableState<DepartmentFilters>();
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const { data, isLoading } = useDepartments(filters, page);

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
  };

  const handleDialogSuccess = () => {
    setEditingDepartment(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Departamentos</h1>
          <p className="text-sm text-muted-foreground">Gerenciar departamentos</p>
        </div>
        <DepartmentDialog editData={editingDepartment || undefined} onSuccess={handleDialogSuccess} onClose={() => setEditingDepartment(null)} />
      </div>

      <FilterBar
        fields={filterFields}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      <DepartmentTable data={data} isLoading={isLoading} onEdit={handleEditDepartment} />

      {data && (
        <div className="px-4">
          <PaginationControls count={data.count} page={page} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
