import { useState } from 'react';
import { useTableState } from '@/shared/hooks/useTableState';
import { useAutomations } from '@/features/automations/hooks';
import { useAuth } from '@/features/auth/hooks';
import type { AutomationFilters, Automation } from '@/features/automations/types';
import { PaginationControls } from '@/shared/components/PaginationControls';
import { FilterBar } from '@/shared/components/FilterBar';
import { AutomationDialog } from '@/features/automations/components/AutomationDialog';
import { AutomationTable } from '@/features/automations/components/AutomationTable';
import { automationNameFilter, automationIsActiveFilter } from '@/features/automations';

const filterFields = [
  automationNameFilter,
  automationIsActiveFilter,
];

export default function AutomationsPage() {
  const { user } = useAuth();
  const isStaff = user?.is_staff === true;
  const { filters, page, setPage, handleFilter, handleClear } = useTableState<AutomationFilters>();
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);

  const { data, isLoading } = useAutomations(filters, page);

  const handleEditAutomation = (automation: Automation) => {
    setEditingAutomation(automation);
  };

  const handleDialogSuccess = () => {
    setEditingAutomation(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Automações</h1>
          <p className="text-sm text-muted-foreground">Gerenciar automações do sistema</p>
        </div>
        <AutomationDialog
          editData={editingAutomation || undefined}
          onSuccess={handleDialogSuccess}
          onClose={() => setEditingAutomation(null)}
        />
      </div>

      <FilterBar
        fields={filterFields}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      <AutomationTable data={data} isLoading={isLoading} isStaff={isStaff} onEdit={handleEditAutomation} />

      {data && (
        <div className="px-4">
          <PaginationControls count={data.count} page={page} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
