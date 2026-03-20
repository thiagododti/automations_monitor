import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { EvolutionFilters, KPiFilters, KpisByAutomationFilters } from '@/types/dashboard';


export function useEvolution(filters?: EvolutionFilters) {
    return useQuery({
        queryKey: ['evolution', filters],
        queryFn: () => dashboardApi.getEvolution(filters).then((res) => res.data),
    });

}

export function useKpisByAutomation(filters?: KpisByAutomationFilters) {
    return useQuery({
        queryKey: ['kpisByAutomation', filters],
        queryFn: () => dashboardApi.getKpisByAutomation(filters).then((res) => res.data),
    });
}

export function useKpis(filters?: KPiFilters) {
    return useQuery({
        queryKey: ['kpis', filters],
        queryFn: () => dashboardApi.getKpis(filters).then((res) => res.data),
    });
}