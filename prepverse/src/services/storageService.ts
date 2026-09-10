import { doc, collection, addDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Problem, Submission, TestAttemptResult } from '../types';
import { mockProblems } from '../data/mockData';
import { authService } from './authService';

const SOLVED_PROBLEMS_KEY = 'prepverse_solved_problems';
const SUBMISSIONS_KEY = 'prepverse_submissions';
const TEST_ATTEMPTS_KEY = 'prepverse_test_attempts';

export const storageService = {
  getProblems(): Problem[] {
    const solvedIds = this.getSolvedProblemIds();
    return mockProblems.map(p => ({
      ...p,
      status: solvedIds.includes(p.id) ? 'Solved' : p.status
    }));
  },

  getSolvedProblemIds(): string[] {
    const stored = localStorage.getItem(SOLVED_PROBLEMS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return ['p1', 'p2', 'p3', 'p4', 'p5', 'p7', 'p9'];
  },

  async markProblemSolved(problemId: string, code: string, language: string) {
    const solved = new Set(this.getSolvedProblemIds());
    solved.add(problemId);
    const solvedArray = Array.from(solved);
    localStorage.setItem(SOLVED_PROBLEMS_KEY, JSON.stringify(solvedArray));

    const user = authService.getCurrentUser();
    if (user && user.id) {
      try {
        const userRef = doc(db, 'users', user.id);
        await setDoc(userRef, { solvedProblemIds: solvedArray }, { merge: true });
      } catch (err) {
        console.warn('Firestore update solved problem error:', err);
      }
    }

    // Save submission
    const problem = mockProblems.find(p => p.id === problemId);
    if (problem) {
      const submissions = this.getSubmissions();
      const newSub: Submission = {
        id: `sub_${Date.now()}`,
        problemId,
        problemTitle: problem.title,
        language,
        status: 'Accepted',
        runtime: '28 ms',
        memory: '11.2 MB',
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        code
      };
      submissions.unshift(newSub);
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions.slice(0, 50)));

      if (user && user.id) {
        try {
          const subColRef = collection(db, 'users', user.id, 'submissions');
          await addDoc(subColRef, newSub);
        } catch (err) {
          console.warn('Firestore save submission error:', err);
        }
      }
    }
  },

  getSubmissions(): Submission[] {
    const stored = localStorage.getItem(SUBMISSIONS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return [];
  },

  async saveTestAttempt(attempt: TestAttemptResult) {
    const attempts = this.getTestAttempts();
    attempts.unshift(attempt);
    localStorage.setItem(TEST_ATTEMPTS_KEY, JSON.stringify(attempts));

    const user = authService.getCurrentUser();
    if (user && user.id) {
      try {
        const attColRef = collection(db, 'users', user.id, 'testAttempts');
        await addDoc(attColRef, attempt);
      } catch (err) {
        console.warn('Firestore save test attempt error:', err);
      }
    }
  },

  getTestAttempts(): TestAttemptResult[] {
    const stored = localStorage.getItem(TEST_ATTEMPTS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return [];
  }
};

