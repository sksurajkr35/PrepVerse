import { apiFetch, ApiError, isNetworkError } from './api';

export interface ChatMessagePayload {
  role: 'user' | 'ai';
  content: string;
}

export const aiService = {
  /**
   * Asks the secured Java AI endpoint (JWT attached automatically).
   * Never throws: rate-limit/backend errors become readable chat messages,
   * and the demo answer is used ONLY when the backend is unreachable.
   * (401 expired-session is handled globally: api.ts auto-logs-out.)
   */
  async askAIMentor(
    prompt: string,
    history?: ChatMessagePayload[],
    systemInstruction?: string
  ): Promise<string> {
    try {
      const data = await apiFetch<{ response: string }>('/api/ai-mentor', {
        method: 'POST',
        body: JSON.stringify({ prompt, history, systemInstruction })
      });
      if (data && data.response) {
        return data.response;
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        const wait = err.retryAfter ? ` in ~${err.retryAfter}s` : '';
        return `⏳ Too many AI requests — please wait${wait} and try again.`;
      }
      if (!isNetworkError(err)) {
        return `⚠️ ${err instanceof ApiError ? err.message : 'AI request failed'}`;
      }
      // else: backend unreachable -> demo fallback below
    }

    // Demo answer (used only when the Java backend is unreachable)
    return `[PrepVerse AI Mentor Response]

Here is a structured explanation for: **"${prompt.slice(0, 60)}..."**

1. **Core Concept**:
   - Focus on breaking down the problem into smaller sub-problems.
   - Pay close attention to corner cases (empty array, null pointers, large numbers).

2. **Step-by-Step Approach**:
   - **Step 1**: Use a HashMap / Two Pointers to optimize runtime from $O(N^2)$ to $O(N)$.
   - **Step 2**: Iterate through the dataset while maintaining optimal state variables.
   - **Step 3**: Validate test cases and memory bounds.

3. **Placement Tip**:
   - Interviewers look closely at how clearly you communicate time complexity ($O(N)$) vs space complexity ($O(1)$) before writing code.

*(Java backend offline - start it and set GEMINI_API_KEY for live Gemini 2.5 AI responses!)*`;
  }
};
