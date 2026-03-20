import api from '@/lib/axios';
import type { User, UserCreate, UserUpdate, UserFilters } from '@/types/user';
import type { PaginatedResponse } from '@/types/api';

function buildFormData(data: UserCreate | UserUpdate): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value instanceof File ? value : String(value));
    }
  });
  return formData;
}

export const usersApi = {
  list: (filters?: UserFilters & { page?: number }) =>
    api.get<PaginatedResponse<User>>('/api/users/', { params: filters }),

  getById: (id: number) =>
    api.get<User>(`/api/users/${id}/`),

  create: (data: UserCreate) =>
    api.post<User>('/api/users/', buildFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  patch: (id: number, data: UserUpdate) =>
    api.patch<User>(`/api/users/${id}/`, buildFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
