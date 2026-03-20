import { useState, useEffect } from 'react';
import { useAutomations } from '@/hooks/useAutomations';
import type { AutomationFilters, Automation } from '@/types/automation';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { FilterBar, type FilterField } from '@/components/shared/FilterBar';
import { AutomationDialog } from '@/components/features/automations/AutomationDialog';
import { AutomationTable } from '@/components/features/automations/AutomationTable';

const filterFields: FilterField[] = [
  { key: 'name', label: 'Nome', type: 'text', placeholder: 'Buscar por nome' },
  { key: 'is_active', label: 'Status', type: 'select', options: [{ label: 'Ativo', value: 'true' }, { label: 'Inativo', value: 'false' }] },
];

export default function AutomationsPage() {
  const [filters, setFilters] = useState<AutomationFilters>({});
  const [page, setPage] = useState(1);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);

  const { data, isLoading } = useAutomations(filters, page);

  useEffect(() => {
    setPage(1);
  }, [filters]);

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
        onFilter={(v) => setFilters(v as AutomationFilters)}
        onClear={() => setFilters({})}
      />

      <AutomationTable data={data} isLoading={isLoading} onEdit={handleEditAutomation} />

      {data && (
        <div className="px-4">
          <PaginationControls count={data.count} page={page} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
