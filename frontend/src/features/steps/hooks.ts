import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stepsApi } from './api';
import { queryKeys } from '@/lib/queryKeys';
import type { StepFilters, StepCreate } from './types';

export function useSteps(filters?: StepFilters, page = 1) {
    return useQuery({
        queryKey: queryKeys.steps.list(filters, page),
        queryFn: () => stepsApi.list({ ...filters, page }).then((res) => res.data),
    });
}

export function useStep(id: number) {
    return useQuery({
        queryKey: queryKeys.steps.detail(id),
        queryFn: () => stepsApi.getById(id).then((res) => res.data),
        enabled: !!id,
    });
}

export function useCreateStep() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: StepCreate) => stepsApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.steps.all() }),
    });
}

/** Steps filtrados por execução, com query key própria para evitar colisão com useSteps. */
export function useExecutionSteps(executionId: number, page = 1) {
    return useQuery({
        queryKey: queryKeys.executions.steps(executionId, page),
        queryFn: () =>
            stepsApi.list({ execution: String(executionId), page }).then((res) => res.data),
        enabled: !!executionId,
    });
}
