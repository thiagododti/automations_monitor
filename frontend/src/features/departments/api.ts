import api from "@/lib/axios";
import type { Department, DepartmentCreate, DepartmentUpdate, DepartmentFilters, DepartmentOption } from "./types";
import type { PaginatedResponse } from "@/shared/types/api";

export const departmentsApi = {
    list: (filters?: DepartmentFilters & { page?: number }) =>
        api.get<PaginatedResponse<Department>>("/api/departments/", { params: filters }),

    getById: (id: number) => api.get<Department>(`/api/departments/${id}/`),

    create: (data: DepartmentCreate) =>
        api.post<Department>("/api/departments/", data),

    patch: (id: number, data: DepartmentUpdate) =>
        api.patch<Department>(`/api/departments/${id}/`, data),

    getOptions: () => api.get<DepartmentOption[]>("/api/departments/options/"),
};
