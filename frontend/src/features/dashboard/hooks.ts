import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './api';
import { queryKeys } from '@/lib/queryKeys';
import type { EvolutionFilters, KPiFilters, KpisByAutomationFilters } from './types';

export function useEvolution(filters?: EvolutionFilters) {
    return useQuery({
        queryKey: queryKeys.dashboard.evolution(filters),
        queryFn: () => dashboardApi.getEvolution(filters).then((res) => res.data),
    });
}

export function useKpisByAutomation(filters?: KpisByAutomationFilters) {
    return useQuery({
        queryKey: queryKeys.dashboard.kpisByAutomation(filters),
        queryFn: () => dashboardApi.getKpisByAutomation(filters).then((res) => res.data),
    });
}

export function useKpis(filters?: KPiFilters) {
    return useQuery({
        queryKey: queryKeys.dashboard.kpis(filters),
        queryFn: () => dashboardApi.getKpis(filters).then((res) => res.data),
    });
}
