import { Problem, Submission, TestAttemptResult } from '../types';
import { mockProblems } from '../data/mockData';
import { apiFetch, getToken } from './api';

const SOLVED_PROBLEMS_KEY = 'prepverse_solved_problems';
const SUBMISSIONS_KEY = 'prepverse_submissions';
const TEST_ATTEMPTS_KEY = 'prepverse_test_attempts';

const DEFAULT_SOLVED = ['p1', 'p2', 'p3', 'p4', 'p5', 'p7', 'p9'];

function readCache<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch {
    // ignore
  }
  return fallback;
}

function writeCache(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

/**
 * User progress store. Reads are synchronous from a localStorage cache
 * (works offline); every write also syncs to the Java backend + MySQL
 * in the background when logged in.
 */
export const storageService = {
  getProblems(): Problem[] {
    const solvedIds = this.getSolvedProblemIds();
    return mockProblems.map(p => ({
      ...p,
      status: solvedIds.includes(p.id) ? 'Solved' : p.status
    }));
  },

  getSolvedProblemIds(): string[] {
    return readCache<string[]>(SOLVED_PROBLEMS_KEY, DEFAULT_SOLVED);
  },

  markProblemSolved(problemId: string, code: string, language: string): void {
    // 1) Optimistic local update (sync - UI reads this immediately)
    const solved = new Set(this.getSolvedProblemIds());
    solved.add(problemId);
    writeCache(SOLVED_PROBLEMS_KEY, Array.from(solved));

    const problem = mockProblems.find(p => p.id === problemId);
    if (problem) {
      const submissions = this.getSubmissions();
      const newSub: Submission = {
        id: `sub_${Date.now()}`,
        problemId,
        problemTitle: problem.title,
        language,
        status: 'Accepted',
        runtime: 'N/A',
        memory: 'N/A',
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        code
      };
      submissions.unshift(newSub);
      writeCache(SUBMISSIONS_KEY, submissions.slice(0, 50));
    }

    // 2) Background server sync (fire-and-forget)
    if (getToken()) {
      apiFetch('/api/problems/solved', {
        method: 'POST',
        body: JSON.stringify({ problemId, language, code })
      }).catch(() => {});
      apiFetch('/api/submissions', {
        method: 'POST',
        body: JSON.stringify({
          problemId,
          problemTitle: problem?.title ?? '',
          language,
          code,
          status: 'Accepted',
          runtime: 'N/A',
          memory: 'N/A'
        })
      }).catch(() => {});
    }
  },

  getSubmissions(): Submission[] {
    return readCache<Submission[]>(SUBMISSIONS_KEY, []);
  },

  saveTestAttempt(attempt: TestAttemptResult): void {
    const attempts = this.getTestAttempts();
    attempts.unshift(attempt);
    writeCache(TEST_ATTEMPTS_KEY, attempts);

    if (getToken()) {
      const { testId, score, totalMarks, accuracy, correctAnswers, wrongAnswers, skipped, percentile, topicBreakdown } = attempt;
      apiFetch('/api/test-attempts', {
        method: 'POST',
        body: JSON.stringify({
          testId, score, totalMarks, accuracy,
          correctAnswers, wrongAnswers, skipped, percentile, topicBreakdown
        })
      }).catch(() => {});
    }
  },

  getTestAttempts(): TestAttemptResult[] {
    return readCache<TestAttemptResult[]>(TEST_ATTEMPTS_KEY, []);
  },

  /** Pull solved ids + submissions + attempts from MySQL into the local cache. */
  async syncAllFromServer(): Promise<void> {
    if (!getToken()) {
      return;
    }
    const [solved, subs, attempts] = await Promise.all([
      apiFetch<string[]>('/api/problems/solved').catch(() => null),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiFetch<any[]>('/api/submissions/mine').catch(() => null),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiFetch<any[]>('/api/test-attempts').catch(() => null)
    ]);
    if (solved) {
      writeCache(SOLVED_PROBLEMS_KEY, solved);
    }
    if (subs) {
      const mapped: Submission[] = subs.map(s => ({
        id: String(s.id ?? `sub_${Date.now()}`),
        problemId: String(s.problemId ?? ''),
        problemTitle: String(s.problemTitle ?? ''),
        language: String(s.language ?? ''),
        status: (['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error'] as string[]).includes(s.status)
          ? s.status
          : 'Accepted',
        runtime: String(s.runtime ?? 'N/A'),
        memory: String(s.memory ?? 'N/A'),
        submittedAt: String(s.submittedAt ?? ''),
        code: String(s.code ?? '')
      }));
      writeCache(SUBMISSIONS_KEY, mapped);
    }
    if (attempts) {
      const mapped: TestAttemptResult[] = attempts.map(a => ({
        testId: String(a.testId ?? ''),
        score: Number(a.score ?? 0),
        totalMarks: Number(a.totalMarks ?? 0),
        accuracy: Number(a.accuracy ?? 0),
        correctAnswers: Number(a.correctAnswers ?? 0),
        wrongAnswers: Number(a.wrongAnswers ?? 0),
        skipped: Number(a.skipped ?? 0),
        percentile: Number(a.percentile ?? 0),
        topicBreakdown: (a.topicBreakdown ?? {}) as Record<string, number>,
        completedAt: String(a.completedAt ?? '')
      }));
      writeCache(TEST_ATTEMPTS_KEY, mapped);
    }
  }
};
