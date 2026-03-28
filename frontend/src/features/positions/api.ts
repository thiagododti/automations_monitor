import api from "@/lib/axios";
import type { Position, PositionCreate, PositionUpdate, PositionFilters, PositionOption, PositionsNivel } from "./types";
import type { PaginatedResponse } from "@/shared/types/api";

export const positionsApi = {
    list: (filters?: PositionFilters & { page?: number }) =>
        api.get<PaginatedResponse<Position>>("/api/positions/", { params: filters }),

    getById: (id: number) => api.get<Position>(`/api/positions/${id}/`),

    create: (data: PositionCreate) =>
        api.post<Position>("/api/positions/", data),

    patch: (id: number, data: PositionUpdate) =>
        api.patch<Position>(`/api/positions/${id}/`, data),

    getOptions: () => api.get<PositionOption[]>("/api/positions/options/"),

    getNivels: () => api.get<PositionsNivel[]>("/api/positions/nivel/"),
};
