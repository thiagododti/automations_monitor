import api from '@/lib/axios';
import type { Step, StepCreate, StepFilters } from './types';
import type { PaginatedResponse } from '@/types/api';

export const stepsApi = {
    list: (filters?: StepFilters & { page?: number }) =>
        api.get<PaginatedResponse<Step>>('/api/executions/steps/', { params: filters }),

    getById: (id: number) =>
        api.get<Step>(`/api/executions/steps/${id}/`),

    create: (data: StepCreate) =>
        api.post<Step>('/api/executions/steps/', data),
};
