import React, { useState, useEffect } from 'react';
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
import { apiFetch, getToken } from '../services/api';
import { storageService } from '../services/storageService';

interface DayActivity {
  date: string;
  accepted: number;
  total: number;
}

interface TopicAccuracy {
  topic: string;
  accuracy: number;
}

interface AnalyticsSummary {
  totalSubmissions: number;
  acceptedSubmissions: number;
  overallAccuracy: number;
  mockTestAverage: number;
  mockTestsTaken: number;
  currentStreak: number;
  last14Days: DayActivity[];
  topicAccuracy: TopicAccuracy[];
}

/** Same aggregation as the backend, over the offline cache (fallback). */
function localSummary(): AnalyticsSummary {
  const subs = storageService.getSubmissions();
  const attempts = storageService.getTestAttempts();
  const total = subs.length;
  const accepted = subs.filter(s => s.status === 'Accepted').length;
  const round1 = (v: number) => Math.round(v * 10) / 10;

  const buckets = new Map<string, { accepted: number; total: number }>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), { accepted: 0, total: 0 });
  }
  // Cached submissions only carry a time-of-day stamp, so day-level
  // bucketing is impossible offline - attribute them to today.
  const today = new Date().toISOString().slice(0, 10);
  const slot = buckets.get(today);
  if (slot) {
    slot.total = total;
    slot.accepted = accepted;
  }

  const byTopic = new Map<string, number[]>();
  for (const a of attempts) {
    for (const [topic, pct] of Object.entries(a.topicBreakdown || {})) {
      const list = byTopic.get(topic) ?? [];
      list.push(pct);
      byTopic.set(topic, list);
    }
  }
  const topicAccuracy: TopicAccuracy[] = Array.from(byTopic.entries())
    .map(([topic, vals]) => ({
      topic,
      accuracy: round1(vals.reduce((x, y) => x + y, 0) / (vals.length || 1))
    }))
    .sort((a, b) => a.topic.localeCompare(b.topic));

  const mockAvg = attempts.length === 0 ? 0 : round1(
    attempts.reduce((s, a) => s + (a.totalMarks ? (a.score * 100) / a.totalMarks : 0), 0)
    / attempts.length
  );

  return {
    totalSubmissions: total,
    acceptedSubmissions: accepted,
    overallAccuracy: total === 0 ? 0 : round1((accepted * 100) / total),
    mockTestAverage: mockAvg,
    mockTestsTaken: attempts.length,
    currentStreak: 0,
    last14Days: Array.from(buckets.entries()).map(([date, b]) => ({
      date: date.slice(5),
      accepted: b.accepted,
      total: b.total
    })),
    topicAccuracy
  };
}

export const AnalyticsPage: React.FC = () => {
  const { user, navigate } = useApp();
  const [summary, setSummary] = useState<AnalyticsSummary>(() => localSummary());

  useEffect(() => {
    if (!getToken()) {
      return;
    }
    apiFetch<AnalyticsSummary>('/api/analytics/summary')
      .then((s) => {
        if (s && Array.isArray(s.last14Days)) {
          setSummary({
            ...s,
            last14Days: s.last14Days.map(d => ({ ...d, date: d.date.slice(5) }))
          });
        }
      })
      .catch(() => {});
  }, []);

  const weakest = summary.topicAccuracy.length > 0
    ? [...summary.topicAccuracy].sort((a, b) => a.accuracy - b.accuracy)[0]
    : null;
  const hasData = summary.totalSubmissions > 0 || summary.mockTestsTaken > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          <span>Performance Analytics & Weak Area Diagnostics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Live metrics from your judged submissions and mock attempts
          {summary.currentStreak > 0 && (
            <> &bull; <span className="text-amber-400 font-bold">🔥 {summary.currentStreak}-day streak</span></>
          )}.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Submissions</span>
          <span className="text-xl font-black text-white mt-1 block">
            {summary.acceptedSubmissions} / {summary.totalSubmissions}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Overall Accuracy</span>
          <span className="text-xl font-black text-emerald-400 mt-1 block">{summary.overallAccuracy}%</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Coding Rating</span>
          <span className="text-xl font-black text-indigo-400 mt-1 block">{user?.codingRating ?? 1000}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Mock Test Avg</span>
          <span className="text-xl font-black text-amber-400 mt-1 block">
            {summary.mockTestAverage}% ({summary.mockTestsTaken})
          </span>
        </div>
      </div>

      {/* Weak Topic Diagnostic Alert */}
      {hasData && weakest ? (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/30 border border-rose-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-400">Diagnostic Action Item</span>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Your weakest area is {weakest.topic} ({weakest.accuracy}% accuracy).
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Recommended action: practice {weakest.topic} this week to lift your overall accuracy.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('dsa')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0 shadow-md shadow-rose-600/20 flex items-center gap-2"
          >
            <span>Practice Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs text-slate-400">
          No activity yet — submit a solution or take a mock test and your live analytics will appear here.
        </div>
      )}

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-3">14-Day Submission Activity</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.last14Days}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} interval={2} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Bar dataKey="total" fill="#475569" radius={[6, 6, 0, 0]} name="Submissions" />
                <Bar dataKey="accepted" fill="#34d399" radius={[6, 6, 0, 0]} name="Accepted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Accuracy Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-3">Topic Accuracy Comparison</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.topicAccuracy}>
                <XAxis dataKey="topic" stroke="#64748b" fontSize={10} interval={0} angle={-15} dy={8} height={50} />
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
