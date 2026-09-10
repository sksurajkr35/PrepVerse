import React from 'react';
import { Trophy, Target, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrepVerseScoreCard: React.FC = () => {
  const { user, prepVerseScore } = useApp();
  const readiness = user?.placementReadiness || 74;

  // Calculate SVG circle progress
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (readiness / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 shadow-xl shadow-indigo-950/30">
      {/* Subtle Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left Stats */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Computed Readiness Index</span>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
              <span>{prepVerseScore}</span>
              <span className="text-lg text-slate-400 font-normal">/ 1000</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              PrepVerse Benchmark Score &bull; <span className="text-emerald-400 font-semibold">Tier-1 Company Ready</span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" /> Coding Rating
              </div>
              <div className="text-lg font-bold text-slate-100 mt-1">{user?.codingRating || 1286}</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Problems Solved
              </div>
              <div className="text-lg font-bold text-slate-100 mt-1">{user?.problemsSolved || 127}</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Mock Tests
              </div>
              <div className="text-lg font-bold text-slate-100 mt-1">{user?.mockTestsTaken || 18}</div>
            </div>
          </div>
        </div>

        {/* Right Progress Ring */}
        <div className="flex flex-col items-center justify-center bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shrink-0 min-w-44 shadow-inner">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-indigo-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white">{readiness}%</span>
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Placement</span>
            </div>
          </div>

          <div className="mt-3 text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +4.2% this week
          </div>
        </div>
      </div>
    </div>
  );
};
