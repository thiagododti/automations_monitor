import { useEffect, useState } from 'react';
import { useBusinesses } from '@/hooks/useBusiness';
import type { Business, BusinessFilters } from '@/types/business';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { FilterBar, type FilterField } from '@/components/shared/FilterBar';
import { BusinessDialog } from '@/components/features/business/BusinessDialog';
import { BusinessTable } from '@/components/features/business/BusinessTable';
import { CNPJFilter, DescriptionFilter, NameFilter } from '@/filters/filters';

const filterFields: FilterField[] = [
    NameFilter,
    DescriptionFilter,
    CNPJFilter,
];

export default function BusinessesPage() {
    const [filters, setFilters] = useState<BusinessFilters>({});
    const [page, setPage] = useState(1);
    const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

    const { data, isLoading } = useBusinesses(filters, page);

    useEffect(() => {
        setPage(1);
    }, [filters]);

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
                onFilter={(v) => setFilters(v as BusinessFilters)}
                onClear={() => setFilters({})}
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