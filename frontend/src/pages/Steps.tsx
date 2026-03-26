import { useState, useEffect } from 'react';
import { useSteps } from '@/hooks/useSteps';
import type { StepFilters } from '@/types/step';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { FilterBar, type FilterField } from '@/components/shared/FilterBar';
import { StepTable } from '@/components/features/steps/StepTable';
import { DateStartFilter, ExecutionIdFilter, StatusFilters, StepIdentificationFilter } from '@/filters/filters';

const filterFields: FilterField[] = [
  ExecutionIdFilter,
  StepIdentificationFilter,
  StatusFilters,
  DateStartFilter,
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
