import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { executionsApi } from '@/api/executions';
import type { ExecutionFilters, ExecutionCreate, ExecutionUpdate } from '@/types/execution';

export function useExecutions(filters?: ExecutionFilters, page = 1) {
  return useQuery({
    queryKey: ['executions', filters, page],
    queryFn: () => executionsApi.list({ ...filters, page }).then((res) => res.data),
  });
}

export function useExecution(id: number) {
  return useQuery({
    queryKey: ['executions', id],
    queryFn: () => executionsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateExecution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ExecutionCreate) => executionsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['executions'] }),
  });
}

export function useUpdateExecution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ExecutionUpdate }) => executionsApi.patch(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['executions'] }),
  });
}
