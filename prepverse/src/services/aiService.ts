export interface ChatMessagePayload {
  role: 'user' | 'ai';
  content: string;
}

export const aiService = {
  async askAIMentor(
    prompt: string,
    history?: ChatMessagePayload[],
    systemInstruction?: string
  ): Promise<string> {
    try {
      const res = await fetch('/api/ai-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, history, systemInstruction })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.response) {
          return data.response;
        }
      }
    } catch {
      // Fallback response
    }

    // Default intelligent mentor response fallback
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

*(Connect your GEMINI_API_KEY in the secrets menu for real-time live Gemini 2.5 AI responses!)*`;
  }
};
