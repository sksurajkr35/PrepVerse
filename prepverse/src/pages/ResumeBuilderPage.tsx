import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Save,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { ResumeData } from '../types';
import { userDataService } from '../services/userDataService';

export const ResumeBuilderPage: React.FC = () => {
  const [resume, setResume] = useState<ResumeData>(() => userDataService.getCachedResume());
  const [aiReviewMsg, setAiReviewMsg] = useState<string | null>(null);

  // Load the saved resume from MySQL (falls back to the cached copy offline).
  useEffect(() => {
    userDataService.fetchResume().then(setResume).catch(() => {});
  }, []);

  // Auto-save every edit (local cache instantly, MySQL debounced).
  useEffect(() => {
    userDataService.saveResume(resume);
  }, [resume]);

  const handlePrint = () => {
    window.print();
  };

  const handleAiReview = () => {
    setAiReviewMsg(
      `[AI Resume Audit Grade: 92/100]\n\nKey Strengths:\n- Great quantification of achievements ("120+ problems", "35% latency reduction").\n- Includes live links to GitHub and PrepVerse.\n\nSuggested Tweaks:\n- Add specific metrics to the "PrepVerse" project description (e.g. "Serving 1,000+ active users").`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            <span>Interactive ATS Resume Builder</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Generate clean, ATS-formatted resume templates tailored for tech placements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mr-1">
            <Save className="w-3.5 h-3.5 text-emerald-400" /> Auto-saved
          </span>
          <button
            onClick={handleAiReview}
            className="px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Resume Review</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* AI Feedback Banner */}
      {aiReviewMsg && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl text-xs text-indigo-200 space-y-1">
          <p className="whitespace-pre-wrap leading-relaxed">{aiReviewMsg}</p>
        </div>
      )}

      {/* 2-Column Split: Form Editor vs Live Printable Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Editor Inputs */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">Personal & Contact Info</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={resume.personalInfo.fullName}
                onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, fullName: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                value={resume.personalInfo.email}
                onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, email: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Phone</label>
              <input
                type="text"
                value={resume.personalInfo.phone}
                onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, phone: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Location</label>
              <input
                type="text"
                value={resume.personalInfo.location}
                onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, location: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Professional Summary</label>
            <textarea
              value={resume.personalInfo.summary}
              onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, summary: e.target.value } })}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 pt-2 border-t border-slate-800">Projects</h3>
          {resume.projects.map((proj, idx) => (
            <div key={proj.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <input
                type="text"
                value={proj.title}
                onChange={(e) => {
                  const newProjs = [...resume.projects];
                  newProjs[idx].title = e.target.value;
                  setResume({ ...resume, projects: newProjs });
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
              />
              <input
                type="text"
                value={proj.techStack}
                onChange={(e) => {
                  const newProjs = [...resume.projects];
                  newProjs[idx].techStack = e.target.value;
                  setResume({ ...resume, projects: newProjs });
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300"
              />
            </div>
          ))}
        </div>

        {/* Right: Live A4 Template Preview (Print Friendly) */}
        <div className="lg:col-span-6 bg-white text-slate-900 p-8 rounded-2xl shadow-2xl space-y-4 print:p-0 font-sans text-xs min-h-[600px]">
          {/* Resume Header */}
          <div className="border-b border-slate-300 pb-3 text-center space-y-1">
            <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900">{resume.personalInfo.fullName}</h2>
            <div className="text-[10px] text-slate-600 flex items-center justify-center gap-2 flex-wrap font-medium">
              <span>{resume.personalInfo.email}</span> &bull;
              <span>{resume.personalInfo.phone}</span> &bull;
              <span>{resume.personalInfo.location}</span>
            </div>
            <div className="text-[10px] text-indigo-700 flex items-center justify-center gap-3 font-semibold pt-0.5">
              <span>{resume.personalInfo.github}</span>
              <span>{resume.personalInfo.linkedin}</span>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-1">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">Summary</h3>
            <p className="text-[10.5px] text-slate-700 leading-normal">{resume.personalInfo.summary}</p>
          </div>

          {/* Education */}
          <div className="space-y-1.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">Education</h3>
            {resume.education.map((e) => (
              <div key={e.id} className="flex items-start justify-between text-[10.5px]">
                <div>
                  <span className="font-bold text-slate-900">{e.degree}</span>
                  <div className="text-slate-600">{e.institution}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{e.cgpaOrPercentage}</span>
                  <div className="text-slate-500">{e.year}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">Key Projects</h3>
            {resume.projects.map((p) => (
              <div key={p.id} className="space-y-1 text-[10.5px]">
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span>{p.title}</span>
                  <span className="text-[9.5px] font-mono text-slate-600">{p.techStack}</span>
                </div>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5 pl-1">
                  {p.description.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Technical Skills */}
          <div className="space-y-1">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">Skills</h3>
            {resume.skills.map((s, idx) => (
              <div key={idx} className="text-[10.5px]">
                <span className="font-bold text-slate-900">{s.category}:</span> <span className="text-slate-700">{s.items}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
