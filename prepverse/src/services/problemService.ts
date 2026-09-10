import { Problem } from '../types';
import { mockProblems } from '../data/mockData';
import { apiFetch } from './api';
import { storageService } from './storageService';

/** Overlays the user's real Solved/Attempted status onto any problem list. */
function withStatus(list: Problem[]): Problem[] {
  const solved = new Set(storageService.getSolvedProblemIds());
  const attempted = new Set(storageService.getSubmissions().map(s => s.problemId));
  return list.map(p => ({
    ...p,
    status: solved.has(p.id) ? 'Solved' : attempted.has(p.id) ? 'Attempted' : 'Unsolved'
  }));
}

export const problemService = {
  /** Question bank from MySQL, with static fallback when backend is down. */
  async getProblems(): Promise<Problem[]> {
    try {
      const list = await apiFetch<Problem[]>('/api/problems');
      if (Array.isArray(list) && list.length > 0) {
        return withStatus(list);
      }
    } catch {
      // offline -> static bank below
    }
    return withStatus(mockProblems);
  },

  /** Single problem detail (null when unreachable - callers keep current data). */
  async getProblem(id: string): Promise<Problem | null> {
    try {
      const p = await apiFetch<Problem>(`/api/problems/${id}`);
      if (p && p.id) {
        return withStatus([p])[0];
      }
    } catch {
      // ignore
    }
    return null;
  }
};
