import React from 'react';
import {
  Code2,
  Database,
  Cpu,
  Network,
  Brain,
  MessageSquare,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Play
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useApp } from '../context/AppContext';
import { PrepVerseScoreCard } from '../components/PrepVerseScoreCard';
import { DailyChallengeCard } from '../components/DailyChallengeCard';

export const DashboardPage: React.FC = () => {
  const { user, navigate, theme } = useApp();

  // Chart 1 Data: Weekly Study Activity
  const weeklyActivityData = [
    { day: 'Mon', hours: 3.5 },
    { day: 'Tue', hours: 4.2 },
    { day: 'Wed', hours: 2.8 },
    { day: 'Thu', hours: 5.0 },
    { day: 'Fri', hours: 4.5 },
    { day: 'Sat', hours: 6.2 },
    { day: 'Sun', hours: 3.8 },
  ];

  // Chart 2 Data: DSA Topic Performance
  const dsaTopicData = [
    { topic: 'Arrays', score: 85 },
    { topic: 'Strings', score: 78 },
    { topic: 'Linked List', score: 72 },
    { topic: 'Trees', score: 61 },
    { topic: 'Graphs', score: 48 },
    { topic: 'DP', score: 42 },
  ];

  // Chart 3 Data: Placement Readiness Breakdown
  const readinessBreakdown = [
    { subject: 'Technical', value: 78 },
    { subject: 'Aptitude', value: 84 },
    { subject: 'Coding', value: 72 },
    { subject: 'Communication', value: 68 },
    { subject: 'Interview', value: 61 },
  ];

  const continueModules = [
    { title: 'DSA Practice', progress: 68, icon: Code2, color: 'text-teal-600 dark:text-teal-400', link: 'dsa' },
    { title: 'DBMS Fundamentals', progress: 78, icon: Database, color: 'text-cyan-600 dark:text-cyan-400', link: 'core-cs' },
    { title: 'Operating Systems', progress: 65, icon: Cpu, color: 'text-sky-600 dark:text-sky-400', link: 'core-cs' },
    { title: 'Computer Networks', progress: 58, icon: Network, color: 'text-emerald-600 dark:text-emerald-400', link: 'core-cs' },
    { title: 'Aptitude & Reasoning', progress: 84, icon: Brain, color: 'text-amber-600 dark:text-amber-400', link: 'aptitude' },
    { title: 'Interview Drills', progress: 61, icon: MessageSquare, color: 'text-rose-600 dark:text-rose-400', link: 'interview' },
  ];

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Welcome back, {user?.name.split(' ')[0] || 'Surya'} <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Let's continue your placement preparation for <span className="text-teal-700 dark:text-teal-400 font-semibold">{user?.targetRole || 'SDE-1'}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('compiler')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Open Code Arena</span>
          </button>
        </div>
      </div>

      {/* Main Score Benchmark Card */}
      <PrepVerseScoreCard />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Weekly Activity */}
        <div className="bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm shadow-sky-950/5 dark:shadow-lg flex flex-col justify-between backdrop-blur-md transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Weekly Study Activity</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Hours spent preparing this week</p>
            </div>
            <span className="text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-500/10 px-2 py-1 rounded-md border border-teal-500/20">
              30.0 Hours
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                />
                <Bar dataKey="hours" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: DSA Topic Performance */}
        <div className="bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm shadow-sky-950/5 dark:shadow-lg flex flex-col justify-between backdrop-blur-md transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">DSA Topic Accuracy</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Accuracy rate per topic</p>
            </div>
            <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              DP & Graphs Need Practice
            </span>
          </div>

          <div className="space-y-2.5">
            {dsaTopicData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.topic}</span>
                  <span className={`font-bold ${item.score < 50 ? 'text-rose-600 dark:text-rose-400' : item.score < 70 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {item.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.score < 50 ? 'bg-rose-500' : item.score < 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Placement Readiness Radar */}
        <div className="bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm shadow-sky-950/5 dark:shadow-lg flex flex-col justify-between backdrop-blur-md transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Readiness Matrix</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Competency evaluation across 5 pillars</p>
            </div>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={readinessBreakdown}>
                <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                <PolarAngleAxis dataKey="subject" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={isDark ? '#475569' : '#cbd5e1'} fontSize={8} />
                <Radar name="Readiness" dataKey="value" stroke="#0d9488" fill="#14b8a6" fillOpacity={isDark ? 0.35 : 0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Challenge Card */}
      <DailyChallengeCard />

      {/* Recommended For You */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Recommended For You</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rec 1 */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 flex items-start justify-between gap-4 shadow-sm backdrop-blur-md">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Improve Graphs Accuracy</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                You have only 48% accuracy in Graph problems. Master BFS, DFS, and Dijkstra algorithm to boost your score.
              </p>
            </div>

            <button
              onClick={() => navigate('dsa')}
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold shrink-0 transition-colors"
            >
              Practice Graphs
            </button>
          </div>

          {/* Rec 2 */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-teal-500/30 rounded-2xl p-5 flex items-start justify-between gap-4 shadow-sm backdrop-blur-md">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Strengthen DBMS Concepts</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Your recent DBMS mock-test score was 62%. Review SQL JOINs, Indexing, and ACID properties before your next mock.
              </p>
            </div>

            <button
              onClick={() => navigate('core-cs', 'dbms')}
              className="px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs font-semibold shrink-0 transition-colors"
            >
              Practice DBMS
            </button>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">Continue Preparation Modules</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {continueModules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(item.link)}
                className="bg-white/80 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900 border border-slate-200/80 hover:border-teal-400/50 dark:border-slate-800 dark:hover:border-slate-700 p-4 rounded-2xl text-left transition-all group shadow-sm shadow-sky-950/5 backdrop-blur-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{item.title}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Progress</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
