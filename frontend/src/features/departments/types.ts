export interface Department {
    id: number;
    name: string;
    description: string | null;
    status: boolean;
    created_at: string;
    updated_at: string;
    updated_by: number | null;
    updated_by_data: { first_name: string; last_name: string } | null;
}

export interface DepartmentCreate {
    name: string;
    description?: string;
    status?: boolean;
}

export interface DepartmentUpdate extends Partial<DepartmentCreate> { }

export interface DepartmentFilters {
    name?: string;
    description?: string;
}

export interface DepartmentOption {
    id: number;
    name: string;
}
