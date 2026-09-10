/**
 * Thin HTTP client for the PrepVerse Java backend (Spring Boot, port 8080).
 * In dev, Vite proxies '/api' -> http://localhost:8080 (see vite.config.ts).
 * Set VITE_API_URL to call the backend directly (e.g. production).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_BASE: string = ((import.meta as any).env?.VITE_API_URL as string) ?? '';

const TOKEN_KEY = 'prepverse_jwt_token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // storage unavailable - ignore
  }
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * True when the Java backend can't be reached: either fetch() throws TypeError
 * (connection refused / offline) or we get a 5xx (e.g. Vite proxy 500 when the
 * backend is down). 4xx responses mean the backend IS up and rejected the
 * request (wrong password, duplicate email, ...) - those are real errors.
 */
export function isNetworkError(err: unknown): boolean {
  if (err instanceof TypeError) {
    return true;
  }
  return err instanceof ApiError && err.status >= 500;
}

interface ApiOptions extends RequestInit {
  /** Attach "Authorization: Bearer <jwt>" (default true). */
  auth?: boolean;
}

export async function apiFetch<T>(path: string, options?: ApiOptions): Promise<T> {
  const { auth, ...init } = options ?? {};
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (auth !== false) {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data && typeof data.message === 'string' && data.message) {
        message = data.message;
      } else if (data && typeof data.error === 'string' && data.error) {
        message = data.error;
      }
    } catch {
      // non-JSON error body - keep default message
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
