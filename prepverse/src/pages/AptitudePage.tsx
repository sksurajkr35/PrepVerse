import React, { useState, useEffect } from 'react';
import {
  Brain,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Trophy,
  BarChart3
} from 'lucide-react';
import { mockAptitudeQuestions as mockAptitudeFallback } from '../data/mockData';
import { contentService } from '../services/contentService';
import { AptitudeQuestion } from '../types';

export const AptitudePage: React.FC = () => {
  // Bundled bank paints instantly; live MySQL rows replace it when the backend is up.
  const [mockAptitudeQuestions, setBank] = useState(mockAptitudeFallback);
  useEffect(() => {
    contentService.getAptitude().then(setBank).catch(() => {});
  }, []);

  const [activeCategory, setActiveCategory] = useState<'Quantitative' | 'Logical' | 'Verbal'>('Quantitative');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  
  // Track selected answers per question
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  const filteredQuestions = mockAptitudeQuestions.filter((q) => {
    const matchCat = q.category === activeCategory;
    const matchTop = selectedTopic === 'All' || q.topic === selectedTopic;
    return matchCat && matchTop;
  });

  const topicsList = Array.from(
    new Set(mockAptitudeQuestions.filter(q => q.category === activeCategory).map(q => q.topic))
  );

  const handleSelectOption = (qId: string, optionIdx: number) => {
    if (answers[qId] !== undefined) return; // Prevent re-selection
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    setShowExplanations(prev => ({ ...prev, [qId]: true }));
  };

  const calculatedScore = Object.entries(answers).reduce((acc, [qId, optIdx]) => {
    const q = mockAptitudeQuestions.find(item => item.id === qId);
    if (q && q.correctAnswerIndex === optIdx) return acc + 1;
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Brain className="w-6 h-6 text-amber-400" />
            <span>Aptitude & Reasoning Practice</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Quantitative Aptitude, Logical Reasoning & Verbal Ability for placement assessments.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300 font-semibold">Score: <span className="text-amber-400 font-bold">{calculatedScore}</span> / {Object.keys(answers).length} Attempted</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs font-bold">
        {(['Quantitative', 'Logical', 'Verbal'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSelectedTopic('All');
            }}
            className={`py-3 rounded-xl transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {cat === 'Quantitative' ? 'Quantitative Aptitude' : cat === 'Logical' ? 'Logical Reasoning' : 'Verbal Ability'}
          </button>
        ))}
      </div>

      {/* Topics Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setSelectedTopic('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 ${
            selectedTopic === 'All' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          }`}
        >
          All Topics ({filteredQuestions.length})
        </button>
        {topicsList.map((top) => (
          <button
            key={top}
            onClick={() => setSelectedTopic(top)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
              selectedTopic === top ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {top}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, qIndex) => {
          const selectedOpt = answers[q.id];
          const isAnswered = selectedOpt !== undefined;
          const isCorrect = selectedOpt === q.correctAnswerIndex;

          return (
            <div key={q.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/20">
                    Q{qIndex + 1}
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded mr-2">
                      {q.topic}
                    </span>
                    <h3 className="text-sm font-semibold text-white mt-1 leading-snug">{q.question}</h3>
                  </div>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((option, optIdx) => {
                  let btnStyle = 'bg-slate-800/80 text-slate-200 border-slate-700/80 hover:bg-slate-800';

                  if (isAnswered) {
                    if (optIdx === q.correctAnswerIndex) {
                      btnStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold';
                    } else if (optIdx === selectedOpt) {
                      btnStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold';
                    } else {
                      btnStyle = 'bg-slate-950/40 text-slate-500 border-slate-900 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-slate-900/60 text-[10px] font-bold flex items-center justify-center text-slate-400">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isAnswered && optIdx === q.correctAnswerIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && optIdx === selectedOpt && optIdx !== q.correctAnswerIndex && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Section */}
              {isAnswered && (
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isCorrect ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' : 'bg-rose-500/10 border-rose-500/20 text-rose-200'
                }`}>
                  <span className="font-bold block mb-1">
                    {isCorrect ? '✓ Correct Answer!' : '✗ Incorrect. Explanation:'}
                  </span>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
