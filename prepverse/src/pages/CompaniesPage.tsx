import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Briefcase,
  HelpCircle,
  FileCheck2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Search,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockCompanies as mockCompaniesFallback } from '../data/mockData';
import { contentService } from '../services/contentService';

export const CompaniesPage: React.FC = () => {
  // Bundled bank paints instantly; live MySQL rows replace it when the backend is up.
  const [mockCompanies, setBank] = useState(mockCompaniesFallback);
  useEffect(() => {
    contentService.getCompanies().then(setBank).catch(() => {});
  }, []);

  const { activeCompanyId, openCompanyDetail, navigate } = useApp();
  const [search, setSearch] = useState('');

  const selectedCompany = mockCompanies.find(c => c.id === activeCompanyId) || mockCompanies[0];

  const filteredCompanies = mockCompanies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.tier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-400" />
            <span>Company Preparation Kits</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Exam patterns, hiring workflows, top DSA topics, and HR preparation for top recruiters.
          </p>
        </div>

        {/* Disclaimer Note */}
        <div className="flex items-center gap-2 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Curated company-pattern preparation based on public recruitment benchmarks.</span>
        </div>
      </div>

      {/* Main 2-Column Split: Company Selector List vs Detailed Kit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Company Selector Grid */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search TCS, Amazon, Google..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
            {filteredCompanies.map((comp) => {
              const isSelected = comp.id === selectedCompany.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => openCompanyDetail(comp.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-600/10'
                      : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{comp.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          comp.tier === 'Super Dream'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : comp.tier === 'Product' || comp.tier === 'Dream'
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {comp.tier}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">Avg Package: {comp.averagePackage}</div>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Company Deep Dive Kit */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">{selectedCompany.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                  {selectedCompany.tier} Tier
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedCompany.overview}</p>
            </div>

            <button
              onClick={() => navigate('mock-tests')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 shrink-0"
            >
              Take Company Practice Test
            </button>
          </div>

          {/* Hiring Process Rounds */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-indigo-400 tracking-wider">Hiring Process & Workflow</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedCompany.hiringProcess.map((round, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5 text-xs text-slate-200">
                  <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{round}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Typical Exam Pattern */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-indigo-400 tracking-wider">Typical Assessment Pattern</h3>
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Section</th>
                    <th className="p-3">Questions</th>
                    <th className="p-3">Time Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {selectedCompany.examPattern.map((p, idx) => (
                    <tr key={idx}>
                      <td className="p-3 text-white">{p.section}</td>
                      <td className="p-3 text-slate-300">{p.questionsCount} Questions</td>
                      <td className="p-3 text-indigo-400">{p.timeMinutes} Minutes</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Important DSA Topics */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-indigo-400 tracking-wider">Important DSA & Technical Topics</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCompany.importantTopics.map((top, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold">
                  {top}
                </span>
              ))}
            </div>
          </div>

          {/* Sample Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Sample Technical Questions
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5">
                {selectedCompany.technicalQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-400" /> Sample HR Questions
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5">
                {selectedCompany.hrQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
