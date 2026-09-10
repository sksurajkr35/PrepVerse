import {
  User,
  Problem,
  AptitudeQuestion,
  MockTest,
  Company,
  CoreCSSubject,
  InterviewQuestion,
  LeaderboardUser,
  Badge,
  StudyPlanItem,
  ResumeData,
  Submission
} from '../types';

export const currentUserMock: User = {
  id: 'usr_001',
  name: 'Surya Rastogi',
  email: 'suryarastogi01@gmail.com',
  college: 'Delhi Technological University (DTU)',
  branch: 'Computer Science & Engineering',
  graduationYear: 2026,
  targetRole: 'Software Development Engineer (SDE-1)',
  preferredLanguage: 'C++',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  prepVerseScore: 742,
  placementReadiness: 74,
  codingRating: 1286,
  problemsSolved: 127,
  mockTestsTaken: 18,
  streakDays: 12,
  xp: 4850,
  level: 14,
  role: 'student',
  githubUrl: 'https://github.com/suryarastogi',
  leetcodeUrl: 'https://leetcode.com/suryarastogi',
  linkedinUrl: 'https://linkedin.com/in/suryarastogi',
  codechefUrl: 'https://codechef.com/users/suryarastogi'
};

// 50 Realistic DSA Problems
export const mockProblems: Problem[] = [
  {
    id: 'p1',
    title: 'Two Sum',
    difficulty: 'Easy',
    acceptanceRate: 49.2,
    topic: 'Arrays',
    companies: ['Amazon', 'Google', 'Microsoft', 'Adobe', 'TCS'],
    status: 'Solved',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    hints: ['A really brute force way would be to search for all possible pairs, O(N^2).', 'Can we use a hash map to look up complements in O(1) time?'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(N)',
    starterCode: {
      'cpp': '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for (int i = 0; i < nums.size(); ++i) {\n            int comp = target - nums[i];\n            if (mp.count(comp)) return {mp[comp], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};',
      'python': 'class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []',
      'java': 'import java.util.HashMap;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}',
      'javascript': 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}'
    }
  },
  {
    id: 'p2',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    acceptanceRate: 54.1,
    topic: 'Arrays',
    companies: ['Amazon', 'Microsoft', 'Flipkart', 'Infosys'],
    status: 'Solved',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the i-th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' }
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    hints: ['Keep track of the minimum price seen so far as you iterate through the array.'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    starterCode: {
      'cpp': '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minPrice = INT_MAX, maxProfit = 0;\n        for (int price : prices) {\n            minPrice = min(minPrice, price);\n            maxProfit = max(maxProfit, price - minPrice);\n        }\n        return maxProfit;\n    }\n};',
      'python': 'class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        min_p, max_p = float("inf"), 0\n        for p in prices:\n            min_p = min(min_p, p)\n            max_p = max(max_p, p - min_p)\n        return max_p'
    }
  },
  {
    id: 'p3',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    acceptanceRate: 40.5,
    topic: 'Stack',
    companies: ['Google', 'Adobe', 'TCS', 'Wipro'],
    status: 'Solved',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    examples: [
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only ()[]{}'],
    hints: ['Use a stack data structure to push open brackets and match closed ones.'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(N)',
    starterCode: {
      'cpp': '#include <string>\n#include <stack>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for(char c : s) {\n            if(c==\'(\' || c==\'{\'|| c==\'[\') st.push(c);\n            else {\n                if(st.empty()) return false;\n                if(c==\')\' && st.top()!=\'(\') return false;\n                if(c==\'}\' && st.top()!=\'{\') return false;\n                if(c==\']\' && st.top()!=\'[\') return false;\n                st.pop();\n            }\n        }\n        return st.empty();\n    }\n};'
    }
  },
  {
    id: 'p4',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    acceptanceRate: 72.8,
    topic: 'Linked List',
    companies: ['Amazon', 'Microsoft', 'Cognizant', 'Accenture'],
    status: 'Solved',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }
    ],
    constraints: ['The number of nodes in the list is in the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    hints: ['Iteratively maintain prev, curr, and next pointers.'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    starterCode: {
      'cpp': '/** Definition for singly-linked list struct ListNode { int val; ListNode *next; }; */\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode* prev = nullptr;\n        ListNode* curr = head;\n        while (curr) {\n            ListNode* nextNode = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = nextNode;\n        }\n        return prev;\n    }\n};'
    }
  },
  {
    id: 'p5',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    acceptanceRate: 50.3,
    topic: 'Dynamic Programming',
    companies: ['Google', 'Amazon', 'Walmart', 'Microsoft'],
    status: 'Solved',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum (Kadanes Algorithm).',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: ['Kadane Algorithm: currSum = max(num, currSum + num).'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    starterCode: {
      'cpp': '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int maxSoFar = nums[0], curr = nums[0];\n        for (size_t i = 1; i < nums.size(); ++i) {\n            curr = max(nums[i], curr + nums[i]);\n            maxSoFar = max(maxSoFar, curr);\n        }\n        return maxSoFar;\n    }\n};'
    }
  },
  {
    id: 'p6',
    title: 'Number of Islands',
    difficulty: 'Medium',
    acceptanceRate: 56.4,
    topic: 'Graphs',
    companies: ['Amazon', 'Google', 'Oracle', 'Capgemini'],
    status: 'Attempted',
    description: 'Given an m x n 2D binary grid grid which represents a map of 1s (land) and 0s (water), return the number of islands.',
    examples: [
      { input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2' }
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300'],
    hints: ['Run BFS/DFS from every unvisited 1 and mark connected 1s as visited.'],
    expectedTimeComplexity: 'O(M * N)',
    expectedSpaceComplexity: 'O(M * N)',
    starterCode: {
      'cpp': '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write DFS / BFS traversal here\n        return 0;\n    }\n};'
    }
  },
  {
    id: 'p7',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    acceptanceRate: 52.0,
    topic: 'Dynamic Programming',
    companies: ['Adobe', 'Infosys', 'TCS', 'Deloitte'],
    status: 'Solved',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' }
    ],
    constraints: ['1 <= n <= 45'],
    hints: ['This is equivalent to the Fibonacci number sequence.'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    starterCode: {
      'cpp': 'class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; ++i) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n};'
    }
  },
  {
    id: 'p8',
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    acceptanceRate: 58.7,
    topic: 'Dynamic Programming',
    companies: ['Amazon', 'Microsoft', 'Samsung', 'IBM'],
    status: 'Unsolved',
    description: 'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.',
    examples: [
      { input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: 'LCS is "ace"' }
    ],
    constraints: ['1 <= text1.length, text2.length <= 1000'],
    hints: ['2D DP table where dp[i][j] stores LCS length of text1[0..i-1] and text2[0..j-1].'],
    expectedTimeComplexity: 'O(M * N)',
    expectedSpaceComplexity: 'O(M * N)',
    starterCode: {
      'cpp': '#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int longestCommonSubsequence(string text1, string text2) {\n        int m = text1.size(), n = text2.size();\n        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n        for (int i = 1; i <= m; ++i) {\n            for (int j = 1; j <= n; ++j) {\n                if (text1[i-1] == text2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];\n                else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);\n            }\n        }\n        return dp[m][n];\n    }\n};'
    }
  },
  {
    id: 'p9',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    acceptanceRate: 64.2,
    topic: 'Trees',
    companies: ['Amazon', 'Google', 'Microsoft', 'Flipkart'],
    status: 'Solved',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level).',
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }
    ],
    constraints: ['Number of nodes is in range [0, 2000]'],
    hints: ['Use a Queue for Breadth-First Search (BFS). Track queue size per level.'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(N)',
    starterCode: {
      'cpp': '#include <vector>\n#include <queue>\nusing namespace std;\n\nstruct TreeNode { int val; TreeNode *left, *right; };\nclass Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        vector<vector<int>> res;\n        if(!root) return res;\n        queue<TreeNode*> q;\n        q.push(root);\n        while(!q.empty()) {\n            int sz = q.size();\n            vector<int> level;\n            for(int i=0; i<sz; ++i){\n                TreeNode* node = q.front(); q.pop();\n                level.push_back(node->val);\n                if(node->left) q.push(node->left);\n                if(node->right) q.push(node->right);\n            }\n            res.push_back(level);\n        }\n        return res;\n    }\n};'
    }
  },
  {
    id: 'p10',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    acceptanceRate: 33.8,
    topic: 'Sliding Window',
    companies: ['Amazon', 'Adobe', 'Google', 'Microsoft', 'TCS'],
    status: 'Attempted',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    hints: ['Use Sliding Window with Two Pointers and a hash set or last seen position map.'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(min(M, N))',
    starterCode: {
      'cpp': '#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char, int> lastSeen;\n        int maxLen = 0, left = 0;\n        for(int right = 0; right < s.length(); ++right) {\n            if(lastSeen.count(s[right]) && lastSeen[s[right]] >= left) {\n                left = lastSeen[s[right]] + 1;\n            }\n            lastSeen[s[right]] = right;\n            maxLen = max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n};'
    }
  }
];

// Generate additional 40 items dynamically to reach 50 DSA problems
const extraTopics = ['Trees', 'Graphs', 'Dynamic Programming', 'Strings', 'Linked List', 'Hashing', 'Sorting', 'Trie', 'Bit Manipulation', 'Two Pointers', 'Prefix Sum', 'Greedy', 'Heap'];
const extraCompanies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Salesforce', 'Goldman Sachs', 'TCS', 'Infosys', 'Wipro', 'Adobe', 'Oracle', 'Paytm'];

for (let i = 11; i <= 50; i++) {
  const topic = extraTopics[i % extraTopics.length];
  const difficulty: 'Easy' | 'Medium' | 'Hard' = i % 3 === 0 ? 'Hard' : i % 2 === 0 ? 'Medium' : 'Easy';
  mockProblems.push({
    id: `p${i}`,
    title: `${topic} Problem ${i}: ${difficulty === 'Hard' ? 'Advanced' : difficulty === 'Medium' ? 'Optimal' : 'Basic'} Strategy`,
    difficulty,
    acceptanceRate: Math.floor(Math.random() * 40) + 35,
    topic,
    companies: [extraCompanies[i % extraCompanies.length], extraCompanies[(i + 3) % extraCompanies.length]],
    status: i % 4 === 0 ? 'Solved' : i % 5 === 0 ? 'Attempted' : 'Unsolved',
    description: `Solve this fundamental placement problem on ${topic}. Analyze constraints, time complexity and optimize memory footprint.`,
    examples: [
      { input: 'input_data = [1, 2, 3, 4, 5]', output: '15', explanation: 'Cumulative computation of optimal sub-structure.' }
    ],
    constraints: ['1 <= N <= 10^5', '-10^9 <= Value <= 10^9'],
    hints: ['Think about optimal state representation.', 'Can you reduce time complexity using a auxiliary hash map or two pointers?'],
    expectedTimeComplexity: difficulty === 'Hard' ? 'O(N log N)' : 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    starterCode: {
      'cpp': `// C++ Starter Template for ${topic} Problem ${i}\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve(vector<int>& arr) {\n        // Implement your solution\n        return 0;\n    }\n};`
    }
  });
}

// 50 Aptitude Questions (Quant, Logical, Verbal)
export const mockAptitudeQuestions: AptitudeQuestion[] = [
  {
    id: 'apt_1',
    category: 'Quantitative',
    topic: 'Percentage',
    question: 'If the price of a commodity increases by 25%, by what percentage must a household reduce its consumption so that the expenditure remains the same?',
    options: ['15%', '20%', '25%', '30%'],
    correctAnswerIndex: 1,
    explanation: 'Formula: Reduction % = [R / (100 + R)] * 100 = [25 / 125] * 100 = 20%.'
  },
  {
    id: 'apt_2',
    category: 'Quantitative',
    topic: 'Profit & Loss',
    question: 'A trader sells a bicycle at a profit of 10%. Had he bought it at 10% less and sold it for $10 more, he would have gained 25%. Find the cost price of the bicycle.',
    options: ['$400', '$500', '$600', '$800'],
    correctAnswerIndex: 0,
    explanation: 'Let Cost Price = $100x. SP1 = $110x. New CP = $90x. New SP = 1.25 * 90x = 112.5x. Difference: 112.5x - 110x = 2.5x = $10 => x = 4. Cost Price = 100 * 4 = $400.'
  },
  {
    id: 'apt_3',
    category: 'Quantitative',
    topic: 'Time & Work',
    question: 'A can do a piece of work in 12 days and B in 15 days. They work together for 5 days and then B leaves. In how many more days will A finish the remaining work?',
    options: ['3 days', '4 days', '5 days', '2 days'],
    correctAnswerIndex: 0,
    explanation: 'Total work = LCM(12, 15) = 60 units. A speed = 5 units/day, B speed = 4 units/day. Combined in 5 days = 9 * 5 = 45 units. Remaining = 15 units. A takes 15 / 5 = 3 days.'
  },
  {
    id: 'apt_4',
    category: 'Logical',
    topic: 'Coding-Decoding',
    question: 'If "COMPUTER" is written as "RFUVQNPC", how is "MEDICINE" written in that code?',
    options: ['EOJDEJFM', 'MFEJDJOE', 'EOJDJEFM', 'EOJDJEFN'],
    correctAnswerIndex: 2,
    explanation: 'First and last letters are reversed: M becomes E and E becomes M. Inner letters are shifted +1 and reversed.'
  },
  {
    id: 'apt_5',
    category: 'Verbal',
    topic: 'Synonyms',
    question: 'Select the word that is most nearly SIMILAR in meaning to "PRAGMATIC":',
    options: ['Theoretical', 'Practical', 'Idealistic', 'Romantic'],
    correctAnswerIndex: 1,
    explanation: 'Pragmatic means dealing with things sensibly and realistically based on practical considerations rather than theoretical ones.'
  }
];

// Add additional mock aptitude questions dynamically
const quantTopics = ['Percentage', 'Profit & Loss', 'Time & Work', 'Time Speed Distance', 'Simple Interest', 'Compound Interest', 'Ratio', 'Probability', 'Permutation'];
const logicalTopics = ['Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Syllogism', 'Seating Arrangement', 'Series'];
const verbalTopics = ['Grammar', 'Vocabulary', 'Synonyms', 'Reading Comprehension', 'Error Detection'];

for (let i = 6; i <= 50; i++) {
  const category: 'Quantitative' | 'Logical' | 'Verbal' = i % 3 === 0 ? 'Verbal' : i % 2 === 0 ? 'Logical' : 'Quantitative';
  const topic = category === 'Quantitative' ? quantTopics[i % quantTopics.length] : category === 'Logical' ? logicalTopics[i % logicalTopics.length] : verbalTopics[i % verbalTopics.length];
  mockAptitudeQuestions.push({
    id: `apt_${i}`,
    category,
    topic,
    question: `Practice Question ${i} on ${topic}: If a problem condition holds with parameter k = ${i * 2}, calculate the resultant ratio or logical inference.`,
    options: [`Option A (${i * 5})`, `Option B (${i * 5 + 10})`, `Option C (${i * 5 + 20})`, `Option D (${i * 5 + 30})`],
    correctAnswerIndex: (i % 4),
    explanation: `Step-by-step resolution for ${topic}: Apply the fundamental formula or rule for question ${i}. Option ${String.fromCharCode(65 + (i % 4))} is mathematically correct.`
  });
}

// 10 Mock Tests
export const mockTestsList: MockTest[] = [
  {
    id: 'test_1',
    title: 'Full Placement Diagnostic Test',
    type: 'Full Placement',
    questionsCount: 30,
    durationMinutes: 45,
    difficulty: 'Medium',
    bestScore: 82,
    totalMarks: 100,
    description: 'Comprehensive test covering Quantitative Aptitude, Logical Reasoning, Verbal Ability, Core CS, and 2 Coding questions.',
    questions: [
      { id: 'q1', text: 'If 3x + 5y = 45 and x = 5, what is the value of y?', options: ['4', '5', '6', '7'], correctIndex: 2, type: 'mcq' },
      { id: 'q2', text: 'Which data structure works on LIFO principle?', options: ['Queue', 'Stack', 'Array', 'Linked List'], correctIndex: 1, type: 'mcq' },
      { id: 'q3', text: 'Write a program to check if an array contains duplicates.', type: 'code', codeStarter: '#include <vector>\nusing namespace std;\n\nbool containsDuplicate(vector<int>& nums) {\n    // code here\n}' }
    ]
  },
  {
    id: 'test_2',
    title: 'TCS NQT National Qualifier Mock Test',
    type: 'Company',
    companyName: 'TCS',
    questionsCount: 40,
    durationMinutes: 60,
    difficulty: 'Medium',
    bestScore: 78,
    totalMarks: 100,
    description: 'Simulates the exact TCS NQT pattern including Foundation & Advanced Cognitive + Technical section.',
    questions: [
      { id: 'q1', text: 'What is the worst-case time complexity of Quick Sort?', options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(2^N)'], correctIndex: 2, type: 'mcq' }
    ]
  },
  {
    id: 'test_3',
    title: 'Amazon SDE-1 OA Speed Test',
    type: 'Coding',
    companyName: 'Amazon',
    questionsCount: 2,
    durationMinutes: 70,
    difficulty: 'Hard',
    bestScore: 65,
    totalMarks: 100,
    description: 'Real Amazon online assessment coding questions with strict time limit and test cases.',
    questions: []
  },
  {
    id: 'test_4',
    title: 'Infosys InfyTQ Technical & Coding Test',
    type: 'Technical',
    companyName: 'Infosys',
    questionsCount: 25,
    durationMinutes: 45,
    difficulty: 'Medium',
    bestScore: 88,
    totalMarks: 100,
    description: 'Focuses on Python/DBMS/Java core technical questions and 2 hands-on coding tasks.',
    questions: []
  },
  {
    id: 'test_5',
    title: 'Aptitude & Speed Calculation Sprint',
    type: 'Aptitude',
    questionsCount: 30,
    durationMinutes: 30,
    difficulty: 'Easy',
    bestScore: 92,
    totalMarks: 100,
    description: 'Rapid-fire quantitative speed test designed to improve accuracy under high pressure.',
    questions: []
  }
];

// 15 Companies
export const mockCompanies: Company[] = [
  {
    id: 'comp_amazon',
    name: 'Amazon',
    tier: 'Super Dream',
    averagePackage: '28.5 LPA',
    overview: 'Global e-commerce and cloud giant (AWS). High bar for Data Structures, Algorithms, System Design, and Amazon Leadership Principles.',
    hiringProcess: ['Online Assessment (OA 2 Coding + Behavioral)', 'Technical Interview Round 1 (DSA)', 'Technical Interview Round 2 (System Design/Projects)', 'Bar Raiser Round (Leadership Principles + Architecture)'],
    examPattern: [
      { section: 'Coding Assessment', questionsCount: 2, timeMinutes: 70 },
      { section: 'Work Simulation', questionsCount: 15, timeMinutes: 20 },
      { section: 'Leadership Principles Survey', questionsCount: 15, timeMinutes: 15 }
    ],
    importantTopics: ['Trees & Graphs', 'Dynamic Programming', 'Sliding Window', 'Object Oriented Design', 'LRU Cache'],
    technicalQuestions: [
      'Design LRU Cache with O(1) get and put.',
      'Lowest Common Ancestor in a Binary Tree.',
      'Course Schedule II (Topological Sort).'
    ],
    hrQuestions: [
      'Tell me about a time you faced a tough technical challenge and how you solved it.',
      'Give an example of when you had to take ownership of a project under tight deadlines.'
    ],
    rolesHiring: ['SDE-1', 'AWS Cloud Engineer', 'Data Engineer']
  },
  {
    id: 'comp_google',
    name: 'Google',
    tier: 'Super Dream',
    averagePackage: '32.0 LPA',
    overview: 'World leader in search, cloud, AI, and Android. Expects extreme algorithmic mastery, optimal time/space complexity, and clean modular code.',
    hiringProcess: ['Online Assessment (Google Girl Hackathon / OA)', 'Technical Round 1 (Data Structures)', 'Technical Round 2 (Algorithms & Graph Theory)', 'Technical Round 3 (Advanced DP/Trees)', 'Googliness Round'],
    examPattern: [
      { section: 'Algorithmic Coding', questionsCount: 2, timeMinutes: 60 }
    ],
    importantTopics: ['Graphs (Dijkstra, BFS, DFS)', 'Dynamic Programming', 'Segment Trees & Disjoint Set Union', 'Trie', 'Bit Manipulation'],
    technicalQuestions: ['Find median in a running stream of integers.', 'Word Ladder II.', 'Alien Dictionary.'],
    hrQuestions: ['Tell me about a time you disagreed with a team decision and reached consensus.'],
    rolesHiring: ['Software Engineer (SWE)', 'Site Reliability Engineer']
  },
  {
    id: 'comp_microsoft',
    name: 'Microsoft',
    tier: 'Super Dream',
    averagePackage: '26.0 LPA',
    overview: 'Tech giant behind Azure, Windows, Office 365, and LinkedIn. Evaluates core computer science, trees, linked lists, and OS/DBMS fundamentals.',
    hiringProcess: ['Online Test (Codility 3 questions)', 'Technical Interview 1', 'Technical Interview 2', 'AA (As Appropriate) Director Round'],
    examPattern: [{ section: 'Codility OA', questionsCount: 3, timeMinutes: 75 }],
    importantTopics: ['Linked List & Binary Search', 'Binary Tree Traversal', 'Operating Systems (Concurrency)', 'DBMS Indexing'],
    technicalQuestions: ['Serialize and Deserialize a Binary Tree.', 'Clone a Linked List with Random Pointer.'],
    hrQuestions: ['Why Microsoft? How do you keep learning new technologies?'],
    rolesHiring: ['Software Engineer', 'Data Scientist', 'Cloud Solution Architect']
  },
  {
    id: 'comp_tcs',
    name: 'TCS',
    tier: 'Service',
    averagePackage: '3.6 - 7.0 LPA',
    overview: 'India largest IT services multinatonal. Offers TCS Ninja (3.6 LPA) and TCS Digital (7.0 LPA) roles through TCS NQT.',
    hiringProcess: ['TCS NQT National Test (Foundation + Advanced)', 'Technical Interview', 'HR & Managerial Interview'],
    examPattern: [
      { section: 'Numerical Ability', questionsCount: 20, timeMinutes: 25 },
      { section: 'Reasoning Ability', questionsCount: 20, timeMinutes: 25 },
      { section: 'Verbal Ability', questionsCount: 25, timeMinutes: 25 },
      { section: 'Advanced Coding', questionsCount: 2, timeMinutes: 45 }
    ],
    importantTopics: ['Arrays & Strings', 'Basic Math / Number Theory', 'Aptitude & Percentages', 'OOP Concepts'],
    technicalQuestions: ['Check if a number is Armstrong or Prime.', 'Reverse a string without string library functions.'],
    hrQuestions: ['Are you willing to relocate?', 'Tell me about your final year project.'],
    rolesHiring: ['System Engineer (Ninja)', 'Digital Software Developer']
  },
  {
    id: 'comp_infosys',
    name: 'Infosys',
    tier: 'Service',
    averagePackage: '3.6 - 9.5 LPA',
    overview: 'Offers System Engineer (3.6 LPA), Specialist Programmer (8.0 LPA), and Power Programmer (9.5 LPA) through InfyTQ and HackWithInfy.',
    hiringProcess: ['InfyTQ Certification Exam / HackWithInfy', 'Technical Interview', 'HR Interview'],
    examPattern: [
      { section: 'Python/DBMS MCQs', questionsCount: 20, timeMinutes: 30 },
      { section: 'Hands-on Coding', questionsCount: 2, timeMinutes: 60 }
    ],
    importantTopics: ['DBMS SQL Queries', 'Python / Java OOP', 'Greedy & DP basics'],
    technicalQuestions: ['Write SQL query using JOINs and GROUP BY.', 'Find longest palindromic substring.'],
    hrQuestions: ['Explain how you handled a team conflict during your project.'],
    rolesHiring: ['System Engineer', 'Specialist Programmer', 'Power Programmer']
  },
  {
    id: 'comp_accenture',
    name: 'Accenture',
    tier: 'Service',
    averagePackage: '4.5 - 6.5 LPA',
    overview: 'Global professional services and consulting firm hiring Associate Software Engineers (ASE) and Advanced ASE (AASE).',
    hiringProcess: ['Cognitive & Technical Assessment', 'Coding Assessment', 'Communication Test', 'One-on-One Interview'],
    examPattern: [
      { section: 'Cognitive & Technical', questionsCount: 90, timeMinutes: 90 },
      { section: 'Coding', questionsCount: 2, timeMinutes: 45 }
    ],
    importantTopics: ['Pseudo Code & Logic', 'Networking Basics', 'Common Coding Algorithms'],
    technicalQuestions: ['Pseudo code output tracing.', 'Count occurrences of characters in a string.'],
    hrQuestions: ['How do you prioritize multiple tasks under pressure?'],
    rolesHiring: ['Associate Software Engineer', 'Advanced ASE']
  },
  {
    id: 'comp_cognizant',
    name: 'Cognizant',
    tier: 'Service',
    averagePackage: '4.0 - 6.7 LPA',
    overview: 'Hires GenC, GenC Elevate, and GenC Pro profiles.',
    hiringProcess: ['Aptitude & Communication Test', 'Skill-based Technical Round', 'HR Round'],
    examPattern: [{ section: 'Quantitative & Logical', questionsCount: 40, timeMinutes: 45 }],
    importantTopics: ['Automata Fix', 'Data Interpretation', 'C/Java Basics'],
    technicalQuestions: ['Explain static vs dynamic binding.', 'Swap two variables without third variable.'],
    hrQuestions: ['Where do you see yourself in 3 years?'],
    rolesHiring: ['GenC Developer', 'GenC Elevate Programmer']
  },
  {
    id: 'comp_wipro',
    name: 'Wipro',
    tier: 'Service',
    averagePackage: '3.5 - 6.5 LPA',
    overview: 'Elite NTH (National Talent Hunt) hiring for Project Engineer role.',
    hiringProcess: ['Wipro NLTH Test (Aptitude + Essay + Coding)', 'Technical Interview', 'HR Interview'],
    examPattern: [{ section: 'Aptitude & Coding', questionsCount: 30, timeMinutes: 60 }],
    importantTopics: ['Basic Data Structures', 'Written Communication', 'Aptitude'],
    technicalQuestions: ['Explain Memory Allocation in C.', 'Check Palindrome string.'],
    hrQuestions: ['Why Wipro over other IT companies?'],
    rolesHiring: ['Project Engineer']
  },
  {
    id: 'comp_deloitte',
    name: 'Deloitte',
    tier: 'Product',
    averagePackage: '7.6 LPA',
    overview: 'Big 4 consulting giant hiring Analyst / Tech Consultant roles.',
    hiringProcess: ['Online Assessment (Quant + Reasoning + Verbal + Coding)', 'Technical Round', 'HR / Director Round'],
    examPattern: [{ section: 'Cognitive & Programming', questionsCount: 50, timeMinutes: 60 }],
    importantTopics: ['SQL & Database Design', 'Object Oriented Programming', 'Aptitude'],
    technicalQuestions: ['Explain ACID properties in DBMS.', 'Diff between SQL and NoSQL.'],
    hrQuestions: ['Describe a situation where you demonstrated leadership.'],
    rolesHiring: ['Tech Analyst', 'Cyber Risk Consultant']
  },
  {
    id: 'comp_adobe',
    name: 'Adobe',
    tier: 'Super Dream',
    averagePackage: '24.0 LPA',
    overview: 'Creates Photoshop, PDF, Creative Cloud. Strong focus on graphics, performance, geometry math, and DSA.',
    hiringProcess: ['Online Assessment (2 Coding + Core CS MCQs)', 'Technical Interview 1', 'Technical Interview 2', 'HR Round'],
    examPattern: [{ section: 'Coding & MCQs', questionsCount: 15, timeMinutes: 60 }],
    importantTopics: ['Matrices & Geometry Math', 'Tree Traversals', 'Strings & DP'],
    technicalQuestions: ['Rotate an image 90 degrees in-place.', 'Intersection point of two linked lists.'],
    hrQuestions: ['Why Adobe? Which Adobe product do you use most?'],
    rolesHiring: ['Member of Technical Staff (MTS)']
  },
  {
    id: 'comp_oracle',
    name: 'Oracle',
    tier: 'Dream',
    averagePackage: '18.0 LPA',
    overview: 'Cloud and Database titan. Focuses on DBMS, C++, Java internals, and operating systems.',
    hiringProcess: ['Online Assessment (Aptitude + Core CS + Coding)', 'Technical Round 1', 'Technical Round 2', 'HR Round'],
    examPattern: [{ section: 'Aptitude & Technical', questionsCount: 60, timeMinutes: 90 }],
    importantTopics: ['DBMS Indexing & B+ Trees', 'Multithreading & OS', 'C++ Pointers'],
    technicalQuestions: ['Explain Normalization (1NF to 3NF/BCNF).', 'Detect Deadlock in OS.'],
    hrQuestions: ['What motivates you in software engineering?'],
    rolesHiring: ['Applications Developer', 'Cloud Infrastructure Engineer']
  },
  {
    id: 'comp_ibm',
    name: 'IBM',
    tier: 'Dream',
    averagePackage: '11.0 LPA',
    overview: 'Enterprise AI and Cloud services leader (Watson, RedHat).',
    hiringProcess: ['IBM Cognitive Assessment Test (Games)', 'Coding Assessment', 'Interview'],
    examPattern: [{ section: 'Cognitive Mini Games + Coding', questionsCount: 6, timeMinutes: 60 }],
    importantTopics: ['Problem Solving Logic', 'Python / Cloud', 'Data Structures'],
    technicalQuestions: ['Explain REST API design principles.', 'Implement Stack using Queues.'],
    hrQuestions: ['How do you stay updated with emerging tech like AI?'],
    rolesHiring: ['Associate System Engineer', 'Cloud Developer']
  },
  {
    id: 'comp_flipkart',
    name: 'Flipkart',
    tier: 'Super Dream',
    averagePackage: '22.0 LPA',
    overview: 'India major e-commerce pioneer. Asks Machine Coding rounds and high-level DSA.',
    hiringProcess: ['Online Coding Assessment', 'Machine Coding Round (Design & Code an app in 2 hrs)', 'Problem Solving / DSA Round', 'Hiring Manager Round'],
    examPattern: [{ section: 'Coding OA', questionsCount: 3, timeMinutes: 90 }],
    importantTopics: ['Low Level System Design (LLD)', 'Object Oriented Design', 'DP & Graphs'],
    technicalQuestions: ['Design a Parking Lot System.', 'Find minimum window substring.'],
    hrQuestions: ['Describe how you handled a project scope change midway.'],
    rolesHiring: ['SDE-1']
  },
  {
    id: 'comp_walmart',
    name: 'Walmart',
    tier: 'Super Dream',
    averagePackage: '20.0 LPA',
    overview: 'Walmart Global Tech India. Strong emphasis on Java, Spring Boot, Microservices, and DSA.',
    hiringProcess: ['Walmart CodeFest / OA', 'Technical Round 1', 'Technical Round 2', 'HR Round'],
    examPattern: [{ section: 'Coding Assessment', questionsCount: 2, timeMinutes: 60 }],
    importantTopics: ['Java Collections & Memory', 'System Design basics', 'Trees & Dynamic Programming'],
    technicalQuestions: ['Implement LRU Cache.', 'Explain Garbage Collection in Java.'],
    hrQuestions: ['What are your strengths and how do they fit Walmart culture?'],
    rolesHiring: ['SDE-1', 'Data Analyst']
  },
  {
    id: 'comp_samsung',
    name: 'Samsung',
    tier: 'Dream',
    averagePackage: '16.0 LPA',
    overview: 'Samsung R&D Institute. Famous for its 3-hour 1-problem Advanced SW Competency Test (DFS/BFS/Backtracking).',
    hiringProcess: ['Samsung Software Competency Test (3 hours, 1 problem)', 'Technical Interview', 'HR Interview'],
    examPattern: [{ section: 'Advanced SW Test', questionsCount: 1, timeMinutes: 180 }],
    importantTopics: ['BFS / DFS Grid Exploration', 'Backtracking', 'Bitmasking', 'Recursion'],
    technicalQuestions: ['Pipe Connection / Grid Traversal problem with backtracking.'],
    hrQuestions: ['Why Samsung R&D?'],
    rolesHiring: ['Software Engineer']
  }
];

// 9 Core CS Subjects
export const mockCoreCSSubjects: CoreCSSubject[] = [
  {
    id: 'dbms',
    name: 'Database Management Systems',
    shortName: 'DBMS',
    iconName: 'Database',
    progressPercent: 78,
    description: 'Relational model, SQL queries, Normalization, ACID properties, Indexing (B-Trees), and Transactions.',
    topics: [
      {
        id: 't_sql',
        title: 'SQL Queries & Joins',
        notes: 'INNER JOIN returns matching rows in both tables. LEFT JOIN returns all from left + matching from right. GROUP BY is used with aggregate functions like COUNT, SUM, AVG.',
        keyPoints: ['HAVING clause filters groups after aggregation.', 'Subqueries can be correlated or non-correlated.']
      },
      {
        id: 't_acid',
        title: 'ACID Properties & Transactions',
        notes: 'Atomicity (All or nothing), Consistency (Valid state transition), Isolation (Concurrent transactions do not collide), Durability (Committed data persists).',
        keyPoints: ['Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.', '2-Phase Locking (2PL) guarantees serializability.']
      },
      {
        id: 't_norm',
        title: 'Database Normalization',
        notes: '1NF: Atomic values. 2NF: No partial dependency. 3NF: No transitive dependency. BCNF: For every functional dependency X -> Y, X must be a super key.',
        keyPoints: ['Reduces data redundancy.', 'Prevents Insertion, Deletion, and Update anomalies.']
      }
    ],
    mcqs: [
      {
        id: 'm_1',
        category: 'Quantitative',
        topic: 'DBMS',
        question: 'Which of the following guarantees that a database transaction is completely executed or not executed at all?',
        options: ['Consistency', 'Atomicity', 'Isolation', 'Durability'],
        correctAnswerIndex: 1,
        explanation: 'Atomicity ensures "all or nothing" execution of transactions.'
      }
    ],
    interviewQuestions: [
      'What is the difference between WHERE and HAVING clause in SQL?',
      'Explain B-Trees and B+ Trees indexing mechanism.',
      'What is the difference between Primary Key and Unique Key?'
    ]
  },
  {
    id: 'os',
    name: 'Operating Systems',
    shortName: 'OS',
    iconName: 'Cpu',
    progressPercent: 65,
    description: 'Process management, Multithreading, CPU Scheduling, Deadlocks, Memory Management, Virtual Memory, and Paging.',
    topics: [
      {
        id: 't_sched',
        title: 'CPU Scheduling Algorithms',
        notes: 'FCFS, SJF (Shortest Job First), Round Robin (Time quantum based), Priority Scheduling.',
        keyPoints: ['SJF gives minimum average waiting time.', 'Round Robin prevents starvation with proper time quantum.']
      },
      {
        id: 't_deadlock',
        title: 'Deadlocks & Bankers Algorithm',
        notes: '4 Necessary Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.',
        keyPoints: ['Bankers algorithm is used for Deadlock Avoidance.', 'Resource Allocation Graphs detect deadlocks.']
      }
    ],
    mcqs: [],
    interviewQuestions: [
      'What is Process vs Thread?',
      'Explain Paging and Thrashing in OS.',
      'How does Semaphore differ from Mutex?'
    ]
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    shortName: 'CN',
    iconName: 'Network',
    progressPercent: 58,
    description: 'OSI & TCP/IP models, HTTP/HTTPS, TCP vs UDP, IP Addressing, Subnetting, Routing Algorithms, and DNS.',
    topics: [
      {
        id: 't_tcp',
        title: 'TCP vs UDP Protocols',
        notes: 'TCP is connection-oriented, reliable, guarantees packet delivery via 3-Way Handshake. UDP is connectionless, faster, unreliable (ideal for video streaming).',
        keyPoints: ['TCP 3-Way Handshake: SYN -> SYN-ACK -> ACK.', 'TCP Flow control uses Sliding Window.']
      }
    ],
    mcqs: [],
    interviewQuestions: [
      'What happens when you type www.google.com in your browser?',
      'Explain IPv4 vs IPv6 addressing.',
      'What is the role of ARP and DNS?'
    ]
  },
  {
    id: 'oop',
    name: 'Object Oriented Programming',
    shortName: 'OOP',
    iconName: 'Code',
    progressPercent: 82,
    description: 'Encapsulation, Abstraction, Inheritance, Polymorphism, Solid Principles, and Design Patterns.',
    topics: [
      {
        id: 't_solid',
        title: 'SOLID Design Principles',
        notes: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
        keyPoints: ['Ensures code maintainability and scalability.']
      }
    ],
    mcqs: [],
    interviewQuestions: [
      'What is the difference between Function Overloading and Overriding?',
      'Explain Virtual Functions and VTable in C++.',
      'What is Abstract Class vs Interface?'
    ]
  }
];

// Add remaining core CS subjects
['Computer Organization & Architecture', 'Software Engineering', 'Theory of Computation', 'Compiler Design', 'Cyber Security'].forEach((subjName, idx) => {
  const short = subjName.split(' ').map(w => w[0]).join('');
  mockCoreCSSubjects.push({
    id: `subj_${idx + 5}`,
    name: subjName,
    shortName: short,
    iconName: 'Terminal',
    progressPercent: Math.floor(Math.random() * 40) + 40,
    description: `Core fundamentals, theoretical foundations and placement interview topics for ${subjName}.`,
    topics: [
      { id: `top_${idx}`, title: `${subjName} Fundamentals`, notes: `Key notes and formulas for placement preparation in ${subjName}.`, keyPoints: ['Important exam point 1', 'Important interview concept 2'] }
    ],
    mcqs: [],
    interviewQuestions: [`Explain key principles of ${subjName}.`]
  });
});

// 50 Interview Questions (Technical & HR)
export const mockInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'iq_1',
    category: 'HR',
    subjectOrRole: 'HR & Cultural',
    question: 'Tell me about yourself.',
    sampleAnswer: 'Start with your current academic background (B.Tech CSE at DTU), highlight 2 key technical accomplishments (e.g. 120+ DSA problems solved, full-stack project), share internship or club leadership experiences, and conclude with why you are excited for this specific SDE role.',
    tips: ['Keep it under 90 seconds.', 'Focus on present academic background, technical proof, and passion.'],
    difficulty: 'Easy'
  },
  {
    id: 'iq_2',
    category: 'HR',
    subjectOrRole: 'HR & Cultural',
    question: 'Why should we hire you?',
    sampleAnswer: 'I bring strong problem-solving skills backed by my 1286 coding rating, hands-on experience building production React/Node projects, and a proven ability to learn quickly under pressure as demonstrated in hackathons.',
    tips: ['Align your top 3 strengths directly with the job description.'],
    difficulty: 'Easy'
  },
  {
    id: 'iq_3',
    category: 'Technical',
    subjectOrRole: 'C++',
    question: 'What is the difference between stack and heap memory allocation?',
    sampleAnswer: 'Stack memory allocation is fast, automatic, managed by the OS compiler (LIFO order), and stores local variables. Heap memory is dynamic (using new/malloc), larger, manually freed (delete/free or Garbage Collector), and prone to memory leaks if unmanaged.',
    tips: ['Mention pointers and RAII / smart pointers in C++.'],
    difficulty: 'Medium'
  },
  {
    id: 'iq_4',
    category: 'Technical',
    subjectOrRole: 'DBMS',
    question: 'What is a Deadlock in DBMS and how is it prevented?',
    sampleAnswer: 'A Deadlock is a situation where two or more transactions are waiting indefinitely for locks held by each other. It is prevented using Wait-Die / Wound-Wait schemes or timestamp-based protocol.',
    tips: ['Draw or explain resource allocation collision.'],
    difficulty: 'Medium'
  },
  {
    id: 'iq_5',
    category: 'Behavioral',
    subjectOrRole: 'Behavioral',
    question: 'Describe a time when you faced a conflict in a team project.',
    sampleAnswer: 'Use the STAR method (Situation, Task, Action, Result). Describe how you listened actively, looked at objective data/benchmarks, compromised, and successfully delivered the project ahead of deadline.',
    tips: ['Focus on resolution and personal maturity, never blame teammates.'],
    difficulty: 'Medium'
  }
];

// Add remaining 45 interview questions
const techs = ['Java', 'Python', 'DSA', 'Operating Systems', 'Computer Networks', 'System Design', 'HR', 'Behavioral'];
for (let i = 6; i <= 50; i++) {
  const cat: 'Technical' | 'HR' | 'Behavioral' | 'Project' = i % 4 === 0 ? 'HR' : i % 3 === 0 ? 'Behavioral' : 'Technical';
  const sub = techs[i % techs.length];
  mockInterviewQuestions.push({
    id: `iq_${i}`,
    category: cat,
    subjectOrRole: sub,
    question: `Placement Question ${i}: Explain the internal working mechanism of ${sub} feature #${i}?`,
    sampleAnswer: `Clear structured answer for ${sub}: Start with definition, state key trade-offs, explain time/space complexity, and give a real-world example.`,
    tips: ['Speak clearly.', 'State assumptions upfront.'],
    difficulty: i % 3 === 0 ? 'Hard' : 'Medium'
  });
}

// Leaderboard Users
export const mockLeaderboardUsers: LeaderboardUser[] = [
  { rank: 1, id: 'l1', name: 'Aarav Sharma', college: 'IIT Delhi', rating: 2145, problemsSolved: 382, score: 948, avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', badge: 'Grandmaster' },
  { rank: 2, id: 'l2', name: 'Ananya Verma', college: 'IIT Bombay', rating: 2080, problemsSolved: 345, score: 922, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', badge: 'Master' },
  { rank: 3, id: 'l3', name: 'Rohan Gupta', college: 'BITS Pilani', rating: 1982, problemsSolved: 310, score: 895, avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', badge: 'Expert' },
  { rank: 4, id: 'l4', name: 'Sneha Patel', college: 'DTU', rating: 1850, problemsSolved: 278, score: 860, avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80', badge: 'Expert' },
  { rank: 14, id: 'usr_001', name: 'Surya Rastogi', college: 'DTU', rating: 1286, problemsSolved: 127, score: 742, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', badge: 'Intermediate', isCurrentUser: true },
  { rank: 15, id: 'l5', name: 'Vikram Singh', college: 'NSUT', rating: 1275, problemsSolved: 122, score: 738, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', badge: 'Intermediate' }
];

// Badges & Gamification
export const mockBadges: Badge[] = [
  { id: 'b1', title: '7 Day Streak', description: 'Maintained a 7-day continuous study streak.', icon: 'Flame', unlocked: true, unlockedAt: '3 days ago', category: 'streak' },
  { id: 'b2', title: 'First 10 Problems', description: 'Successfully solved 10 DSA coding challenges.', icon: 'Code', unlocked: true, unlockedAt: '2 weeks ago', category: 'problems' },
  { id: 'b3', title: '100 Problems Solved', description: 'Reached the landmark milestone of 100 solved problems!', icon: 'Trophy', unlocked: true, unlockedAt: 'Yesterday', category: 'problems' },
  { id: 'b4', title: 'DSA Master', description: 'Achieve >70% accuracy across all DSA topics.', icon: 'Brain', unlocked: false, category: 'rating' },
  { id: 'b5', title: 'Aptitude Ace', description: 'Score >90% in 3 Aptitude Mock Tests.', icon: 'Target', unlocked: true, unlockedAt: '5 days ago', category: 'test' },
  { id: 'b6', title: 'Mock Test Champion', description: 'Complete 15 full-length placement mock assessments.', icon: 'Award', unlocked: true, unlockedAt: '4 days ago', category: 'test' }
];

// Study Plan Weekly Items
export const mockStudyPlan: StudyPlanItem[] = [
  { id: 'sp1', day: 'Monday', topic: 'Arrays & Two Pointers', category: 'DSA', durationMinutes: 90, completed: true },
  { id: 'sp2', day: 'Monday', topic: 'Percentages & Ratio', category: 'Aptitude', durationMinutes: 45, completed: true },
  { id: 'sp3', day: 'Tuesday', topic: 'Strings & Sliding Window', category: 'DSA', durationMinutes: 90, completed: true },
  { id: 'sp4', day: 'Tuesday', topic: 'DBMS SQL & ACID Properties', category: 'Core CS', durationMinutes: 60, completed: true },
  { id: 'sp5', day: 'Wednesday', topic: 'Linked List Reversal', category: 'DSA', durationMinutes: 90, completed: false },
  { id: 'sp6', day: 'Wednesday', topic: 'Logical Syllogisms', category: 'Aptitude', durationMinutes: 45, completed: false },
  { id: 'sp7', day: 'Thursday', topic: 'Binary Search & BST', category: 'DSA', durationMinutes: 90, completed: false },
  { id: 'sp8', day: 'Friday', topic: 'Graph BFS/DFS & Dijkstra', category: 'DSA', durationMinutes: 120, completed: false },
  { id: 'sp9', day: 'Saturday', topic: 'Full Placement Mock Test', category: 'Interview', durationMinutes: 90, completed: false },
  { id: 'sp10', day: 'Sunday', topic: 'Mock Interview Practice', category: 'Interview', durationMinutes: 60, completed: false }
];

// Resume Data Initial Mock
export const mockResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Surya Rastogi',
    email: 'suryarastogi01@gmail.com',
    phone: '+91 98765 43210',
    location: 'New Delhi, India',
    linkedin: 'linkedin.com/in/suryarastogi',
    github: 'github.com/suryarastogi',
    portfolio: 'prepverse.dev/suryarastogi',
    summary: 'Final-year B.Tech CSE student at DTU with strong foundation in Data Structures, Algorithms (1286 Rating), DBMS, and React/Node full-stack development. Seeking SDE-1 role.'
  },
  education: [
    {
      id: 'e1',
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'Delhi Technological University (DTU)',
      year: '2022 - 2026',
      cgpaOrPercentage: '8.84 CGPA'
    }
  ],
  skills: [
    { category: 'Programming Languages', items: 'C++, Python, JavaScript, TypeScript, SQL, HTML/CSS' },
    { category: 'Core CS', items: 'Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, OOP' },
    { category: 'Web Technologies', items: 'React.js, Express.js, Node.js, Tailwind CSS, REST APIs, Git, Docker' }
  ],
  projects: [
    {
      id: 'p_1',
      title: 'PrepVerse — All-in-One Placement Preparation Universe',
      techStack: 'React, TypeScript, Express, Tailwind CSS, Gemini AI API',
      description: [
        'Architected a full-stack placement portal serving 1,000+ engineering students with real-time analytics.',
        'Integrated AI Mentor using Gemini 2.5 Flash for code debugging and mock interview feedback.',
        'Engineered online code execution service with support for 11 programming languages and test case evaluations.'
      ]
    }
  ],
  experience: [
    {
      id: 'exp_1',
      role: 'Software Engineer Intern',
      company: 'TechCorp Solutions',
      duration: 'May 2025 - July 2025',
      highlights: [
        'Optimized PostgreSQL query latency by 35% through proper index configuration.',
        'Developed 12 RESTful API endpoints in Express.js with JWT authentication.'
      ]
    }
  ],
  achievements: [
    'Global Rank 342 out of 18,000+ participants in CodeChef Starters 120.',
    'Winner of DTU Hackathon 2025 among 120 competing teams.',
    'Solved 120+ problems on LeetCode with 1286 rating.'
  ]
};

// Recent Submissions
export const mockSubmissions: Submission[] = [
  { id: 'sub_1', problemId: 'p1', problemTitle: 'Two Sum', language: 'C++', status: 'Accepted', runtime: '42 ms', memory: '12.4 MB', submittedAt: '10 mins ago', code: 'vector<int> twoSum(...) { ... }' },
  { id: 'sub_2', problemId: 'p2', problemTitle: 'Best Time to Buy and Sell Stock', language: 'C++', status: 'Accepted', runtime: '18 ms', memory: '10.1 MB', submittedAt: '2 hours ago', code: 'int maxProfit(...) { ... }' },
  { id: 'sub_3', problemId: 'p6', problemTitle: 'Number of Islands', language: 'Python', status: 'Time Limit Exceeded', runtime: '1000 ms', memory: '24.2 MB', submittedAt: 'Yesterday', code: 'def numIslands(grid): ...' }
];
