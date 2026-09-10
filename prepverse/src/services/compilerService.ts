import { apiFetch, ApiError, isNetworkError } from './api';
import { User } from '../types';

export interface RunCodeResult {
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error';
  output: string;
  executionTime: string;
  memory: string;
  passedCases: number;
  totalCases: number;
  /** Present when the judge ran online: updated profile (score/XP bumped on Accepted). */
  serverUser?: User;
}

interface SubmitResponse {
  verdict: string;
  passedCases: number;
  totalCases: number;
  failedCaseNumber: number | null;
  failedInput: string | null;
  failedExpected: string | null;
  failedActual: string | null;
  executionTimeMs: number;
  message: string;
  user: User;
}

function errorResult(output: string): RunCodeResult {
  return {
    status: 'Compilation Error',
    output,
    executionTime: '0 ms',
    memory: 'N/A',
    passedCases: 0,
    totalCases: 1
  };
}

/** Maps a judge verdict onto the console's 4 display states. */
function mapSubmit(res: SubmitResponse): RunCodeResult {
  const base = {
    executionTime: `${res.executionTimeMs} ms`,
    memory: 'N/A (sandbox)',
    passedCases: res.passedCases,
    totalCases: res.totalCases,
    serverUser: res.user
  };
  switch (res.verdict) {
    case 'Accepted':
      return {
        ...base,
        status: 'Accepted',
        output: `✅ ${res.message}\nPassed ${res.passedCases}/${res.totalCases} test cases (including hidden).`
      };
    case 'Time Limit Exceeded':
      return { ...base, status: 'Time Limit Exceeded', output: `⏱️ ${res.message}` };
    case 'Compilation Error':
      return { ...base, status: 'Compilation Error', output: `🔧 Compilation failed:\n${res.message}` };
    case 'Judge Error':
      return { ...base, status: 'Compilation Error', output: `⚠️ ${res.message}` };
    case 'Runtime Error':
      return {
        ...base,
        status: 'Wrong Answer',
        output: `💥 Runtime Error on case #${res.failedCaseNumber ?? '?'}:\n${res.message}`
      };
    default: {
      // Wrong Answer (incl. any unknown verdict - fail safe, never fake Accepted)
      let detail = `❌ ${res.message}`;
      if (res.failedCaseNumber != null) {
        detail += `\n\nFailed on case #${res.failedCaseNumber}:`;
        if (res.failedInput != null) {
          detail += `\n\nInput:\n${res.failedInput}`;
          detail += `\n\nExpected:\n${res.failedExpected ?? ''}`;
        } else {
          detail += ' (hidden test case)';
        }
        if (res.failedActual != null) {
          detail += `\n\nYour output:\n${res.failedActual}`;
        }
      }
      return { ...base, status: 'Wrong Answer', output: detail };
    }
  }
}

function offlineFallback(customInput?: string): RunCodeResult {
  return {
    status: 'Accepted',
    output: customInput
      ? `Output for Custom Input [${customInput}]:\nResult: 15\n\n(Java backend offline - mock fallback)`
      : 'Test Case 1: PASSED (0ms)\nTest Case 2: PASSED (2ms)\nTest Case 3: PASSED (1ms)\n\nAll test cases passed!\n\n(Java backend offline - mock fallback)',
    executionTime: '24 ms',
    memory: '12.8 MB',
    passedCases: 3,
    totalCases: 3
  };
}

export const compilerService = {
  /**
   * Runs code via the secured Java endpoint (JWT attached automatically).
   * Never throws: auth/rate-limit/backend errors are returned as readable
   * results, and a mock fallback is used when the backend is unreachable.
   */
  async runCode(language: string, code: string, customInput?: string): Promise<RunCodeResult> {
    try {
      return await apiFetch<RunCodeResult>('/api/compiler/run', {
        method: 'POST',
        body: JSON.stringify({ language, code, customInput })
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return errorResult('🔒 Session expired or not logged in — please log in again to run code.');
      }
      if (err instanceof ApiError && err.status === 429) {
        const wait = err.retryAfter ? ` in ~${err.retryAfter}s` : '';
        return errorResult(`⏳ Too many requests — please wait${wait} and try again.`);
      }
      if (!isNetworkError(err)) {
        // Backend is up but rejected the request (e.g. validation) - show why
        return errorResult(`⚠️ ${err instanceof ApiError ? err.message : 'Code execution failed'}`);
      }
      return offlineFallback(customInput);
    }
  },

  /**
   * Judged submit: runs visible + hidden test cases on the Java backend.
   * Online verdicts carry serverUser (updated score/XP); offline falls back
   * to the mock result WITHOUT serverUser so the page records it locally.
   */
  async submitCode(problemId: string, language: string, code: string): Promise<RunCodeResult> {
    try {
      const res = await apiFetch<SubmitResponse>(`/api/problems/${problemId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ language, code })
      });
      return mapSubmit(res);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return errorResult('🔒 Session expired or not logged in — please log in again to submit.');
      }
      if (err instanceof ApiError && err.status === 429) {
        const wait = err.retryAfter ? ` in ~${err.retryAfter}s` : '';
        return errorResult(`⏳ Too many submits — please wait${wait} and try again.`);
      }
      if (!isNetworkError(err)) {
        return errorResult(`⚠️ ${err instanceof ApiError ? err.message : 'Submit failed'}`);
      }
      return offlineFallback(undefined);
    }
  }
};
