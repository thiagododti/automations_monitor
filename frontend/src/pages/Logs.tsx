import { useTableState } from '@/shared/hooks/useTableState';
import { useLogs } from '@/features/logs/hooks';
import type { LogFilters } from '@/features/logs/types';
import { PaginationControls } from '@/shared/components/PaginationControls';
import { FilterBar } from '@/shared/components/FilterBar';
import { LogTable } from '@/features/logs/components/LogTable';
import { logExecutionIdFilter, logDescriptionFilter, logCreatedAtFilter } from '@/features/logs';

const filterFields = [
  logExecutionIdFilter,
  logDescriptionFilter,
  logCreatedAtFilter,
];

export default function LogsPage() {
  const { filters, page, setPage, handleFilter, handleClear } = useTableState<LogFilters>();
  const { data, isLoading } = useLogs(filters, page);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Logs</h1>
        <p className="text-sm text-muted-foreground">Registros de log das execuções</p>
      </div>

      <FilterBar
        fields={filterFields}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      <LogTable data={data} isLoading={isLoading} />

      {data && (
        <div className="px-4">
          <PaginationControls count={data.count} page={page} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
