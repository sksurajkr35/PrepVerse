import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Circle,
  Code2,
  Play,
  Sparkles,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockProblems } from '../data/mockData';
import { ProblemDifficulty } from '../types';

export const DSAPracticePage: React.FC = () => {
  const { openProblemInArena, searchQuery, setSearchQuery } = useApp();

  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');

  const topicsList = [
    'All', 'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Hashing',
    'Recursion', 'Backtracking', 'Binary Search', 'Sorting', 'Trees', 'BST',
    'Heap', 'Greedy', 'Graphs', 'Dynamic Programming', 'Trie', 'Bit Manipulation',
    'Sliding Window', 'Two Pointers', 'Prefix Sum'
  ];

  const filteredProblems = mockProblems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.companies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTopic = selectedTopic === 'All' || p.topic === selectedTopic;
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const matchesCompany = selectedCompany === 'All' || p.companies.includes(selectedCompany);

    return matchesSearch && matchesTopic && matchesDifficulty && matchesStatus && matchesCompany;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-6 h-6 text-indigo-400" />
            <span>DSA Practice Problems</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Solve curated placement problems, track accuracy, and boost your coding rating.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{filteredProblems.length} Problems Available</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problem title..."
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500"
            >
              <option value="All">Difficulty: All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500"
            >
              <option value="All">Status: All</option>
              <option value="Solved">Solved</option>
              <option value="Attempted">Attempted</option>
              <option value="Unsolved">Unsolved</option>
            </select>
          </div>

          {/* Company Filter */}
          <div>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500"
            >
              <option value="All">Company: All</option>
              <option value="Amazon">Amazon</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Adobe">Adobe</option>
              <option value="TCS">TCS</option>
              <option value="Infosys">Infosys</option>
            </select>
          </div>
        </div>

        {/* Topic Pills Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {topicsList.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedTopic === topic
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700/80'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Problem Title</th>
                <th className="py-3.5 px-4">Topic</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Acceptance</th>
                <th className="py-3.5 px-4">Companies</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className="hover:bg-slate-800/40 transition-colors group">
                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {problem.status === 'Solved' ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> Solved
                      </span>
                    ) : problem.status === 'Attempted' ? (
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Clock className="w-4 h-4" /> Attempted
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-500">
                        <Circle className="w-4 h-4" /> Todo
                      </span>
                    )}
                  </td>

                  {/* Title */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => openProblemInArena(problem)}
                      className="font-bold text-slate-100 hover:text-indigo-400 transition-colors text-left"
                    >
                      {problem.title}
                    </button>
                  </td>

                  {/* Topic */}
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                      {problem.topic}
                    </span>
                  </td>

                  {/* Difficulty */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        problem.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : problem.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>

                  {/* Acceptance */}
                  <td className="py-3.5 px-4 text-slate-400">
                    {problem.acceptanceRate}%
                  </td>

                  {/* Companies */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.companies.slice(0, 3).map((comp, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openProblemInArena(problem)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Solve</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
