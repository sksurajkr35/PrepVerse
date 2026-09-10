package com.prepverse.seed;

import com.prepverse.entity.Problem;
import com.prepverse.entity.ProblemExample;
import com.prepverse.entity.TestCase;
import com.prepverse.repository.ProblemRepository;
import com.prepverse.repository.TestCaseRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.TreeSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeds the 50-problem question bank with judge test cases.
 * Runs once (skips when problems exist). Curated outputs are hand-verified;
 * generated outputs are computed by solver methods (guaranteed correct).
 *
 * <p>All problems use stdin/stdout format (e-judge style, like TCS/Infosys OAs).
 */
@Component
public class ProblemSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ProblemSeeder.class);

    private final ProblemRepository problems;
    private final TestCaseRepository testCases;

    public ProblemSeeder(ProblemRepository problems, TestCaseRepository testCases) {
        this.problems = problems;
        this.testCases = testCases;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (problems.count() > 0) {
            return;
        }
        seedCurated();
        seedGenerated();
        log.info("Seeded {} problems with {} judge test cases.",
            problems.count(), testCases.count());
    }

    // ================= helpers =================

    private Problem build(String id, int order, String title, String difficulty,
            double acceptance, String topic, List<String> companies, String description,
            List<ProblemExample> examples, List<String> constraints, List<String> hints,
            String time, String space, Map<String, String> starters) {
        Problem p = new Problem();
        p.setId(id);
        p.setDisplayOrder(order);
        p.setTitle(title);
        p.setDifficulty(difficulty);
        p.setAcceptanceRate(acceptance);
        p.setTopic(topic);
        p.setCompanies(companies);
        p.setStatus("Unsolved");
        p.setDescription(description);
        p.setExamples(examples);
        p.setConstraints(constraints);
        p.setHints(hints);
        p.setExpectedTimeComplexity(time);
        p.setExpectedSpaceComplexity(space);
        p.setStarterCode(starters);
        return p;
    }

    private ProblemExample ex(String input, String output, String explanation) {
        return new ProblemExample(input, output, explanation);
    }

    /** Each case: {input, expectedOutput, hidden "1"/"0"}. */
    private void saveWithCases(Problem p, List<String[]> cases) {
        problems.save(p);
        int pos = 1;
        for (String[] c : cases) {
            TestCase tc = new TestCase();
            tc.setProblemId(p.getId());
            tc.setInput(c[0]);
            tc.setExpectedOutput(c[1]);
            tc.setHidden("1".equals(c[2]));
            tc.setPosition(pos++);
            testCases.save(tc);
        }
    }

    private static String join(int[] arr) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) {
                sb.append(' ');
            }
            sb.append(arr[i]);
        }
        return sb.toString();
    }

    // ================= 10 curated problems =================

    private void seedCurated() {
        // ---------- p1: Two Sum ----------
        String twoSumCpp = """
                #include <iostream>
                #include <vector>
                using namespace std;

                int main() {
                    int n;
                    if (!(cin >> n)) return 0;
                    vector<int> nums(n);
                    for (int i = 0; i < n; i++) cin >> nums[i];
                    int target;
                    cin >> target;

                    // Write your solution here: print the two indices separated by space

                    return 0;
                }
                """;
        String twoSumPy = "import sys\n"
            + "data = sys.stdin.read().strip().split()\n"
            + "if not data:\n"
            + "    exit(0)\n"
            + "nums = list(map(int, data))\n"
            + "n = nums[0]\n"
            + "arr = nums[1:1 + n]\n"
            + "target = nums[1 + n]\n"
            + "\n"
            + "# Write your solution here: print the two indices separated by space\n";
        saveWithCases(build("p1", 1, "Two Sum", "Easy", 49.2, "Arrays",
            List.of("Amazon", "Google", "Microsoft", "Adobe", "TCS"),
            """
            Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.

            Input Format:
            Line 1: n (array size)
            Line 2: n space-separated integers
            Line 3: target

            Output Format:
            Print the two indices separated by a single space.
            """,
            List.of(
                ex("4\n2 7 11 15\n9", "0 1", "Because nums[0] + nums[1] == 9, we return 0 1."),
                ex("3\n3 2 4\n6", "1 2", null)),
            List.of("2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"),
            List.of("Brute force checks all pairs in O(N^2).", "Can a hash map look up complements in O(1)?"),
            "O(N)", "O(N)", Map.of("cpp", twoSumCpp, "python", twoSumPy)),
            List.of(
                new String[]{"4\n2 7 11 15\n9", "0 1", "0"},
                new String[]{"3\n3 2 4\n6", "1 2", "0"},
                new String[]{"2\n3 3\n6", "0 1", "1"},
                new String[]{"5\n1 2 3 4 5\n9", "3 4", "1"}));

        // ---------- p2: Best Time to Buy and Sell Stock ----------
        String stockCpp = """
                #include <iostream>
                #include <vector>
                using namespace std;

                int main() {
                    int n;
                    if (!(cin >> n)) return 0;
                    vector<int> prices(n);
                    for (int i = 0; i < n; i++) cin >> prices[i];

                    // Write your solution here: print the maximum profit

                    return 0;
                }
                """;
        String stockPy = "import sys\n"
            + "data = sys.stdin.read().strip().split()\n"
            + "if not data:\n"
            + "    exit(0)\n"
            + "nums = list(map(int, data))\n"
            + "n = nums[0]\n"
            + "prices = nums[1:1 + n]\n"
            + "\n"
            + "# Write your solution here: print the maximum profit\n";
        saveWithCases(build("p2", 2, "Best Time to Buy and Sell Stock", "Easy", 54.1, "Arrays",
            List.of("Amazon", "Microsoft", "Flipkart", "Infosys"),
            """
            You are given an array prices where prices[i] is the price of a given stock on the i-th day. Maximize your profit by choosing a single day to buy one stock and a different later day to sell it. Print 0 if no profit is possible.

            Input Format:
            Line 1: n (number of days)
            Line 2: n space-separated prices

            Output Format:
            Print the maximum profit as an integer.
            """,
            List.of(
                ex("6\n7 1 5 3 6 4", "5", "Buy on day 2 (price 1), sell on day 5 (price 6)."),
                ex("3\n2 4 1", "2", null)),
            List.of("1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"),
            List.of("Track the minimum price seen so far while iterating once."),
            "O(N)", "O(1)", Map.of("cpp", stockCpp, "python", stockPy)),
            List.of(
                new String[]{"6\n7 1 5 3 6 4", "5", "0"},
                new String[]{"3\n2 4 1", "2", "0"},
                new String[]{"5\n7 6 4 3 1", "0", "1"},
                new String[]{"5\n1 2 3 4 5", "4", "1"}));

        // ---------- p3: Valid Parentheses ----------
        String parenCpp = """
                #include <iostream>
                #include <string>
                #include <stack>
                using namespace std;

                int main() {
                    string s;
                    if (!(cin >> s)) return 0;

                    // Write your solution here: print "true" if valid, else "false"

                    return 0;
                }
                """;
        String parenPy = "import sys\n"
            + "s = sys.stdin.read().strip()\n"
            + "if not s:\n"
            + "    exit(0)\n"
            + "\n"
            + "# Write your solution here: print True/False in lowercase (true/false)\n";
        saveWithCases(build("p3", 3, "Valid Parentheses", "Easy", 40.5, "Stack",
            List.of("Google", "Adobe", "TCS", "Wipro"),
            """
            Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Print "true" if valid, else "false" (lowercase).

            Input Format:
            A single line containing the bracket string.

            Output Format:
            Print true or false.
            """,
            List.of(
                ex("()[]{}", "true", null),
                ex("(]", "false", null)),
            List.of("1 <= s.length <= 10^4", "s consists of parentheses only"),
            List.of("Push open brackets on a stack and match closed ones."),
            "O(N)", "O(N)", Map.of("cpp", parenCpp, "python", parenPy)),
            List.of(
                new String[]{"()[]{}", "true", "0"},
                new String[]{"(]", "false", "0"},
                new String[]{"([)]", "false", "1"},
                new String[]{"{[]}", "true", "1"}));

        // ---------- p4: Reverse Linked List (value order) ----------
        String revCpp = """
                #include <iostream>
                #include <vector>
                using namespace std;

                int main() {
                    int n;
                    if (!(cin >> n)) return 0;
                    vector<int> vals(n);
                    for (int i = 0; i < n; i++) cin >> vals[i];

                    // Reverse the list and print values separated by space

                    return 0;
                }
                """;
        String revPy = "import sys\n"
            + "data = sys.stdin.read().strip().split()\n"
            + "if not data:\n"
            + "    exit(0)\n"
            + "nums = list(map(int, data))\n"
            + "n = nums[0]\n"
            + "vals = nums[1:1 + n]\n"
            + "\n"
            + "# Reverse the list and print values separated by space\n";
        saveWithCases(build("p4", 4, "Reverse Linked List", "Easy", 72.8, "Linked List",
            List.of("Amazon", "Microsoft", "Cognizant", "Accenture"),
            """
            Given the values of a singly linked list, print them in reverse order, separated by a single space.

            Input Format:
            Line 1: n (number of nodes)
            Line 2: n space-separated node values

            Output Format:
            Print the values in reverse order separated by space.
            """,
            List.of(ex("5\n1 2 3 4 5", "5 4 3 2 1", null)),
            List.of("The number of nodes is in the range [0, 5000]"),
            List.of("Iteratively maintain prev, curr and next pointers (or reverse the array)."),
            "O(N)", "O(1)", Map.of("cpp", revCpp, "python", revPy)),
            List.of(
                new String[]{"5\n1 2 3 4 5", "5 4 3 2 1", "0"},
                new String[]{"4\n9 9 9 9", "9 9 9 9", "0"},
                new String[]{"1\n42", "42", "1"},
                new String[]{"3\n-1 0 1", "1 0 -1", "1"}));

        // ---------- p5: Maximum Subarray ----------
        String kadaneCpp = """
                #include <iostream>
                #include <vector>
                using namespace std;

                int main() {
                    int n;
                    if (!(cin >> n)) return 0;
                    vector<int> nums(n);
                    for (int i = 0; i < n; i++) cin >> nums[i];

                    // Kadane's algorithm: print the largest subarray sum

                    return 0;
                }
                """;
        String kadanePy = "import sys\n"
            + "data = sys.stdin.read().strip().split()\n"
            + "if not data:\n"
            + "    exit(0)\n"
            + "nums = list(map(int, data))\n"
            + "n = nums[0]\n"
            + "arr = nums[1:1 + n]\n"
            + "\n"
            + "# Kadane's algorithm: print the largest subarray sum\n";
        saveWithCases(build("p5", 5, "Maximum Subarray", "Medium", 50.3, "Dynamic Programming",
            List.of("Google", "Amazon", "Walmart", "Microsoft"),
            """
            Given an integer array nums, find the subarray with the largest sum, and print its sum (Kadane's Algorithm).

            Input Format:
            Line 1: n (array size)
            Line 2: n space-separated integers

            Output Format:
            Print the largest subarray sum.
            """,
            List.of(ex("9\n-2 1 -3 4 -1 2 1 -5 4", "6", "The subarray [4,-1,2,1] has the largest sum 6.")),
            List.of("1 <= nums.length <= 10^5"),
            List.of("Kadane: currSum = max(num, currSum + num)."),
            "O(N)", "O(1)", Map.of("cpp", kadaneCpp, "python", kadanePy)),
            List.of(
                new String[]{"9\n-2 1 -3 4 -1 2 1 -5 4", "6", "0"},
                new String[]{"5\n1 2 3 4 5", "15", "0"},
                new String[]{"1\n5", "5", "1"},
                new String[]{"3\n-1 -2 -3", "-1", "1"}));

        // ---------- p6: Number of Islands ----------
        String islandsCpp = """
                #include <iostream>
                #include <vector>
                #include <string>
                using namespace std;

                int main() {
                    int m, n;
                    if (!(cin >> m >> n)) return 0;
                    vector<string> grid(m);
                    for (int i = 0; i < m; i++) cin >> grid[i];

                    // BFS/DFS over 1s: print the number of islands

                    return 0;
                }
                """;
        String islandsPy = "import sys\n"
            + "data = sys.stdin.read().strip().split()\n"
            + "if not data:\n"
            + "    exit(0)\n"
            + "m = int(data[0])\n"
            + "n = int(data[1])\n"
            + "grid = data[2:2 + m]\n"
            + "\n"
            + "# BFS/DFS over '1's: print the number of islands\n";
        saveWithCases(build("p6", 6, "Number of Islands", "Medium", 56.4, "Graphs",
            List.of("Amazon", "Google", "Oracle", "Capgemini"),
            """
            Given an m x n 2D binary grid of '1's (land) and '0's (water), print the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.

            Input Format:
            Line 1: m n (rows and columns)
            Next m lines: n characters each ('0' or '1', no spaces)

            Output Format:
            Print the number of islands.
            """,
            List.of(ex("3 3\n110\n110\n001", "2", null)),
            List.of("1 <= m, n <= 300"),
            List.of("Run BFS/DFS from every unvisited 1 and mark connected 1s visited."),
            "O(M * N)", "O(M * N)", Map.of("cpp", islandsCpp, "python", islandsPy)),
            List.of(
                new String[]{"3 3\n110\n110\n001", "2", "0"},
                new String[]{"3 3\n111\n010\n111", "1", "0"},
                new String[]{"1 1\n1", "1", "1"},
                new String[]{"2 2\n00\n00", "0", "1"}));

        // ---------- p7: Climbing Stairs ----------
        String stairsCpp = """
                #include <iostream>
                using namespace std;

                int main() {
                    int n;
                    if (!(cin >> n)) return 0;

                    // Print the number of distinct ways to reach step n

                    return 0;
                }
                """;
        String stairsPy = "import sys\n"
            + "data = sys.stdin.read().strip()\n"
            + "if not data:\n"
            + "    exit(0)\n"
            + "n = int(data.split()[0])\n"
            + "\n"
            + "# Print the number of distinct ways to reach step n\n";
        saveWithCases(build("p7", 7, "Climbing Stairs", "Easy", 52.0, "Dynamic Programming",
            List.of("Adobe", "Infosys", "TCS", "Deloitte"),
            """
            You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. Print the number of distinct ways to reach the top.

            Input Format:
            A single integer n.

            Output Format:
            Print the number of distinct ways.
            """,
            List.of(ex("3", "3", "Ways: 1+1+1, 1+2, 2+1.")),
            List.of("1 <= n <= 45"),
            List.of("This is the Fibonacci sequence: ways(n) = ways(n-1) + ways(n-2)."),
            "O(N)", "O(1)", Map.of("cpp", stairsCpp, "python", stairsPy)),
            List.of(
                new String[]{"3", "3", "0"},
                new String[]{"2", "2", "0"},
                new String[]{"5", "8", "1"},
                new String[]{"1", "1", "1"}));

        // ---------- p8: Longest Common Subsequence ----------
        String lcsCpp = """
                #include <iostream>
                #include <string>
                using namespace std;

                int main() {
                    string a, b;
                    if (!(cin >> a)) return 0;
                    cin >> b;

                    // DP over both strings: print the LCS length

                    return 0;
                }
                """;
        String lcsPy = "import sys\n"
            + "data = sys.stdin.read().strip().split()\n"
            + "if len(data) < 2:\n"
            + "    exit(0)\n"
            + "a = data[0]\n"
            + "b = data[1]\n"
            + "\n"
            + "# DP over both strings: print the LCS length\n";
        saveWithCases(build("p8", 8, "Longest Common Subsequence", "Medium", 58.7, "Dynamic Programming",
            List.of("Amazon", "Microsoft", "Samsung", "IBM"),
            """
            Given two strings text1 and text2 (lowercase, no spaces), print the length of their longest common subsequence. Print 0 if there is none.

            Input Format:
            Line 1: text1
            Line 2: text2

            Output Format:
            Print the LCS length.
            """,
            List.of(ex("abcde\nace", "3", "LCS is ace.")),
            List.of("1 <= text lengths <= 1000"),
            List.of("2D DP: dp[i][j] = LCS length of prefixes ending at i, j."),
            "O(M * N)", "O(M * N)", Map.of("cpp", lcsCpp, "python", lcsPy)),
            List.of(
                new String[]{"abcde\nace", "3", "0"},
                new String[]{"abcd\nabc", "3", "0"},
                new String[]{"abc\nabc", "3", "1"},
                new String[]{"abc\ndef", "0", "1"}));

        // ---------- p9: Binary Tree Level Order Traversal ----------
        String levelCpp = """
                #include <iostream>
                #include <string>
                #include <vector>
                using namespace std;

                int main() {
                    int n;
                    if (!(cin >> n)) return 0;
                    vector<string> vals(n);
                    for (int i = 0; i < n; i++) cin >> vals[i];

                    // Build the tree ("null" = empty) and print one level per line

                    return 0;
                }
                """;
        String levelPy = "import sys\n"
            + "from collections import deque\n"
            + "data = sys.stdin.read().strip().split()\n"
            + "if not data:\n"
            + "    exit(0)\n"
            + "n = int(data[0])\n"
            + "vals = data[1:1 + n]\n"
            + "\n"
            + "# Build the tree ('null' = empty) and print one level per line\n";
        saveWithCases(build("p9", 9, "Binary Tree Level Order Traversal", "Medium", 64.2, "Trees",
            List.of("Amazon", "Google", "Microsoft", "Flipkart"),
            """
            Given a binary tree as level-order values ("null" for empty nodes), print the level order traversal - node values level by level, left to right, one level per line with values separated by space.

            Input Format:
            Line 1: n (number of tokens)
            Line 2: n space-separated tokens (integers or "null")

            Output Format:
            Print each level on its own line.
            """,
            List.of(ex("7\n3 9 20 null null 15 7", "3\n9 20\n15 7", null)),
            List.of("Number of nodes is in range [0, 2000]"),
            List.of("Use a queue for BFS; track queue size to separate levels."),
            "O(N)", "O(N)", Map.of("cpp", levelCpp, "python", levelPy)),
            List.of(
                new String[]{"7\n3 9 20 null null 15 7", "3\n9 20\n15 7", "0"},
                new String[]{"5\n1 2 3 4 5", "1\n2 3\n4 5", "0"},
                new String[]{"1\n1", "1", "1"},
                new String[]{"3\n1 null 2", "1\n2", "1"}));

        // ---------- p10: Longest Substring Without Repeating Characters ----------
        String substrCpp = """
                #include <iostream>
                #include <string>
                using namespace std;

                int main() {
                    string s;
                    if (!(cin >> s)) return 0;

                    // Sliding window: print the longest substring length

                    return 0;
                }
                """;
        String substrPy = "import sys\n"
            + "s = sys.stdin.read().strip().split()\n"
            + "s = s[0] if s else ''\n"
            + "\n"
            + "# Sliding window: print the longest substring length\n";
        saveWithCases(build("p10", 10, "Longest Substring Without Repeating Characters", "Medium", 33.8, "Sliding Window",
            List.of("Amazon", "Adobe", "Google", "Microsoft", "TCS"),
            """
            Given a string s (no spaces), print the length of the longest substring without repeating characters.

            Input Format:
            A single line containing the string.

            Output Format:
            Print the maximum length.
            """,
            List.of(
                ex("abcabcbb", "3", "The answer is abc, length 3."),
                ex("bbbbb", "1", null)),
            List.of("0 <= s.length <= 5 * 10^4"),
            List.of("Sliding window with two pointers and a last-seen map."),
            "O(N)", "O(min(M, N))", Map.of("cpp", substrCpp, "python", substrPy)),
            List.of(
                new String[]{"abcabcbb", "3", "0"},
                new String[]{"bbbbb", "1", "0"},
                new String[]{"pwwkew", "3", "1"},
                new String[]{"abcdef", "6", "1"}));
    }

    // ================= 40 generated practice problems =================
    // 8 templates x 5 variants. Expected outputs are computed by solvers.

    private void seedGenerated() {
        String[] companies = {"Google", "Microsoft", "Amazon", "Meta", "Netflix", "Uber",
            "Salesforce", "Goldman Sachs", "TCS", "Infosys", "Wipro", "Adobe", "Oracle", "Paytm"};
        String[] suffixes = {"Challenge", "Practice", "Drill", "Sprint", "Master"};
        Random rand = new Random(42);

        String[] prefixes = {"Array Sum", "Maximum Element", "Reverse Array", "Palindrome Check",
            "Factorial", "Count Even Numbers", "Fibonacci Number", "Binary Search"};
        String[] topics = {"Arrays", "Arrays", "Two Pointers", "Strings",
            "Recursion", "Arrays", "Dynamic Programming", "Binary Search"};
        String[] difficulties = {"Easy", "Easy", "Easy", "Medium", "Medium", "Easy", "Medium", "Medium"};

        for (int t = 0; t < 8; t++) {
            for (int v = 0; v < 5; v++) {
                int idx = 11 + t * 5 + v;
                String id = "p" + idx;
                String title = prefixes[t] + " " + suffixes[v];
                double acceptance = Math.round((35 + rand.nextDouble() * 40) * 10) / 10.0;
                List<String> comps = List.of(
                    companies[idx % companies.length],
                    companies[(idx + 5) % companies.length]);

                List<String[]> cases = genCases(t, rand);
                String firstIn = cases.get(0)[0];
                String firstOut = cases.get(0)[1];

                saveWithCases(build(id, idx, title, difficulties[t], acceptance, topics[t], comps,
                    templateDescription(t),
                    List.of(ex(firstIn, firstOut, templateExampleNote(t))),
                    templateConstraints(t), templateHints(t),
                    templateTime(t), "O(1)", Map.of("cpp", templateStarter(t))),
                    cases);
            }
        }
    }

    /** 3 cases per generated problem: 2 visible + 1 hidden. */
    private List<String[]> genCases(int template, Random rand) {
        List<String[]> cases = new ArrayList<>();
        for (int k = 0; k < 3; k++) {
            boolean hidden = k == 2;
            switch (template) {
                case 0 -> {
                    int[] a = randArray(rand, 3, 8, -20, 20);
                    long sum = 0;
                    for (int x : a) {
                        sum += x;
                    }
                    cases.add(new String[]{a.length + "\n" + join(a), String.valueOf(sum), hidden ? "1" : "0"});
                }
                case 1 -> {
                    int[] a = randArray(rand, 3, 8, -20, 20);
                    int mx = a[0];
                    for (int x : a) {
                        mx = Math.max(mx, x);
                    }
                    cases.add(new String[]{a.length + "\n" + join(a), String.valueOf(mx), hidden ? "1" : "0"});
                }
                case 2 -> {
                    int[] a = randArray(rand, 2, 7, -50, 50);
                    StringBuilder sb = new StringBuilder();
                    for (int i = a.length - 1; i >= 0; i--) {
                        if (sb.length() > 0) {
                            sb.append(' ');
                        }
                        sb.append(a[i]);
                    }
                    cases.add(new String[]{a.length + "\n" + join(a), sb.toString(), hidden ? "1" : "0"});
                }
                case 3 -> {
                    String[] pool = {"madam", "racecar", "noon", "level", "hello",
                        "world", "java", "code", "malayalam", "abcba", "python", "nope"};
                    String w = pool[rand.nextInt(pool.length)];
                    String rev = new StringBuilder(w).reverse().toString();
                    cases.add(new String[]{w, rev.equals(w) ? "Yes" : "No", hidden ? "1" : "0"});
                }
                case 4 -> {
                    int n = rand.nextInt(13);
                    long f = 1;
                    for (int i = 2; i <= n; i++) {
                        f *= i;
                    }
                    cases.add(new String[]{String.valueOf(n), String.valueOf(f), hidden ? "1" : "0"});
                }
                case 5 -> {
                    int[] a = randArray(rand, 3, 8, -20, 20);
                    int c = 0;
                    for (int x : a) {
                        if (x % 2 == 0) {
                            c++;
                        }
                    }
                    cases.add(new String[]{a.length + "\n" + join(a), String.valueOf(c), hidden ? "1" : "0"});
                }
                case 6 -> {
                    int n = 1 + rand.nextInt(20);
                    long a = 1;
                    long b = 1;
                    for (int i = 3; i <= n; i++) {
                        long c = a + b;
                        a = b;
                        b = c;
                    }
                    long ans = n == 1 ? 1 : b;
                    cases.add(new String[]{String.valueOf(n), String.valueOf(ans), hidden ? "1" : "0"});
                }
                default -> {
                    TreeSet<Integer> set = new TreeSet<>();
                    while (set.size() < 3 + rand.nextInt(5)) {
                        set.add(rand.nextInt(51));
                    }
                    int[] a = set.stream().mapToInt(Integer::intValue).toArray();
                    int target;
                    if (rand.nextBoolean()) {
                        target = a[rand.nextInt(a.length)];
                    } else {
                        target = 60 + rand.nextInt(40);
                    }
                    int found = -1;
                    for (int i = 0; i < a.length; i++) {
                        if (a[i] == target) {
                            found = i;
                            break;
                        }
                    }
                    cases.add(new String[]{a.length + "\n" + join(a) + "\n" + target,
                        String.valueOf(found), hidden ? "1" : "0"});
                }
            }
        }
        return cases;
    }

    private int[] randArray(Random rand, int minLen, int maxLen, int lo, int hi) {
        int n = minLen + rand.nextInt(maxLen - minLen + 1);
        int[] a = new int[n];
        for (int i = 0; i < n; i++) {
            a[i] = lo + rand.nextInt(hi - lo + 1);
        }
        return a;
    }

    private String templateDescription(int t) {
        return switch (t) {
            case 0 -> """
                Print the sum of all elements in the array.

                Input Format:
                Line 1: n (array size)
                Line 2: n space-separated integers

                Output Format:
                Print the sum.
                """;
            case 1 -> """
                Print the maximum element in the array.

                Input Format:
                Line 1: n (array size)
                Line 2: n space-separated integers

                Output Format:
                Print the maximum element.
                """;
            case 2 -> """
                Print the array elements in reverse order, separated by a single space.

                Input Format:
                Line 1: n (array size)
                Line 2: n space-separated integers

                Output Format:
                Print the reversed array.
                """;
            case 3 -> """
                Check whether the given lowercase word reads the same forwards and backwards. Print "Yes" if it is a palindrome, else "No".

                Input Format:
                A single lowercase word (no spaces).

                Output Format:
                Print Yes or No.
                """;
            case 4 -> """
                Print the factorial of n (n!). 0! = 1. The answer fits in a 64-bit integer.

                Input Format:
                A single integer n.

                Output Format:
                Print n!.
                """;
            case 5 -> """
                Count how many numbers in the array are even (including negatives and zero).

                Input Format:
                Line 1: n (array size)
                Line 2: n space-separated integers

                Output Format:
                Print the count.
                """;
            case 6 -> """
                Print the n-th Fibonacci number where fib(1) = 1 and fib(2) = 1.

                Input Format:
                A single integer n.

                Output Format:
                Print fib(n).
                """;
            default -> """
                The array is sorted in ascending order with distinct values. Print the 0-based index of target, or -1 if it is not present.

                Input Format:
                Line 1: n (array size)
                Line 2: n sorted distinct integers
                Line 3: target

                Output Format:
                Print the index or -1.
                """;
        };
    }

    private String templateExampleNote(int t) {
        return switch (t) {
            case 0 -> "Add up all the elements.";
            case 1 -> "Scan once while tracking the maximum.";
            case 2 -> "Print from the last index down to zero.";
            case 3 -> "Compare the word with its reverse.";
            case 4 -> "Multiply 1 * 2 * ... * n.";
            case 5 -> "Count elements divisible by 2.";
            case 6 -> "fib(n) = fib(n-1) + fib(n-2).";
            default -> "Binary search: halve the range every step.";
        };
    }

    private List<String> templateConstraints(int t) {
        return switch (t) {
            case 3 -> List.of("Single lowercase word, length 1 to 100");
            case 4 -> List.of("0 <= n <= 12");
            case 6 -> List.of("1 <= n <= 20");
            case 7 -> List.of("3 <= n <= 10", "Values are distinct and sorted");
            default -> List.of("1 <= n <= 1000", "-10^9 <= value <= 10^9");
        };
    }

    private List<String> templateHints(int t) {
        return switch (t) {
            case 0 -> List.of("Loop once and accumulate into a long variable.");
            case 1 -> List.of("Start max as the first element, then scan.");
            case 2 -> List.of("Use two pointers from both ends, or loop backwards.");
            case 3 -> List.of("Two pointers from both ends must always match.");
            case 4 -> List.of("Loop from 2 to n multiplying into a long.");
            case 5 -> List.of("x is even when x % 2 == 0 (works for negatives too).");
            case 6 -> List.of("Iterate with two variables; no array needed.");
            default -> List.of("While lo <= hi: check mid, then discard half.");
        };
    }

    private String templateTime(int t) {
        return t == 7 ? "O(log N)" : "O(N)";
    }

    private String templateStarter(int t) {
        String reader = """
                #include <iostream>
                #include <vector>
                #include <string>
                using namespace std;

                int main() {
                """;
        String footer = """
                    return 0;
                }
                """;
        String body = switch (t) {
            case 3 -> """
                        string w;
                        if (!(cin >> w)) return 0;

                        // Print "Yes" if w is a palindrome, else "No"
                """;
            case 4, 6 -> """
                        int n;
                        if (!(cin >> n)) return 0;

                        // Compute and print the answer
                """;
            case 7 -> """
                        int n;
                        if (!(cin >> n)) return 0;
                        vector<int> a(n);
                        for (int i = 0; i < n; i++) cin >> a[i];
                        int target;
                        cin >> target;

                        // Binary search: print the index or -1
                """;
            default -> """
                        int n;
                        if (!(cin >> n)) return 0;
                        vector<int> a(n);
                        for (int i = 0; i < n; i++) cin >> a[i];

                        // Compute and print the answer
                """;
        };
        return reader + body + footer;
    }
}
