import React, { useState } from 'react';
import { ShieldCheck, Plus, CheckCircle2, Users, Code2, Building2 } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [problemTitle, setProblemTitle] = useState('');
  const [topic, setTopic] = useState('Arrays');
  const [difficulty, setDifficulty] = useState('Medium');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemTitle) return;
    setAddedSuccess(true);
    setProblemTitle('');
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-indigo-400" />
          <span>PrepVerse Admin Portal</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Faculty / Placement Officer management dashboard for content and student monitoring.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Placement Problem
        </h3>

        <form onSubmit={handleAddProblem} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">Problem Title</label>
            <input
              type="text"
              value={problemTitle}
              onChange={(e) => setProblemTitle(e.target.value)}
              placeholder="e.g., Maximum Subarray Sum (Kadane's Algorithm)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option>Arrays</option>
                <option>Strings</option>
                <option>Trees</option>
                <option>Graphs</option>
                <option>Dynamic Programming</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {addedSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Problem added to PrepVerse question bank!
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold ml-auto"
            >
              Add Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
