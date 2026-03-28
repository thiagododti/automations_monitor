import { useState, useEffect } from 'react';

export function useTableState<TFilters extends Record<string, unknown>>() {
    const [filters, setFilters] = useState<TFilters>({} as TFilters);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [filters]);

    const handleFilter = (v: Record<string, string>) => {
        setFilters(v as unknown as TFilters);
    };

    const handleClear = () => {
        setFilters({} as TFilters);
    };

    return { filters, page, setPage, handleFilter, handleClear };
}
