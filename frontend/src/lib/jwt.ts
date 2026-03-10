import type { DecodedToken } from "@/types/api";

export function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as DecodedToken;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  // 30s buffer
  return decoded.exp * 1000 < Date.now() + 30000;
}

export function getUserIdFromToken(token: string): string | null {
  const decoded = decodeToken(token);
  return decoded?.user_id ?? null;
}
