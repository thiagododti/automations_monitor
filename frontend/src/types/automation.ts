import { Position } from "./position";

export interface Automation {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  manual_time: number;
  in_manutention: boolean;
  updated_by: number | null;
  updated_by_data: { first_name: string; last_name: string } | null;
  department: number | null;
  department_data: { name: string } | null;
  position: number;
  position_data: Position | null;
  auth_certificate: boolean;
  url_certificate: string;
}

export interface AutomationCreate {
  name: string;
  description?: string;
  is_active?: boolean;
  manual_time?: number;
  in_manutention?: boolean;
  department?: number;
  position?: number;
  auth_certificate?: boolean;
  url_certificate?: string;
}

export interface AutomationUpdate extends Partial<AutomationCreate> { }

export interface AutomationFilters {
  name?: string;
  is_active?: boolean;
}

export interface AutomationsStatus {
  id: number;
  name: string;
  last_status: 'iniciado' | 'concluido' | 'erro' | 'alerta' | null;
  last_date_start: string | null;
  last_date_end: string | null;
  last_execution_id: number | null;
}

export interface AutomationDetails {
  name: string;
  description: string | null;
  is_active: boolean;
}