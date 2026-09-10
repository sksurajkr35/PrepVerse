import React from 'react';
import { Flame, Play, CheckCircle, Brain, MessageSquare, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockProblems } from '../data/mockData';

export const DailyChallengeCard: React.FC = () => {
  const { openProblemInArena, navigate } = useApp();
  const dailyProblem = mockProblems.find(p => p.id === 'p10') || mockProblems[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">Daily Challenge &bull; Day 12</span>
            <h3 className="text-base font-bold text-white mt-0.5">{dailyProblem.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {dailyProblem.difficulty}
          </span>
          <button
            onClick={() => openProblemInArena(dailyProblem)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Challenge</span>
          </button>
        </div>
      </div>

      {/* Sub Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        <button
          onClick={() => navigate('aptitude')}
          className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">5 Aptitude Questions</div>
              <div className="text-[10px] text-slate-400">Quant & Profit/Loss Speed Sprint</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        </button>

        <button
          onClick={() => navigate('aptitude')}
          className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">5 Verbal Questions</div>
              <div className="text-[10px] text-slate-400">Vocabulary & Error Detection</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
        </button>

        <button
          onClick={() => navigate('interview')}
          className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">1 Interview Question</div>
              <div className="text-[10px] text-slate-400">C++ Stack vs Heap Memory</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
        </button>
      </div>
    </div>
  );
};
