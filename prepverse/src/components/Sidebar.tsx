import React from 'react';
import {
  LayoutDashboard,
  Code2,
  Terminal,
  Brain,
  FileCheck2,
  Building2,
  BookOpen,
  Users,
  Bot,
  CalendarCheck,
  FileText,
  Trophy,
  BarChart3,
  User,
  Settings,
  Shield,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeTab, navigate, logout, user } = useApp();

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dsa', label: 'DSA Practice', icon: Code2 },
    { id: 'compiler', label: 'Code Arena', icon: Terminal },
    { id: 'aptitude', label: 'Aptitude', icon: Brain },
    { id: 'mock-tests', label: 'Mock Tests', icon: FileCheck2 },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'core-cs', label: 'Core CS', icon: BookOpen },
    { id: 'interview', label: 'Interview Prep', icon: Users },
    { id: 'ai-mentor', label: 'AI Mentor', icon: Bot, badge: 'AI' },
    { id: 'study-plan', label: 'Study Plan', icon: CalendarCheck },
    { id: 'resume', label: 'Resume Builder', icon: FileText },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const bottomNavItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (user?.role === 'admin') {
    bottomNavItems.unshift({ id: 'admin', label: 'Admin Panel', icon: Shield });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-r lg:border border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 lg:rounded-2xl shrink-0 shadow-sm shadow-sky-950/5 dark:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => {
              navigate('dashboard');
              onClose();
            }}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-sky-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center transition-colors">
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                PrepVerse <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30">Pro</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Learn. Practice. Get Placed.</p>
            </div>
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Preparation Modules
          </div>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 text-white shadow-md shadow-teal-500/20 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Menu */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="px-3 pb-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Account
          </div>
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-200/80 dark:bg-slate-800 text-teal-700 dark:text-teal-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-500/10 transition-colors mt-1"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
