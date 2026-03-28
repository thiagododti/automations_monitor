export interface LoginCredentials {
    username: string;
    password: string;
}

export interface TokenResponse {
    access: string;
    refresh: string;
}

export interface RefreshResponse {
    access: string;
    refresh: string;
}
