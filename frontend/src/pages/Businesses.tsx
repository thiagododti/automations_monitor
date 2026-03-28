import { useState } from 'react';
import { useTableState } from '@/shared/hooks/useTableState';
import { useBusinesses } from '@/features/business/hooks';
import type { Business, BusinessFilters } from '@/features/business/types';
import { PaginationControls } from '@/shared/components/PaginationControls';
import { FilterBar } from '@/shared/components/FilterBar';
import { BusinessDialog } from '@/features/business/components/BusinessDialog';
import { BusinessTable } from '@/features/business/components/BusinessTable';
import { businessNameFilter, businessDescriptionFilter, businessCnpjFilter } from '@/features/business';

const filterFields = [
    businessNameFilter,
    businessDescriptionFilter,
    businessCnpjFilter,
];

export default function BusinessesPage() {
    const { filters, page, setPage, handleFilter, handleClear } = useTableState<BusinessFilters>();
    const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

    const { data, isLoading } = useBusinesses(filters, page);

    const handleEditBusiness = (business: Business) => {
        setEditingBusiness(business);
    };

    const handleDialogSuccess = () => {
        setEditingBusiness(null);
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">Empresas</h1>
                    <p className="text-sm text-muted-foreground">Gerenciar empresas cadastradas</p>
                </div>
                <BusinessDialog
                    editData={editingBusiness || undefined}
                    onSuccess={handleDialogSuccess}
                    onClose={() => setEditingBusiness(null)}
                />
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={handleFilter}
                onClear={handleClear}
            />

            <BusinessTable data={data} isLoading={isLoading} onEdit={handleEditBusiness} />

            {data && (
                <div className="px-4">
                    <PaginationControls count={data.count} page={page} onPageChange={setPage} />
                </div>
            )}
        </div>
    );
}