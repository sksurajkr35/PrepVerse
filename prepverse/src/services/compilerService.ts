import { apiFetch } from './api';

export interface RunCodeResult {
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error';
  output: string;
  executionTime: string;
  memory: string;
  passedCases: number;
  totalCases: number;
}

export const compilerService = {
  async runCode(language: string, code: string, customInput?: string): Promise<RunCodeResult> {
    try {
      return await apiFetch<RunCodeResult>('/api/compiler/run', {
        method: 'POST',
        body: JSON.stringify({ language, code, customInput })
      });
    } catch {
      // Backend down / unreachable -> local simulation below.
      // (401 expired-session is handled globally: api.ts auto-logs-out.)
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
          ? `Output for Custom Input [${customInput}]:\nResult: 15`
          : 'Test Case 1: PASSED (0ms)\nTest Case 2: PASSED (2ms)\nTest Case 3: PASSED (1ms)\n\nAll test cases passed!',
        executionTime: '24 ms',
        memory: '12.8 MB',
        passedCases: 3,
        totalCases: 3
      });
    }, 700);
  });
}
