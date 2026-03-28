import { useState } from 'react';
import { useTableState } from '@/shared/hooks/useTableState';
import { usePositions, usePositionNivels } from '@/features/positions/hooks';
import type { PositionFilters, Position } from '@/features/positions/types';
import { PaginationControls } from '@/shared/components/PaginationControls';
import { FilterBar } from '@/shared/components/FilterBar';
import type { FilterField } from '@/shared/types/filters';
import { PositionDialog } from '@/features/positions/components/PositionDialog';
import { PositionTable } from '@/features/positions/components/PositionTable';
import { positionNameFilter, positionDescriptionFilter } from '@/features/positions';

export default function PositionsPage() {
    const { filters, page, setPage, handleFilter, handleClear } = useTableState<PositionFilters>();
    const [editingPosition, setEditingPosition] = useState<Position | null>(null);

    const { data, isLoading } = usePositions(filters, page);
    const { data: nivels } = usePositionNivels(true);

    const filterFields: FilterField[] = [
        positionNameFilter,
        positionDescriptionFilter,
        {
            key: 'nivel',
            label: 'Nível',
            type: 'select',
            placeholder: 'Todos',
            options: (nivels || []).map((nivel) => ({ label: nivel.display, value: nivel.value })),
        },
    ];

    const handleEditPosition = (position: Position) => {
        setEditingPosition(position);
    };

    const handleDialogSuccess = () => {
        setEditingPosition(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">Cargos</h1>
                    <p className="text-sm text-muted-foreground">Gerenciar cargos do sistema</p>
                </div>
                <PositionDialog editData={editingPosition || undefined} onSuccess={handleDialogSuccess} onClose={() => setEditingPosition(null)} />
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={handleFilter}
                onClear={handleClear}
            />

            <PositionTable data={data} isLoading={isLoading} onEdit={handleEditPosition} />

            {data && (
                <div className="px-4">
                    <PaginationControls count={data.count} page={page} onPageChange={setPage} />
                </div>
            )}
        </div>
    );
}
