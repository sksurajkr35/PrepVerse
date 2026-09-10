/**
 * Thin HTTP client for the PrepVerse Java backend (Spring Boot, port 8080).
 * In dev, Vite proxies '/api' -> http://localhost:8080 (see vite.config.ts).
 * Set VITE_API_URL to call the backend directly (e.g. production).
 *
 * Sessions use a short-lived access JWT + a rotating refresh token. On 401
 * the client silently refreshes once (single-flight) and retries; only if
 * the refresh fails is the user bounced to login.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_BASE: string = ((import.meta as any).env?.VITE_API_URL as string) ?? '';

const TOKEN_KEY = 'prepverse_jwt_token';
const REFRESH_KEY = 'prepverse_refresh_token';
// Must match AUTH_STORAGE_KEY in authService.ts (kept here to avoid a cycle).
const CACHED_USER_KEY = 'prepverse_auth_user';

const UNAUTH_EVENT = 'prepverse:unauthorized';

/** Subscribe to "session is dead (401 even after refresh)" events. Returns unsubscribe fn. */
export function onUnauthorized(callback: () => void): () => void {
  window.addEventListener(UNAUTH_EVENT, callback);
  return () => window.removeEventListener(UNAUTH_EVENT, callback);
}

function handleUnauthorized(): void {
  setToken(null);
  setRefreshToken(null);
  try {
    localStorage.removeItem(CACHED_USER_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(UNAUTH_EVENT));
}

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

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export function setRefreshToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(REFRESH_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_KEY);
    }
  } catch {
    // storage unavailable - ignore
  }
}

/** Exchanges the stored refresh token for a fresh pair. False when unrefreshable. */
async function doRefresh(): Promise<boolean> {
  try {
    const rt = getRefreshToken();
    if (!rt) {
      return false;
    }
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt })
    });
    if (!res.ok) {
      return false;
    }
    const data = await res.json();
    if (!data || typeof data.token !== 'string' || !data.token) {
      return false;
    }
    setToken(data.token);
    if (typeof data.refreshToken === 'string' && data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }
    return true;
  } catch {
    return false;
  }
}

/** Single-flight refresh: concurrent 401s share one refresh call. */
let refreshPromise: Promise<boolean> | null = null;

function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export class ApiError extends Error {
  status: number;
  /** Seconds to wait before retrying (present on HTTP 429 rate-limit responses). */
  retryAfter?: number;

  constructor(status: number, message: string, retryAfter?: number) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter;
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

async function send(path: string, init: RequestInit, withAuth: boolean): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (withAuth) {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  return fetch(`${API_BASE}${path}`, { ...init, headers });
}

export async function apiFetch<T>(path: string, options?: ApiOptions): Promise<T> {
  const { auth, ...init } = options ?? {};
  const useAuth = auth !== false;
  const hadToken = useAuth && getToken() !== null;

  let res = await send(path, init, useAuth);
  if (res.status === 401 && hadToken && !path.startsWith('/api/auth/') && (await tryRefresh())) {
    // Access token expired but the session is alive - retry once with the fresh token.
    res = await send(path, init, true);
  }

  if (!res.ok) {
    if (res.status === 401 && hadToken) {
      // Dead session -> wipe it and bounce to login. Tokenless requests
      // (offline demo users, wrong-password logins) just get the error.
      handleUnauthorized();
    }
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
    const retryAfterHeader = res.headers.get('Retry-After');
    const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : undefined;
    throw new ApiError(res.status, message, retryAfter);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
