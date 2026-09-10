import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Database,
  Cpu,
  Network,
  Code,
  Terminal,
  FileText,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockCoreCSSubjects as mockCoreCSFallback } from '../data/mockData';
import { contentService } from '../services/contentService';
import { CoreCSSubject } from '../types';

export const CoreCSPage: React.FC = () => {
  // Bundled bank paints instantly; live MySQL rows replace it when the backend is up.
  const [mockCoreCSSubjects, setBank] = useState(mockCoreCSFallback);
  useEffect(() => {
    contentService.getCoreSubjects().then(setBank).catch(() => {});
  }, []);

  const { activeSubjectId, openSubjectDetail } = useApp();
  const [activeTab, setActiveTab] = useState<'notes' | 'mcqs' | 'interview'>('notes');
  const [selectedNote, setSelectedNote] = useState<any | null>(null);

  const selectedSubject = mockCoreCSSubjects.find(s => s.id === activeSubjectId) || mockCoreCSSubjects[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <span>Core CS Subjects & Notes</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          DBMS, Operating Systems, Computer Networks, OOP, System Design, and COA.
        </p>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {mockCoreCSSubjects.slice(0, 9).map((subj) => {
          const isSelected = subj.id === selectedSubject.id;
          return (
            <button
              key={subj.id}
              onClick={() => openSubjectDetail(subj.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-600/10'
                  : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400">{subj.shortName}</span>
                <h3 className="text-xs font-bold text-white line-clamp-1 mt-0.5">{subj.name}</h3>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Progress</span>
                  <span className="font-bold text-slate-200">{subj.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${subj.progressPercent}%` }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Content Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-black text-white">{selectedSubject.name}</h2>
            <p className="text-xs text-slate-400 mt-1">{selectedSubject.description}</p>
          </div>

          <div className="flex gap-2 bg-slate-950 p-1 rounded-xl text-xs font-bold border border-slate-800">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'notes' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              Topic Notes
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'interview' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              Interview Questions
            </button>
          </div>
        </div>

        {activeTab === 'notes' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedSubject.topics.map((top) => (
              <div key={top.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>{top.title}</span>
                  <button
                    onClick={() => setSelectedNote(top)}
                    className="text-[11px] text-indigo-400 hover:underline font-normal"
                  >
                    View Full Note
                  </button>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{top.notes}</p>
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1">
                  {top.keyPoints.map((kp, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                      &bull; {kp}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {selectedSubject.interviewQuestions.map((q, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-start gap-3 text-xs text-slate-200">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="font-medium">{q}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">{selectedNote.title}</h3>
              <button onClick={() => setSelectedNote(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedNote.notes}</p>

            <div>
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Key Highlights</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                {selectedNote.keyPoints.map((kp: string, idx: number) => (
                  <li key={idx}>{kp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
