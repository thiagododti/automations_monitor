import { useTableState } from '@/hooks/useTableState';
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
