import api from "@/lib/axios";
import type { Business, BusinessCreate, BusinessUpdate, BusinessFilters, BusinessOption } from "./types";
import type { PaginatedResponse } from "@/shared/types/api";

function buildFormData(data: BusinessCreate | BusinessUpdate): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value instanceof File ? value : String(value));
        }
    });
    return formData;
}

export const businessApi = {
    list: (filters?: BusinessFilters & { page?: number }) =>
        api.get<PaginatedResponse<Business>>("/api/business/", { params: filters }),

    getById: (id: number) => api.get<Business>(`/api/business/${id}/`),

    create: (data: BusinessCreate) =>
        api.post<Business>("/api/business/", buildFormData(data), {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    patch: (id: number, data: BusinessUpdate) =>
        api.patch<Business>(`/api/business/${id}/`, buildFormData(data), {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    getOptions: () => api.get<BusinessOption[]>("/api/business/options/"),
};
