import { useState } from 'react';
import { useTableState } from '@/shared/hooks/useTableState';
import { useDepartments } from '@/features/departments/hooks';
import type { DepartmentFilters, Department } from '@/features/departments/types';
import { PaginationControls } from '@/shared/components/PaginationControls';
import { FilterBar } from '@/shared/components/FilterBar';
import { DepartmentDialog } from '@/features/departments/components/DepartmentDialog';
import { DepartmentTable } from '@/features/departments/components/DepartmentTable';
import { departmentNameFilter, departmentDescriptionFilter } from '@/features/departments';

const filterFields = [
  departmentNameFilter,
  departmentDescriptionFilter,
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
