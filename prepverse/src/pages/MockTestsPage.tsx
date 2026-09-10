import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Clock,
  Award,
  AlertCircle,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Trophy,
  BarChart2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { mockTestsList as mockTestsFallback } from '../data/mockData';
import { contentService } from '../services/contentService';
import { MockTest, TestAttemptResult } from '../types';
import { storageService } from '../services/storageService';

export const MockTestsPage: React.FC = () => {
  // Bundled bank paints instantly; live MySQL rows replace it when the backend is up.
  const [mockTestsList, setBank] = useState(mockTestsFallback);
  useEffect(() => {
    contentService.getMockTests().then(setBank).catch(() => {});
  }, []);

  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [testActive, setTestActive] = useState<boolean>(false);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [testResult, setTestResult] = useState<TestAttemptResult | null>(null);

  // Timer countdown
  useEffect(() => {
    if (testActive && timeLeftSeconds > 0) {
      const timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testActive, timeLeftSeconds]);

  const handleStartTest = (test: MockTest) => {
    setActiveTest(test);
    setTestActive(true);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setMarkedForReview({});
    setTimeLeftSeconds(test.durationMinutes * 60);
    setTestResult(null);
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;

    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    activeTest.questions.forEach((q, idx) => {
      const ans = selectedAnswers[idx];
      if (ans === undefined) {
        skipped++;
      } else if (q.correctIndex !== undefined && ans === q.correctIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const total = activeTest.questions.length || 1;
    const score = Math.round((correct / total) * activeTest.totalMarks);
    const accuracy = Math.round((correct / (correct + wrong || 1)) * 100);
    const percentile = Math.min(99, Math.round((score / activeTest.totalMarks) * 85 + 10));

    const result: TestAttemptResult = {
      testId: activeTest.id,
      score,
      totalMarks: activeTest.totalMarks,
      accuracy,
      correctAnswers: correct,
      wrongAnswers: wrong,
      skipped,
      percentile,
      topicBreakdown: { 'Core Section': accuracy },
      completedAt: new Date().toLocaleDateString()
    };

    setTestResult(result);
    setTestActive(false);
    storageService.saveTestAttempt(result);

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-indigo-400" />
            <span>Placement Mock Assessments</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Timed test simulations for TCS, Infosys, Amazon, and General Placement Drives.
          </p>
        </div>
      </div>

      {/* Mock Tests Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockTestsList.map((test) => (
          <div
            key={test.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {test.type}
                </span>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {test.durationMinutes} mins
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{test.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{test.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Best Score</span>
                <span className="text-sm font-bold text-emerald-400">{test.bestScore || 0} / {test.totalMarks}</span>
              </div>

              <button
                onClick={() => handleStartTest(test)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Assessment</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Test Interface Modal */}
      {testActive && activeTest && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
          {/* Top Bar */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">{activeTest.title}</h2>
              <span className="text-[10px] text-slate-400">Proctored Assessment Mode</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-mono font-bold">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>{formatTimer(timeLeftSeconds)}</span>
              </div>

              <button
                onClick={handleSubmitTest}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Submit Test
              </button>
            </div>
          </div>

          {/* Question Workspace */}
          <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto custom-scrollbar">
            {activeTest.questions.length > 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400">
                    Question {currentQIndex + 1} of {activeTest.questions.length}
                  </span>
                  <button
                    onClick={() => setMarkedForReview(prev => ({ ...prev, [currentQIndex]: !prev[currentQIndex] }))}
                    className={`text-xs font-semibold px-3 py-1 rounded-lg border ${
                      markedForReview[currentQIndex] ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {markedForReview[currentQIndex] ? '★ Marked for Review' : '☆ Mark for Review'}
                  </button>
                </div>

                <p className="text-sm text-white font-medium leading-relaxed">
                  {activeTest.questions[currentQIndex].text}
                </p>

                {/* Options */}
                {activeTest.questions[currentQIndex].options && (
                  <div className="space-y-2.5 pt-2">
                    {activeTest.questions[currentQIndex].options?.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQIndex]: optIdx }))}
                        className={`w-full p-3.5 rounded-xl text-xs text-left border font-medium transition-all ${
                          selectedAnswers[currentQIndex] === optIdx
                            ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex(c => c - 1)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentQIndex === activeTest.questions.length - 1}
                    onClick={() => setCurrentQIndex(c => c + 1)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold disabled:opacity-40"
                  >
                    Next Question
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Mock questions loading for this specific assessment tier...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Test Report Result Modal */}
      {testResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <Trophy className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white">Assessment Completed!</h2>
              <p className="text-xs text-slate-400 mt-1">Here is your comprehensive performance breakdown.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Score</span>
                <span className="text-lg font-bold text-white">{testResult.score} / {testResult.totalMarks}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Accuracy</span>
                <span className="text-lg font-bold text-emerald-400">{testResult.accuracy}%</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Percentile</span>
                <span className="text-lg font-bold text-indigo-400">{testResult.percentile}th</span>
              </div>
            </div>

            <button
              onClick={() => setTestResult(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Close & Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
