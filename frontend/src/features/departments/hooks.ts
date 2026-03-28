import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentsApi } from './api';
import { queryKeys } from '@/lib/queryKeys';
import type { DepartmentFilters, DepartmentCreate, DepartmentUpdate } from './types';

export { useDepartmentForm } from './hooks/useDepartmentForm';
export type { DepartmentFormData, DepartmentEditData } from './hooks/useDepartmentForm';

// ─── Query hooks ──────────────────────────────────────────────────────────────

export function useDepartments(filters?: DepartmentFilters, page = 1) {
    return useQuery({
        queryKey: queryKeys.departments.list(filters, page),
        queryFn: () => departmentsApi.list({ ...filters, page }).then((res) => res.data),
    });
}

export function useDepartment(id: number) {
    return useQuery({
        queryKey: queryKeys.departments.detail(id),
        queryFn: () => departmentsApi.getById(id).then((res) => res.data),
        enabled: !!id,
    });
}

export function useCreateDepartment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: DepartmentCreate) => departmentsApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.departments.all() }),
    });
}

export function useUpdateDepartment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: DepartmentUpdate }) =>
            departmentsApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.departments.all() }),
    });
}

export function useDepartmentOptions(enabled: boolean) {
    return useQuery({
        queryKey: queryKeys.departments.options(),
        queryFn: () => departmentsApi.getOptions().then((res) => res.data),
        enabled,
    });
}
