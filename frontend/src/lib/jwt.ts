export function decodeJwt(token: string): { exp: number; [key: string]: unknown } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJwt(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
}

export function getTokenExpiry(token: string): Date | null {
  const decoded = decodeJwt(token);
  return decoded ? new Date(decoded.exp * 1000) : null;
}
