export interface Log {
  id: number;
  description: string | null;
  created_at: string;
  updated_at: string;
  execution: number;
  execution_data: { status: string; date_start: string; date_end: string | null };
}

export interface LogCreate {
  execution: number;
  description?: string;
}

export interface LogFilters {
  execution?: string;
  description?: string;
  created_at?: string;
}
