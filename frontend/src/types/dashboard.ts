export interface Evolution {
    period: string;
    total_executions: number;
    total_time_economy_seconds: number;
    total_cost_economy: string;
    avg_efficiency_percent: string;
}

export interface EvolutionFilters {
    business?: number;
    automation?: number;
    status?: string;
    date_from?: string;
    date_to?: string;
    group_by?: 'day' | 'week' | 'month';
}

export interface Kpis {
    total_executions: number;
    total_time_economy_seconds: number;
    total_cost_economy: string;
    total_potential_cost: string;
    total_potential_time_seconds: number;
    avg_efficiency_percent: string;
    total_errors: number;
    total_success: number;
}

export interface KpisByAutomations {
    automation_id: number;
    automation_name: string;
    total_executions: number;
    avg_efficiency_percent: string;
    total_cost_economy: string;
    total_potential_cost: string;
    total_time_economy_seconds: number;
    total_errors: number;
}

export interface KpisByAutomationFilters {
    business?: number;
    status?: string;
    date_from?: string;
    date_to?: string;
}

export interface KPiFilters extends KpisByAutomationFilters {
    automation?: number;
}
