import { useTableState } from '@/shared/hooks/useTableState';
import { useExecutions } from '@/features/executions/hooks';
import type { ExecutionFilters } from '@/features/executions/types';
import { PaginationControls } from '@/shared/components/PaginationControls';
import { FilterBar } from '@/shared/components/FilterBar';
import { ExecutionTable } from '@/features/executions/components/ExecutionTable';
import { executionAutomationFilter, executionDateStartFilter, executionStatusFilter } from '@/features/executions';

const filterFields = [
  executionAutomationFilter,
  executionDateStartFilter,
  executionStatusFilter,
];

export default function ExecutionsPage() {
  const { filters, page, setPage, handleFilter, handleClear } = useTableState<ExecutionFilters>();
  const { data, isLoading } = useExecutions(filters, page);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Execuções</h1>
        <p className="text-sm text-muted-foreground">Histórico de execuções das automações</p>
      </div>

      <FilterBar
        fields={filterFields}
        onFilter={handleFilter}
        onClear={handleClear}
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
