import React from 'react';
import {
  Award,
  Code2,
  GraduationCap,
  Briefcase,
  Github,
  Linkedin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockBadges } from '../data/mockData';

function safeUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  return trimmed.startsWith('https://') || trimmed.startsWith('http://') ? trimmed : undefined;
}

export const ProfilePage: React.FC = () => {
  const { user, solvedCount } = useApp();

  const github = safeUrl(user?.githubUrl);
  const leetcode = safeUrl(user?.leetcodeUrl);
  const linkedin = safeUrl(user?.linkedinUrl);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm shadow-sky-950/5 dark:shadow-xl relative overflow-hidden backdrop-blur-md transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={user?.name}
            className="w-24 h-24 rounded-2xl object-cover ring-2 ring-teal-500/40 shadow-md shrink-0"
          />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name || 'Surya Rastogi'}</h1>
              <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/25">
                Level {user?.level || 14} Candidate
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-1.5">
              <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{user?.college} &bull; {user?.branch} ({user?.graduationYear})</span>
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-1.5">
              <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Target Role: <strong className="text-slate-800 dark:text-white">{user?.targetRole}</strong></span>
            </p>

            {/* Social Links */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
              {github ? (
                <a href={github} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-xs flex items-center gap-1 transition-colors">
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
              ) : null}
              {leetcode ? (
                <a href={leetcode} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 text-xs flex items-center gap-1 transition-colors">
                  <Code2 className="w-3.5 h-3.5" /> LeetCode
                </a>
              ) : null}
              {linkedin ? (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 text-xs flex items-center gap-1 transition-colors">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800">
          <div className="bg-slate-50/80 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">PrepVerse Score</span>
            <span className="text-lg font-black text-teal-600 dark:text-teal-400 mt-0.5 block">{user?.prepVerseScore} / 1000</span>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Coding Rating</span>
            <span className="text-lg font-black text-slate-800 dark:text-white mt-0.5 block">{user?.codingRating}</span>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Problems Solved</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">{solvedCount}</span>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Streak</span>
            <span className="text-lg font-black text-amber-500 dark:text-amber-400 mt-0.5 block">🔥 {user?.streakDays} Days</span>
          </div>
        </div>
      </div>

      {/* Badges & Unlocked Gamification */}
      <div className="bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm shadow-sky-950/5 dark:shadow-xl backdrop-blur-md">
        <h2 className="text-sm font-bold text-teal-700 dark:text-teal-400 flex items-center gap-2 uppercase tracking-wider">
          <Award className="w-4 h-4" /> Unlocked Placement Badges ({mockBadges.filter(b => b.unlocked).length}/{mockBadges.length})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {mockBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-2xl border text-center space-y-2 transition-all ${
                badge.unlocked
                  ? 'bg-slate-50/80 dark:bg-slate-950 border-teal-500/30 text-slate-900 dark:text-white shadow-2xs'
                  : 'bg-slate-50/40 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800/80 text-slate-400 opacity-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-amber-500 flex items-center justify-center mx-auto text-lg">
                🏆
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">{badge.title}</h4>
                <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
