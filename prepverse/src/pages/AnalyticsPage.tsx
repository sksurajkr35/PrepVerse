import React from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Code2,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { navigate } = useApp();

  const progressHistory = [
    { week: 'Week 1', score: 580, rating: 1100 },
    { week: 'Week 2', score: 620, rating: 1150 },
    { week: 'Week 3', score: 670, rating: 1210 },
    { week: 'Week 4', score: 710, rating: 1250 },
    { week: 'Week 5', score: 742, rating: 1286 },
  ];

  const accuracyData = [
    { topic: 'Arrays', accuracy: 85 },
    { topic: 'Strings', accuracy: 78 },
    { topic: 'Aptitude', accuracy: 84 },
    { topic: 'Core CS', accuracy: 72 },
    { topic: 'Graphs', accuracy: 48 },
    { topic: 'DP', accuracy: 42 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          <span>Performance Analytics & Weak Area Diagnostics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Detailed metrics, time tracking, accuracy breakdown, and personalized action items.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Study Hours</span>
          <span className="text-xl font-black text-white mt-1 block">30.5 Hours</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Overall Accuracy</span>
          <span className="text-xl font-black text-emerald-400 mt-1 block">78.4%</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Coding Rating</span>
          <span className="text-xl font-black text-indigo-400 mt-1 block">1286 (Int)</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Mock Test Avg</span>
          <span className="text-xl font-black text-amber-400 mt-1 block">82 / 100</span>
        </div>
      </div>

      {/* Weak Topic Diagnostic Alert */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/30 border border-rose-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 border border-rose-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-400">Diagnostic Action Item</span>
            <h3 className="text-sm font-bold text-white mt-0.5">Your weakest area is Dynamic Programming (42% accuracy).</h3>
            <p className="text-xs text-slate-400 mt-1">Recommended action: Solve 5 Medium DP problems this week to unlock +35 PrepVerse Score points.</p>
          </div>
        </div>

        <button
          onClick={() => navigate('dsa')}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0 shadow-md shadow-rose-600/20 flex items-center gap-2"
        >
          <span>Solve DP Problems</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-3">5-Week Score Growth Trend</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressHistory}>
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[500, 1000]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Accuracy Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-3">Topic Accuracy Comparison</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyData}>
                <XAxis dataKey="topic" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Bar dataKey="accuracy" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
