import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Mic,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  X,
  Play
} from 'lucide-react';
import { mockInterviewQuestions } from '../data/mockData';
import { InterviewQuestion } from '../types';

export const InterviewPrepPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Technical' | 'HR' | 'Behavioral' | 'Project'>('All');
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [userPracticeText, setUserPracticeText] = useState<string>('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const filteredQuestions = mockInterviewQuestions.filter((q) => {
    if (activeTab === 'All') return true;
    return q.category === activeTab;
  });

  const handleEvaluateAnswer = () => {
    if (!userPracticeText) return;
    setAiFeedback(
      `[AI Answer Evaluation]\n\nGreat attempt! Your response touches on key points. \n\nStrengths: Structured explanation.\nImprovement Suggestion: Be sure to emphasize specific metrics/data points (e.g. mention exact CGPA, project timeline, or memory savings) to sound even more convincing in HR/Technical rounds.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-400" />
          <span>Technical & HR Interview Preparation</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Practice standard technical, HR, behavioral, and project interview questions with AI feedback.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
        {(['All', 'Technical', 'HR', 'Behavioral', 'Project'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {tab} Questions
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuestions.map((iq) => (
          <div
            key={iq.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-lg transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {iq.subjectOrRole}
                </span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  {iq.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{iq.question}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{iq.sampleAnswer}</p>
            </div>

            <button
              onClick={() => {
                setSelectedQuestion(iq);
                setUserPracticeText('');
                setAiFeedback(null);
              }}
              className="w-full py-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-2"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Practice Answer</span>
            </button>
          </div>
        ))}
      </div>

      {/* Practice Answer Drawer Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-400">{selectedQuestion.category} &bull; {selectedQuestion.subjectOrRole}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedQuestion.question}</h3>
              </div>
              <button onClick={() => setSelectedQuestion(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Benchmark Sample Answer */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Ideal Benchmark Response
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedQuestion.sampleAnswer}</p>
            </div>

            {/* Practice Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">Type or Speak Your Answer</label>
              <textarea
                value={userPracticeText}
                onChange={(e) => setUserPracticeText(e.target.value)}
                placeholder="Practice speaking or typing your answer here..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-indigo-500"
              />
              <button
                onClick={handleEvaluateAnswer}
                disabled={!userPracticeText}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Evaluate with PrepVerse AI</span>
              </button>
            </div>

            {/* AI Feedback Display */}
            {aiFeedback && (
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 space-y-1">
                <p className="whitespace-pre-wrap">{aiFeedback}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
