import api from '@/lib/axios';
import type { Execution, ExecutionCreate, ExecutionUpdate, ExecutionFilters } from '@/types/execution';
import type { PaginatedResponse } from '@/types/api';

export const executionsApi = {
  list: (filters?: ExecutionFilters & { page?: number }) =>
    api.get<PaginatedResponse<Execution>>('/api/executions/', { params: filters }),

  getById: (id: number) =>
    api.get<Execution>(`/api/executions/${id}/`),

  create: (data: ExecutionCreate) =>
    api.post<Execution>('/api/executions/', data),

  patch: (id: number, data: ExecutionUpdate) =>
    api.patch<Execution>(`/api/executions/${id}/`, data),
};
