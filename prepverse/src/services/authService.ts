import { User } from '../types';
import { currentUserMock } from '../data/mockData';
import { apiFetch, getToken, setToken, setRefreshToken, isNetworkError } from './api';
import { storageService } from './storageService';

const AUTH_STORAGE_KEY = 'prepverse_auth_user';

interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

function cacheUser(user: User): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

/** Persists a fresh session pair (access + rotating refresh token). */
function storeSession(data: AuthResponse): void {
  setToken(data.token);
  setRefreshToken(data.refreshToken ?? null);
  cacheUser(data.user);
}

/** Fields the Java backend accepts on PUT /api/users/me. */
function editableFields(u: Partial<User>): Record<string, unknown> {
  return {
    name: u.name,
    college: u.college,
    branch: u.branch,
    graduationYear: u.graduationYear,
    targetRole: u.targetRole,
    preferredLanguage: u.preferredLanguage,
    avatarUrl: u.avatarUrl,
    githubUrl: u.githubUrl,
    leetcodeUrl: u.leetcodeUrl,
    linkedinUrl: u.linkedinUrl,
    codechefUrl: u.codechefUrl
  };
}

export const authService = {
  getToken,

  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as User;
      }
    } catch {
      // ignore
    }
    return null;
  },

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  },

  /** Email + password login against the Java backend (JWT + refresh token). */
  async login(email: string, password?: string): Promise<User> {
    try {
      const data = await apiFetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ email, password: password ?? '' })
      });
      storeSession(data);
      await storageService.syncAllFromServer().catch(() => {});
      return data.user;
    } catch (err) {
      if (isNetworkError(err)) {
        // Backend unreachable -> offline demo-mode login (old behavior)
        const user: User = {
          ...currentUserMock,
          email,
          name: email.split('@')[0] || 'Surya Rastogi'
        };
        setToken(null);
        setRefreshToken(null);
        cacheUser(user);
        return user;
      }
      throw err;
    }
  },

  /** Register a new student in MySQL via the Java backend. */
  async signup(signupData: {
    name: string;
    email: string;
    college: string;
    branch: string;
    graduationYear: number;
    targetRole: string;
    preferredLanguage: string;
    password?: string;
  }): Promise<User> {
    try {
      const data = await apiFetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        auth: false,
        body: JSON.stringify(signupData)
      });
      storeSession(data);
      await storageService.syncAllFromServer().catch(() => {});
      return data.user;
    } catch (err) {
      if (isNetworkError(err)) {
        // Backend unreachable -> local-only account
        const user: User = {
          ...currentUserMock,
          id: `usr_${Date.now()}`,
          name: signupData.name,
          email: signupData.email,
          college: signupData.college,
          branch: signupData.branch,
          graduationYear: signupData.graduationYear,
          targetRole: signupData.targetRole,
          preferredLanguage: signupData.preferredLanguage
        };
        setToken(null);
        setRefreshToken(null);
        cacheUser(user);
        return user;
      }
      throw err;
    }
  },

  /** One-click demo access (demo@prepverse.com on the backend). */
  async demoLogin(): Promise<User> {
    try {
      const data = await apiFetch<AuthResponse>('/api/auth/demo', {
        method: 'POST',
        auth: false
      });
      storeSession(data);
      await storageService.syncAllFromServer().catch(() => {});
      return data.user;
    } catch (err) {
      if (isNetworkError(err)) {
        const demoUser = { ...currentUserMock };
        setToken(null);
        setRefreshToken(null);
        cacheUser(demoUser);
        return demoUser;
      }
      throw err;
    }
  },

  /** Refresh the cached profile from GET /api/users/me (no-op when offline). */
  async fetchMe(): Promise<User | null> {
    if (!getToken()) {
      return this.getCurrentUser();
    }
    try {
      const me = await apiFetch<User>('/api/users/me');
      cacheUser(me);
      await storageService.syncAllFromServer().catch(() => {});
      return me;
    } catch {
      return this.getCurrentUser();
    }
  },

  /** Update profile locally + on the server (falls back to local-only offline). */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const current = this.getCurrentUser() || currentUserMock;
    const updated: User = { ...current, ...updates };
    cacheUser(updated);
    if (!getToken()) {
      return updated;
    }
    try {
      const saved = await apiFetch<User>('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify(editableFields(updates))
      });
      // Server doesn't store live score fields via this endpoint - keep local computed stats
      const merged: User = {
        ...saved,
        prepVerseScore: updated.prepVerseScore,
        placementReadiness: updated.placementReadiness,
        problemsSolved: updated.problemsSolved,
        xp: updated.xp
      };
      cacheUser(merged);
      return merged;
    } catch {
      return updated;
    }
  },

  /** Revokes the server session (best-effort) and clears local auth state. */
  logout(): void {
    if (getToken()) {
      apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    }
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    setToken(null);
    setRefreshToken(null);
  }
};
