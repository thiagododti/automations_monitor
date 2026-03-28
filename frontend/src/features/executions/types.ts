import type { AutomationDetails } from '@/features/automations/types';
import type { BusinessDetails } from '@/features/business/types';

export type ExecutionStatus = 'iniciado' | 'concluido' | 'erro' | 'alerta' | 'teste';

export interface Execution {
    id: number;
    date_start: string;
    date_end: string | null;
    status: ExecutionStatus;
    automation: number;
    automation_data: AutomationDetails;
    step_counts: number;
    success_count: number;
    error_count: number;
    time_automation_seconds: number;
    time_manual_seconds: number;
    time_economy_seconds: number;
    cost_economy: string;
    potential_time_seconds: number;
    potential_cost: string;
    efficiency_percent: string;
    business: number;
    business_data: BusinessDetails;
}

export interface ExecutionCreate {
    automation: number;
    status: ExecutionStatus;
}

export interface ExecutionUpdate extends Partial<ExecutionCreate> { }

export interface ExecutionFilters {
    automation?: string;
    date_start?: string;
    status?: string;
}

export interface ClearExecutionsTest {
    automation_id: number;
}
