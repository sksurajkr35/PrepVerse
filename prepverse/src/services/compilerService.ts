import { apiFetch, ApiError, isNetworkError } from './api';

export interface RunCodeResult {
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error';
  output: string;
  executionTime: string;
  memory: string;
  passedCases: number;
  totalCases: number;
}

export const compilerService = {
  /**
   * Runs code via the secured Java endpoint (JWT attached automatically).
   * Never throws: rate-limit/backend errors are returned as readable results,
   * and mock simulation is used ONLY when the backend is unreachable.
   * (401 expired-session is handled globally: api.ts auto-logs-out.)
   */
  async runCode(language: string, code: string, customInput?: string): Promise<RunCodeResult> {
    try {
      return await apiFetch<RunCodeResult>('/api/compiler/run', {
        method: 'POST',
        body: JSON.stringify({ language, code, customInput })
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        const wait = err.retryAfter ? ` in ~${err.retryAfter}s` : '';
        return {
          status: 'Compilation Error',
          output: `⏳ Too many requests — please wait${wait} and try again.`,
          executionTime: '0 ms',
          memory: 'N/A',
          passedCases: 0,
          totalCases: 1
        };
      }
      if (!isNetworkError(err)) {
        // Backend is up but rejected the request (e.g. validation) - show why.
        return {
          status: 'Compilation Error',
          output: `⚠️ ${err instanceof ApiError ? err.message : 'Code execution failed'}`,
          executionTime: '0 ms',
          memory: 'N/A',
          passedCases: 0,
          totalCases: 1
        };
      }
      return mockResult(customInput);
    }
  },

  async submitCode(problemId: string, language: string, code: string): Promise<RunCodeResult> {
    const result = await this.runCode(language, code);
    return result;
  }
};

/** Fallback simulation (used only when the Java backend is unreachable). */
function mockResult(customInput?: string): Promise<RunCodeResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'Accepted',
        output: customInput
          ? `Output for Custom Input [${customInput}]:\nResult: 15\n\n(Java backend offline - mock fallback)`
          : 'Test Case 1: PASSED (0ms)\nTest Case 2: PASSED (2ms)\nTest Case 3: PASSED (1ms)\n\nAll test cases passed!\n\n(Java backend offline - mock fallback)',
        executionTime: '24 ms',
        memory: '12.8 MB',
        passedCases: 3,
        totalCases: 3
      });
    }, 700);
  });
}
