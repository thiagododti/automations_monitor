import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { executionsApi } from './api';
import { queryKeys } from '@/lib/queryKeys';
import { useExecutionLogs } from '@/features/logs/hooks';
import { useExecutionSteps } from '@/features/steps/hooks';
import type { ExecutionFilters, ExecutionCreate, ExecutionUpdate } from './types';

// ─── Query hooks ──────────────────────────────────────────────────────────────

export function useExecutions(filters?: ExecutionFilters, page = 1) {
    return useQuery({
        queryKey: queryKeys.executions.list(filters, page),
        queryFn: () => executionsApi.list({ ...filters, page }).then((res) => res.data),
    });
}

export function useExecution(id: number) {
    return useQuery({
        queryKey: queryKeys.executions.detail(id),
        queryFn: () => executionsApi.getById(id).then((res) => res.data),
        enabled: !!id,
    });
}

export function useCreateExecution() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: ExecutionCreate) => executionsApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.executions.all() }),
    });
}

export function useUpdateExecution() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ExecutionUpdate }) =>
            executionsApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.executions.all() }),
    });
}

export function useClearTestExecutions() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (automation_id: number) => executionsApi.clearTestExecutions(automation_id),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.executions.all() }),
    });
}

// ─── Composite hook ───────────────────────────────────────────────────────────

export function useExecutionDetail(executionId: number) {
    const [stepsPage, setStepsPage] = useState(1);
    const [logsPage, setLogsPage] = useState(1);

    const {
        data: execution,
        isLoading: isExecutionLoading,
        isError: isExecutionError,
    } = useExecution(executionId);

    const {
        data: logsData,
        isLoading: isLogsLoading,
        isError: isLogsError,
    } = useExecutionLogs(executionId, logsPage);

    const {
        data: stepsData,
        isLoading: isStepsLoading,
        isError: isStepsError,
    } = useExecutionSteps(executionId, stepsPage);

    return {
        execution,
        isExecutionLoading,
        isExecutionError,
        logsData,
        isLogsLoading,
        isLogsError,
        stepsData,
        isStepsLoading,
        isStepsError,
        stepsPage,
        setStepsPage,
        logsPage,
        setLogsPage,
    };
}
