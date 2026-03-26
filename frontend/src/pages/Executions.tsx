import { useState, useEffect } from 'react';
import { useExecutions } from '@/hooks/useExecutions';
import type { ExecutionFilters } from '@/types/execution';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { FilterBar, type FilterField } from '@/components/shared/FilterBar';
import { ExecutionTable } from '@/components/features/executions/ExecutionTable';
import { AutomationNameFilter, DateStartFilter, StatusFilters } from '@/filters/filters';

const filterFields: FilterField[] = [
  AutomationNameFilter,
  DateStartFilter,
  StatusFilters,

];

export default function ExecutionsPage() {
  const [filters, setFilters] = useState<ExecutionFilters>({});
  const [page, setPage] = useState(1);
  const { data, isLoading } = useExecutions(filters, page);

  useEffect(() => { setPage(1); }, [filters]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Execuções</h1>
        <p className="text-sm text-muted-foreground">Histórico de execuções das automações</p>
      </div>

      <FilterBar
        fields={filterFields}
        onFilter={(v) => setFilters(v as ExecutionFilters)}
        onClear={() => setFilters({})}
      />

      <ExecutionTable data={data} isLoading={isLoading} />

      {data && (
        <div className="px-4">
          <PaginationControls count={data.count} page={page} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
