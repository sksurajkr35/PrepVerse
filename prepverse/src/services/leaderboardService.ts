import { LeaderboardUser } from '../types';
import { mockLeaderboardUsers } from '../data/mockData';
import { apiFetch } from './api';
import { authService } from './authService';

interface LeaderboardRow {
  rank: number;
  id: string;
  name: string;
  college: string;
  rating: number;
  problemsSolved: number;
  score: number;
  avatarUrl: string;
  badge: string;
  currentUser: boolean;
}

function avatarFor(name: string, url: string): string {
  if (url) {
    return url;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`;
}

export const leaderboardService = {
  /** Live leaderboard from MySQL, with static fallback when backend is down. */
  async getLeaderboard(): Promise<LeaderboardUser[]> {
    try {
      const rows = await apiFetch<LeaderboardRow[]>('/api/leaderboard');
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map(r => ({
          rank: r.rank,
          id: r.id,
          name: r.name,
          college: r.college ?? '',
          rating: r.rating ?? 0,
          problemsSolved: r.problemsSolved ?? 0,
          score: r.score ?? 0,
          avatarUrl: avatarFor(r.name, r.avatarUrl),
          badge: r.badge,
          isCurrentUser: r.currentUser === true
        }));
      }
    } catch {
      // fall through to static data
    }
    const me = authService.getCurrentUser();
    return mockLeaderboardUsers.map(u => ({
      ...u,
      isCurrentUser: me ? u.id === me.id : u.isCurrentUser
    }));
  }
};
