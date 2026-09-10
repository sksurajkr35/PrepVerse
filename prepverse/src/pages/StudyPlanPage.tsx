import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckSquare,
  Square,
  Clock,
  Sparkles,
  Building2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { mockStudyPlan } from '../data/mockData';
import { StudyPlanItem } from '../types';

export const StudyPlanPage: React.FC = () => {
  const [targetCompany, setTargetCompany] = useState('Amazon');
  const [dailyHours, setDailyHours] = useState('4');
  const [currentLevel, setCurrentLevel] = useState('Intermediate');
  const [planItems, setPlanItems] = useState<StudyPlanItem[]>(mockStudyPlan);

  const toggleComplete = (id: string) => {
    setPlanItems(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = planItems.filter(i => i.completed).length;
  const progressPercent = Math.round((completedCount / (planItems.length || 1)) * 100);

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-indigo-400" />
          <span>Personalized Weekly Study Plan</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Customized daily preparation schedule tuned to your target company and exam deadlines.
        </p>
      </div>

      {/* Plan Configuration Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-lg">
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Target Company</label>
          <select
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option>Amazon</option>
            <option>Google</option>
            <option>Microsoft</option>
            <option>TCS NQT</option>
            <option>Infosys</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Daily Prep Hours</label>
          <select
            value={dailyHours}
            onChange={(e) => setDailyHours(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="2">2 Hours / Day</option>
            <option value="4">4 Hours / Day</option>
            <option value="6">6 Hours / Day</option>
            <option value="8">8 Hours / Day (Sprint)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Current Skill Level</label>
          <select
            value={currentLevel}
            onChange={(e) => setCurrentLevel(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Target Roadmap Progress
          </span>
          <span className="text-indigo-400">{completedCount} of {planItems.length} Tasks Completed ({progressPercent}%)</span>
        </div>

        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Day by Day Plan Schedule */}
      <div className="space-y-4">
        {daysList.map((day) => {
          const itemsForDay = planItems.filter(i => i.day === day);
          if (itemsForDay.length === 0) return null;

          return (
            <div key={day} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> {day} Schedule
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {itemsForDay.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleComplete(task.id)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      task.completed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div>
                        <span className={`font-semibold block ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                          {task.topic}
                        </span>
                        <span className="text-[10px] text-slate-500">{task.category} &bull; {task.durationMinutes} mins</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
