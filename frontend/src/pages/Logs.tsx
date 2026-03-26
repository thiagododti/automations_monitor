import { useState, useEffect } from 'react';
import { useLogs } from '@/hooks/useLogs';
import type { LogFilters } from '@/types/log';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { FilterBar, type FilterField } from '@/components/shared/FilterBar';
import { LogTable } from '@/components/features/Logs_page/LogTable';
import { CreatedAtFilter, DescriptionFilter, ExecutionIdFilter } from '@/filters/filters';

const filterFields: FilterField[] = [
  ExecutionIdFilter,
  DescriptionFilter,
  CreatedAtFilter,
];

export default function LogsPage() {
  const [filters, setFilters] = useState<LogFilters>({});
  const [page, setPage] = useState(1);
  const { data, isLoading } = useLogs(filters, page);

  useEffect(() => { setPage(1); }, [filters]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Logs</h1>
        <p className="text-sm text-muted-foreground">Registros de log das execuções</p>
      </div>

      <FilterBar
        fields={filterFields}
        onFilter={(v) => setFilters(v as LogFilters)}
        onClear={() => setFilters({})}
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
