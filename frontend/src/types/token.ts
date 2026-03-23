export interface Token {
    key: string,
    user: number,
    created: string
}

export interface TokenCreate {
    user_id: number
}

export interface TokenRegenerate extends TokenCreate { }