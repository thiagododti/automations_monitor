import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentsApi } from '@/api/departments';
import type { DepartmentFilters, DepartmentCreate, DepartmentUpdate } from '@/types/department';

export function useDepartments(filters?: DepartmentFilters, page = 1) {
  return useQuery({
    queryKey: ['departments', filters, page],
    queryFn: () => departmentsApi.list({ ...filters, page }).then((res) => res.data),
  });
}

export function useDepartment(id: number) {
  return useQuery({
    queryKey: ['departments', id],
    queryFn: () => departmentsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DepartmentCreate) => departmentsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DepartmentUpdate }) => departmentsApi.patch(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useDepartmentOptions(enabled: boolean) {
  return useQuery({
    queryKey: ['departmentOptions'],
    queryFn: () => departmentsApi.getOptions().then((res) => res.data),
    enabled
  });
}
