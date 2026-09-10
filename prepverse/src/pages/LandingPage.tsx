import React, { useState } from 'react';
import {
  Sparkles,
  Code2,
  Brain,
  FileCheck2,
  Building2,
  Bot,
  Users,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Terminal,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthModal } from '../components/AuthModal';

export const LandingPage: React.FC = () => {
  const { navigate, user } = useApp();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const openAuth = (mode: 'login' | 'signup') => {
    if (user) {
      navigate('dashboard');
    } else {
      setAuthMode(mode);
      setAuthOpen(true);
    }
  };

  const features = [
    { icon: Code2, title: '50+ Curated DSA Problems', desc: 'Topic-wise problems with constraints, hints, and expected time complexities.' },
    { icon: Terminal, title: 'Multi-Language Code Arena', desc: 'Execute code in 11 languages with instant test case evaluation and memory profiling.' },
    { icon: Brain, title: 'Quantitative & Logical Aptitude', desc: '100+ interactive aptitude, reasoning and verbal questions with step explanations.' },
    { icon: FileCheck2, title: 'Proctored Mock Assessments', desc: 'Timed company-specific tests with detailed percentile, accuracy, and topic breakdown.' },
    { icon: Building2, title: '15+ Company Preparation Kits', desc: 'TCS, Infosys, Amazon, Google hiring patterns, technical & HR questions.' },
    { icon: Bot, title: 'AI Placement Mentor', desc: '24/7 AI assistance for bug finding, concept simplification, and resume reviews.' },
    { icon: BookOpen, title: 'Core CS Notes & MCQs', desc: 'DBMS, OS, CN, OOP, System Design, and Compiler Design essentials.' },
    { icon: Users, title: 'Technical & HR Interview Prep', desc: 'Practice top 50 interview questions with sample answers and recording drills.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight">PrepVerse</span>
            <span className="ml-2 text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Major Project</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openAuth('login')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => openAuth('signup')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
          >
            Start Preparing
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-6xl mx-auto text-center flex flex-col items-center justify-center">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
          <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
          <span>The Complete Placement Universe for Engineering Students</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          Learn. Practice. Compete. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300">
            Get Placed in Tier-1 Tech.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          One intelligent platform for coding, aptitude, interviews, assessments, core CS subjects and complete placement preparation.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => openAuth('signup')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-bold shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <span>Start Preparing Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (user) navigate('dashboard');
              else openAuth('login');
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <span>Explore Platform</span>
          </button>
        </div>

        {/* Hero Visual Mock */}
        <div className="mt-14 w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl relative overflow-hidden">
          <div className="h-6 bg-slate-950 rounded-lg flex items-center px-3 gap-1.5 mb-3 border border-slate-800/80">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-slate-500 font-mono ml-2">prepverse.dev/dashboard</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left p-2">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-indigo-400 uppercase">PrepVerse Score</span>
              <div className="text-2xl font-black text-white mt-1">742 / 1000</div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-500 h-full w-[74%]" />
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Placement Readiness</span>
              <div className="text-2xl font-black text-white mt-1">74% Ready</div>
              <p className="text-[11px] text-slate-400 mt-1">Target: SDE-1 Role</p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-amber-400 uppercase">Current Streak</span>
              <div className="text-2xl font-black text-white mt-1">🔥 12 Days</div>
              <p className="text-[11px] text-slate-400 mt-1">127 Problems Solved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Everything You Need For Placement Success</h2>
          <p className="text-sm text-slate-400 mt-2">Built specifically for B.Tech final-year major project standards & real company criteria.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 p-5 rounded-2xl transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-10 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">PrepVerse &bull; B.Tech CSE Final Year Major Project</span>
          </div>
          <p>&copy; {new Date().getFullYear()} PrepVerse. All rights reserved.</p>
        </div>
      </footer>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </div>
  );
};
