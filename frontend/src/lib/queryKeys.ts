/**
 * Centralized query key factory for TanStack Query.
 *
 * Using factories ensures:
 * - Consistent keys across hooks
 * - Type-safe `as const` tuples (enables precise cache invalidation)
 * - Single source of truth — renaming a key automatically propagates everywhere
 *
 * Usage:
 *   queryKey: queryKeys.automations.list(filters, page)
 *   qc.invalidateQueries({ queryKey: queryKeys.automations.all() })
 */
export const queryKeys = {
    automations: {
        all: () => ['automations'] as const,
        list: (filters?: unknown, page?: number) =>
            [...queryKeys.automations.all(), filters, page] as const,
        detail: (id: number) =>
            [...queryKeys.automations.all(), id] as const,
        status: () =>
            [...queryKeys.automations.all(), 'status'] as const,
    },

    businesses: {
        all: () => ['businesses'] as const,
        list: (filters?: unknown, page?: number) =>
            [...queryKeys.businesses.all(), filters, page] as const,
        detail: (id: number) =>
            [...queryKeys.businesses.all(), id] as const,
        options: () => ['businessOptions'] as const,
    },

    departments: {
        all: () => ['departments'] as const,
        list: (filters?: unknown, page?: number) =>
            [...queryKeys.departments.all(), filters, page] as const,
        detail: (id: number) =>
            [...queryKeys.departments.all(), id] as const,
        options: () => ['departmentOptions'] as const,
    },

    dashboard: {
        evolution: (filters?: unknown) => ['evolution', filters] as const,
        kpis: (filters?: unknown) => ['kpis', filters] as const,
        kpisByAutomation: (filters?: unknown) => ['kpisByAutomation', filters] as const,
    },

    executions: {
        all: () => ['executions'] as const,
        list: (filters?: unknown, page?: number) =>
            [...queryKeys.executions.all(), filters, page] as const,
        detail: (id: number) =>
            [...queryKeys.executions.all(), id] as const,
        logs: (executionId: number, page?: number) =>
            [...queryKeys.executions.all(), executionId, 'logs', page] as const,
        steps: (executionId: number, page?: number) =>
            [...queryKeys.executions.all(), executionId, 'steps', page] as const,
    },

    logs: {
        all: () => ['logs'] as const,
        list: (filters?: unknown, page?: number) =>
            [...queryKeys.logs.all(), filters, page] as const,
        detail: (id: number) =>
            [...queryKeys.logs.all(), id] as const,
    },

    steps: {
        all: () => ['steps'] as const,
        list: (filters?: unknown, page?: number) =>
            [...queryKeys.steps.all(), filters, page] as const,
        detail: (id: number) =>
            [...queryKeys.steps.all(), id] as const,
    },

    positions: {
        all: () => ['positions'] as const,
        list: (filters?: unknown, page?: number) =>
            [...queryKeys.positions.all(), filters, page] as const,
        detail: (id: number) =>
            [...queryKeys.positions.all(), id] as const,
        options: () => ['positionOptions'] as const,
        nivels: () => ['positionNivels'] as const,
    },

    users: {
        all: () => ['users'] as const,
        list: (filters?: unknown, page?: number) =>
            [...queryKeys.users.all(), filters, page] as const,
        detail: (id: number) =>
            [...queryKeys.users.all(), id] as const,
    },

    tokens: {
        detail: (userId: number) => ['token', userId] as const,
    },
};
