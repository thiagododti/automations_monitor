import api from '@/lib/axios';
import type { Automation, AutomationCreate, AutomationUpdate, AutomationFilters, AutomationsStatus } from './types';
import type { PaginatedResponse } from '@/types/api';

export const automationsApi = {
    list: (filters?: AutomationFilters & { page?: number }) =>
        api.get<PaginatedResponse<Automation>>('/api/automations/', { params: filters }),

    getById: (id: number) =>
        api.get<Automation>(`/api/automations/${id}/`),

    create: (data: AutomationCreate) =>
        api.post<Automation>('/api/automations/', data),

    patch: (id: number, data: AutomationUpdate) =>
        api.patch<Automation>(`/api/automations/${id}/`, data),

    getStatus: () =>
        api.get<AutomationsStatus[]>('/api/automations/status/'),
};
