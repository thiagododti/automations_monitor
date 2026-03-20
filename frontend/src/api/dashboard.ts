import api from '@/lib/axios';
import type { Evolution, EvolutionFilters, KPiFilters, Kpis, KpisByAutomationFilters, KpisByAutomations } from '@/types/dashboard';


export const dashboardApi = {
    getEvolution: (filters?: EvolutionFilters) => api.get<Evolution[]>('/api/executions/dashboard/evolution/', { params: filters }),
    getKpisByAutomation: (filters?: KpisByAutomationFilters) => api.get<KpisByAutomations[]>('/api/executions/dashboard/kpis/by-automation/', { params: filters }),
    getKpis: (filters?: KPiFilters) => api.get<Kpis>('/api/executions/dashboard/kpis/', { params: filters }),
}