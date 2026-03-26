import { useState, useEffect } from 'react';
import { usePositions, usePositionNivels } from '@/hooks/usePositions';
import type { PositionFilters, Position } from '@/types/position';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { FilterBar, type FilterField } from '@/components/shared/FilterBar';
import { PositionDialog } from '@/components/features/positions/PositionDialog';
import { PositionTable } from '@/components/features/positions/PositionTable';
import { DescriptionFilter, NameFilter, PositionNivelsFilter } from '@/filters/filters';

export default function PositionsPage() {
    const [filters, setFilters] = useState<PositionFilters>({});
    const [page, setPage] = useState(1);
    const [editingPosition, setEditingPosition] = useState<Position | null>(null);

    const { data, isLoading } = usePositions(filters, page);
    const { data: nivels } = usePositionNivels(true);

    const filterFields: FilterField[] = [
        NameFilter,
        DescriptionFilter,
        {
            key: 'nivel',
            label: 'Nível',
            type: 'select',
            placeholder: 'Todos',
            options: (nivels || []).map((nivel) => ({ label: nivel.display, value: nivel.value })),
        },
    ];

    useEffect(() => {
        setPage(1);
    }, [filters]);

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
                onFilter={(v) => setFilters(v as PositionFilters)}
                onClear={() => setFilters({})}
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
