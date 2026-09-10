import React from 'react';
import {
  User as UserIcon,
  Award,
  Flame,
  Trophy,
  Code2,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Github,
  Linkedin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockBadges } from '../data/mockData';

export const ProfilePage: React.FC = () => {
  const { user, solvedCount } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={user?.name}
            className="w-24 h-24 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-xl shrink-0"
          />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white">{user?.name || 'Surya Rastogi'}</h1>
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Level {user?.level || 14} Candidate
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>{user?.college} &bull; {user?.branch} ({user?.graduationYear})</span>
            </p>

            <p className="text-xs text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-1.5">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>Target Role: <strong className="text-white">{user?.targetRole}</strong></span>
            </p>

            {/* Social Links */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
              <a href={user?.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white text-xs flex items-center gap-1">
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
              <a href={user?.leetcodeUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-amber-400 text-xs flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5" /> LeetCode
              </a>
              <a href={user?.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-400 text-xs flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">PrepVerse Score</span>
            <span className="text-lg font-black text-indigo-400 mt-0.5 block">{user?.prepVerseScore} / 1000</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Coding Rating</span>
            <span className="text-lg font-black text-white mt-0.5 block">{user?.codingRating}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Problems Solved</span>
            <span className="text-lg font-black text-emerald-400 mt-0.5 block">{solvedCount}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Current Streak</span>
            <span className="text-lg font-black text-amber-400 mt-0.5 block">🔥 {user?.streakDays} Days</span>
          </div>
        </div>
      </div>

      {/* Badges & Unlocked Gamification */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider text-indigo-400">
          <Award className="w-4 h-4" /> Unlocked Placement Badges ({mockBadges.filter(b => b.unlocked).length}/{mockBadges.length})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {mockBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-2xl border text-center space-y-2 transition-all ${
                badge.unlocked
                  ? 'bg-slate-950 border-indigo-500/30 text-white shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-600 opacity-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-amber-400 flex items-center justify-center mx-auto text-lg">
                🏆
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">{badge.title}</h4>
                <p className="text-[9.5px] text-slate-400 mt-1 line-clamp-2">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
