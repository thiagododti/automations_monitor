import { useState, useEffect } from 'react';
import { useSteps } from '@/hooks/useSteps';
import type { StepFilters } from '@/types/step';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { FilterBar, type FilterField } from '@/components/shared/FilterBar';
import { StepTable } from '@/components/features/steps/StepTable';

const filterFields: FilterField[] = [
  { key: 'execution', label: 'Execução (ID)', type: 'text', placeholder: 'ID da execução' },
  { key: 'identification', label: 'Identificação', type: 'text', placeholder: 'Buscar por identificação' },
  {
    key: 'status', label: 'Status', type: 'select', options: [
      { label: 'Iniciado', value: 'iniciado' },
      { label: 'Concluído', value: 'concluido' },
      { label: 'Erro', value: 'erro' },
      { label: 'Alerta', value: 'alerta' },
    ]
  },
  { key: 'date_start', label: 'Data Início', type: 'date' },
];

export default function StepsPage() {
  const [filters, setFilters] = useState<StepFilters>({});
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSteps(filters, page);

  useEffect(() => { setPage(1); }, [filters]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Steps</h1>
        <p className="text-sm text-muted-foreground">Passos de execução das automações</p>
      </div>

      <FilterBar
        fields={filterFields}
        onFilter={(v) => setFilters(v as StepFilters)}
        onClear={() => setFilters({})}
      />

      <StepTable data={data} isLoading={isLoading} />

      {data && (
        <div className="px-4">
          <PaginationControls count={data.count} page={page} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
