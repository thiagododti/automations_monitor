export type StepStatus = 'iniciado' | 'concluido' | 'erro' | 'alerta' | 'teste';

export interface Step {
  id: number;
  identification: string | null;
  status: StepStatus;
  date_start: string;
  date_end: string | null;
  time_automation_seconds: number;
  time_manual_seconds: number;
  time_economy_seconds: number;
  potential_time_seconds: number;
  potential_cost: string;
  efficiency_percent: string;
  execution: number;
  execution_data: { status: string; date_start: string; date_end: string | null };
}

export interface StepCreate {
  execution: number;
  identification?: string;
  status: StepStatus;
}

export interface StepFilters {
  execution?: string;
  identification?: string;
  status?: string;
  date_start?: string;
}
