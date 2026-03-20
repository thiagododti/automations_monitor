import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logsApi } from '@/api/logs';
import type { LogFilters, LogCreate } from '@/types/log';

export function useLogs(filters?: LogFilters, page = 1) {
  return useQuery({
    queryKey: ['logs', filters, page],
    queryFn: () => logsApi.list({ ...filters, page }).then((res) => res.data),
  });
}

export function useLog(id: number) {
  return useQuery({
    queryKey: ['logs', id],
    queryFn: () => logsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LogCreate) => logsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['logs'] }),
  });
}
