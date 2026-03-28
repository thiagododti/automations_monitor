export interface User {
    id: number;
    last_login: string | null;
    is_superuser: boolean;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    telephone: string | null;
    birthday: string | null;
    photo: string | null;
    department: number | null;
    department_data: { name: string; description: string; status: boolean } | null;
    updated_by: number | null;
    updated_by_data: { first_name: string; last_name: string } | null;
}

export interface UserCreate {
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password: string;
    telephone?: string;
    birthday?: string;
    photo?: File;
    department?: number;
    is_active?: boolean;
    is_staff?: boolean;
    is_superuser?: boolean;
}

export interface UserUpdate extends Partial<Omit<UserCreate, 'password'>> {
    password?: string;
}

export interface UserFilters {
    username?: string;
    email?: string;
    full_name?: string;
}

export interface Token {
    key: string;
    user: number;
    created: string;
}

export interface TokenCreate {
    user_id: number;
}

export interface TokenRegenerate extends TokenCreate { }
