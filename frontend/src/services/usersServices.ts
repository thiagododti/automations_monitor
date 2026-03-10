import type { CreateUserPayload, PaginatedResponse, UpdateUserPayload, User } from "@/types/api";
import { httpClient } from "./httpClient";
import buildBody from "@/utils/buildBody";

export const usersService = {
    list: (page: number) =>
        httpClient<PaginatedResponse<User>>(`/users/?page=${page}`),

    create: (payload: CreateUserPayload) =>
        httpClient<User>("/users/", {
            method: "POST",
            body: buildBody(payload),
        }),

    update: (id: number, payload: UpdateUserPayload) =>
        httpClient<User>(`/users/${id}/`, {
            method: "PATCH",
            body: buildBody(payload),
        }),
};