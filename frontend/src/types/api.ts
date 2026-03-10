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
  telephone: string;
  birthday: string | null;
  photo: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface DecodedToken {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_active?: boolean;
  telephone?: string;
  birthday?: string;
  photo?: File;
}

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, 'username' | 'password'>>;
