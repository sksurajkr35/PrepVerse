import React, { useState, useEffect } from 'react';
import {
  Play,
  Send,
  RotateCcw,
  Code2,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Sparkles,
  ChevronDown,
  Terminal,
  FileText,
  Lightbulb,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { compilerService, RunCodeResult } from '../services/compilerService';

export const CodeArenaPage: React.FC = () => {
  const { currentProblem, markProblemSolved } = useApp();
  const problem = currentProblem || {
    id: 'p1',
    title: 'Two Sum',
    difficulty: 'Easy' as const,
    acceptanceRate: 49.2,
    topic: 'Arrays',
    companies: ['Amazon', 'Google'],
    status: 'Unsolved' as const,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
    constraints: ['2 <= nums.length <= 10^4'],
    hints: ['Use a Hash Map for O(N) lookup.'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(N)',
    starterCode: {
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for(int i=0; i<nums.size(); ++i) {\n            int comp = target - nums[i];\n            if(mp.count(comp)) return {mp[comp], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};',
      python: 'class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []',
      java: 'import java.util.HashMap;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}',
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}'
    }
  };

  const languages = [
    { id: 'cpp', name: 'C++ (GCC 12)' },
    { id: 'python', name: 'Python 3.11' },
    { id: 'java', name: 'Java 17' },
    { id: 'javascript', name: 'JavaScript (Node 20)' },
    { id: 'c', name: 'C (GCC 12)' },
    { id: 'go', name: 'Go 1.21' },
    { id: 'rust', name: 'Rust 1.72' },
  ];

  const [selectedLang, setSelectedLang] = useState<string>('cpp');
  const [code, setCode] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [running, setRunning] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<RunCodeResult | null>(null);
  const [activeTabLeft, setActiveTabLeft] = useState<'description' | 'hints'>('description');
  const [fontSize, setFontSize] = useState<number>(13);

  // Sync starter code
  useEffect(() => {
    if (problem.starterCode) {
      const template = problem.starterCode[selectedLang] || problem.starterCode['cpp'] || '// Solution template';
      setCode(template);
    }
  }, [problem, selectedLang]);

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    const res = await compilerService.runCode(selectedLang, code, customInput);
    setResult(res);
    setRunning(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    const res = await compilerService.submitCode(problem.id, selectedLang, code);
    setResult(res);
    setSubmitting(false);

    if (res.status === 'Accepted') {
      markProblemSolved(problem.id, code, selectedLang);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    if (problem.starterCode) {
      setCode(problem.starterCode[selectedLang] || '');
    }
    setResult(null);
  };

  return (
    <div className="space-y-4">
      {/* Code Arena Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">{problem.title}</h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                {problem.difficulty}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Topic: {problem.topic} &bull; Time: {problem.expectedTimeComplexity}</p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden"
          >
            {languages.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            title="Reset to Template"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleRun}
            disabled={running || submitting}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
            <span>{running ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={running || submitting}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Submitting...' : 'Submit Solution'}</span>
          </button>
        </div>
      </div>

      {/* Main IDE Workspace 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col: Problem Description & Examples */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[650px] overflow-hidden">
          <div className="flex border-b border-slate-800 bg-slate-950/60">
            <button
              onClick={() => setActiveTabLeft('description')}
              className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
                activeTabLeft === 'description'
                  ? 'border-indigo-500 text-indigo-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Statement
            </button>
            <button
              onClick={() => setActiveTabLeft('hints')}
              className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
                activeTabLeft === 'hints'
                  ? 'border-indigo-500 text-indigo-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" /> Hints ({problem.hints?.length || 0})
            </button>
          </div>

          <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar text-xs leading-relaxed text-slate-300">
            {activeTabLeft === 'description' ? (
              <>
                <p>{problem.description}</p>

                {/* Examples */}
                <div className="space-y-3">
                  <h4 className="font-bold text-white uppercase text-[10px] tracking-wider">Examples</h4>
                  {problem.examples?.map((ex, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 font-mono">
                      <div><span className="text-slate-500">Input:</span> <span className="text-indigo-300">{ex.input}</span></div>
                      <div><span className="text-slate-500">Output:</span> <span className="text-emerald-400">{ex.output}</span></div>
                      {ex.explanation && <div className="text-[11px] text-slate-400 font-sans mt-1">Explanation: {ex.explanation}</div>}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div>
                  <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-2">Constraints</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-[11px]">
                    {problem.constraints?.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Complexity Expectations */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500">Expected Time</div>
                    <div className="font-mono text-indigo-400 font-bold">{problem.expectedTimeComplexity}</div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500">Expected Space</div>
                    <div className="font-mono text-cyan-400 font-bold">{problem.expectedSpaceComplexity}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {problem.hints?.map((hint, idx) => (
                  <div key={idx} className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl text-indigo-200">
                    <span className="font-bold text-indigo-400 block mb-1">Hint {idx + 1}:</span>
                    {hint}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Code Editor + Execution Output */}
        <div className="lg:col-span-7 flex flex-col h-[650px] gap-3">
          {/* Editor Area */}
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col overflow-hidden relative shadow-inner">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono font-semibold text-slate-300">solution.{selectedLang === 'cpp' ? 'cpp' : selectedLang === 'python' ? 'py' : 'java'}</span>
              <div className="flex items-center gap-3">
                <span className="text-[11px]">Font: {fontSize}px</span>
                <button onClick={() => setFontSize(f => Math.min(18, f + 1))} className="hover:text-white">+</button>
                <button onClick={() => setFontSize(f => Math.max(10, f - 1))} className="hover:text-white">-</button>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ fontSize: `${fontSize}px` }}
              className="w-full h-full bg-slate-950 text-slate-100 p-4 font-mono leading-relaxed resize-none focus:outline-hidden custom-scrollbar"
              placeholder="// Write your code solution here..."
              spellCheck={false}
            />
          </div>

          {/* Output / Console Area */}
          <div className="h-44 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col overflow-hidden text-xs">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-200">Execution Console</span>
              </div>
              {result && (
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" /> {result.executionTime}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-cyan-400" /> {result.memory}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto font-mono custom-scrollbar">
              {running || submitting ? (
                <div className="text-slate-400 flex items-center gap-2 py-4 justify-center">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span>Compiling and running test cases against judge...</span>
                </div>
              ) : result ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {result.status === 'Accepted' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accepted ({result.passedCases}/{result.totalCases} Passed)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> {result.status}
                      </span>
                    )}
                  </div>
                  <pre className="text-slate-300 text-[11px] whitespace-pre-wrap leading-normal bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {result.output}
                  </pre>
                </div>
              ) : (
                <div className="text-slate-500 italic py-2">
                  Click "Run Code" to test or "Submit Solution" to submit against full test cases.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
