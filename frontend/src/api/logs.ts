import api from '@/lib/axios';
import type { Log, LogCreate, LogFilters } from '@/types/log';
import type { PaginatedResponse } from '@/types/api';

export const logsApi = {
  list: (filters?: LogFilters & { page?: number }) =>
    api.get<PaginatedResponse<Log>>('/api/executions/logs/', { params: filters }),

  getById: (id: number) =>
    api.get<Log>(`/api/executions/logs/${id}/`),

  create: (data: LogCreate) =>
    api.post<Log>('/api/executions/logs/', data),
};
