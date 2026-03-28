import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logsApi } from './api';
import { queryKeys } from '@/lib/queryKeys';
import type { LogFilters, LogCreate } from './types';

export function useLogs(filters?: LogFilters, page = 1) {
    return useQuery({
        queryKey: queryKeys.logs.list(filters, page),
        queryFn: () => logsApi.list({ ...filters, page }).then((res) => res.data),
    });
}

export function useLog(id: number) {
    return useQuery({
        queryKey: queryKeys.logs.detail(id),
        queryFn: () => logsApi.getById(id).then((res) => res.data),
        enabled: !!id,
    });
}

export function useCreateLog() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: LogCreate) => logsApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.logs.all() }),
    });
}

/** Logs filtrados por execução, com query key própria para evitar colisão com useLogs. */
export function useExecutionLogs(executionId: number, page = 1) {
    return useQuery({
        queryKey: queryKeys.executions.logs(executionId, page),
        queryFn: () =>
            logsApi.list({ execution: String(executionId), page }).then((res) => res.data),
        enabled: !!executionId,
    });
}
