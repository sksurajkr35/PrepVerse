import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Users, Code2, FileCheck2, Trophy, Trash2, Pencil,
  Plus, RefreshCw, AlertTriangle, CheckCircle2, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiFetch } from '../services/api';
import { User, Problem } from '../types';

interface AdminStats {
  totalUsers: number;
  totalProblems: number;
  totalSubmissions: number;
  totalTestAttempts: number;
  acceptedSubmissions: number;
}

interface AdminProblemDetail {
  problem: Problem;
  testCases: { id: number; input: string; expectedOutput: string; hidden: boolean; position: number }[];
}

const EMPTY_FORM = {
  title: '', topic: 'Arrays', difficulty: 'Medium', description: '',
  expectedTimeComplexity: 'O(N)', expectedSpaceComplexity: 'O(1)',
  companies: '', constraints: '', hints: '', cppStarter: '', pythonStarter: '',
  examples: '', testCases: ''
};

type Tab = 'overview' | 'problems' | 'users';

export const AdminPage: React.FC = () => {
  const { user } = useApp();
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, p, u] = await Promise.all([
        apiFetch<AdminStats>('/api/admin/stats'),
        apiFetch<Problem[]>('/api/admin/problems'),
        apiFetch<User[]>('/api/admin/users')
      ]);
      setStats(s);
      setProblems(p);
      setUsers(u);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAll().catch(() => {});
    }
  }, [user?.role]);

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto mt-16 bg-slate-900 border border-rose-500/30 rounded-2xl p-8 text-center">
        <ShieldCheck className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h1 className="text-lg font-bold text-white">Access denied</h1>
        <p className="text-xs text-slate-400 mt-1">This portal is restricted to PrepVerse administrators.</p>
      </div>
    );
  }

  const set = (k: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const lines = (v: string) => v.split('\n').map(s => s.trim()).filter(Boolean);

  /** One test case per line:  input === expected === hidden(0/1, optional) */
  const parseCases = (v: string) =>
    lines(v).map(l => {
      const [input = '', expectedOutput = '', hidden = '0'] = l.split('===').map(s => s.trim());
      return { input, expectedOutput, hidden: hidden === '1' };
    });

  /** One example per line:  input === output === explanation(optional) */
  const parseExamples = (v: string) =>
    lines(v).map(l => {
      const [input = '', output = '', explanation = ''] = l.split('===').map(s => s.trim());
      return { input, output, explanation };
    });

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
  };

  const handleEdit = async (id: string) => {
    setError(null);
    try {
      const detail = await apiFetch<AdminProblemDetail>(`/api/admin/problems/${id}`);
      const p = detail.problem;
      setForm({
        title: p.title,
        topic: p.topic,
        difficulty: p.difficulty,
        description: p.description,
        expectedTimeComplexity: p.expectedTimeComplexity,
        expectedSpaceComplexity: p.expectedSpaceComplexity,
        companies: p.companies.join(', '),
        constraints: p.constraints.join('\n'),
        hints: p.hints.join('\n'),
        cppStarter: p.starterCode['cpp'] ?? '',
        pythonStarter: p.starterCode['python'] ?? '',
        examples: p.examples.map(e => `${e.input} === ${e.output}${e.explanation ? ` === ${e.explanation}` : ''}`).join('\n'),
        testCases: detail.testCases.map(t => `${t.input} === ${t.expectedOutput} === ${t.hidden ? '1' : '0'}`).join('\n')
      });
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load problem');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const starterCode: Record<string, string> = {};
      if (form.cppStarter.trim()) starterCode['cpp'] = form.cppStarter;
      if (form.pythonStarter.trim()) starterCode['python'] = form.pythonStarter;
      const payload = {
        title: form.title.trim(),
        topic: form.topic.trim() || 'Arrays',
        difficulty: form.difficulty,
        description: form.description,
        expectedTimeComplexity: form.expectedTimeComplexity,
        expectedSpaceComplexity: form.expectedSpaceComplexity,
        companies: form.companies.split(',').map(s => s.trim()).filter(Boolean),
        constraints: lines(form.constraints),
        hints: lines(form.hints),
        starterCode,
        examples: parseExamples(form.examples),
        testCases: parseCases(form.testCases)
      };
      if (editingId) {
        await apiFetch(`/api/admin/problems/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
        flash('Problem updated successfully.');
      } else {
        await apiFetch('/api/admin/problems', { method: 'POST', body: JSON.stringify(payload) });
        flash('Problem added to the question bank.');
      }
      resetForm();
      const p = await apiFetch<Problem[]>('/api/admin/problems');
      setProblems(p);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}" and all its test cases?`)) return;
    setError(null);
    try {
      await apiFetch(`/api/admin/problems/${id}`, { method: 'DELETE' });
      setProblems(prev => prev.filter(p => p.id !== id));
      flash('Problem deleted.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleRole = async (u: User, role: 'student' | 'admin') => {
    if (!window.confirm(`Set ${u.name} (${u.email}) as ${role}?`)) return;
    setError(null);
    try {
      const updated = await apiFetch<User>(`/api/admin/users/${u.id}/role`, {
        method: 'PUT', body: JSON.stringify({ role })
      });
      setUsers(prev => prev.map(x => (x.id === u.id ? updated : x)));
      flash(`Role updated for ${u.name}.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Role update failed');
    }
  };

  const inputCls = 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-indigo-500';
  const labelCls = 'text-slate-300 font-medium block mb-1 text-xs';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span>PrepVerse Admin Portal</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Faculty / Placement Officer dashboard — live data from MySQL.
          </p>
        </div>
        <button
          onClick={loadAll}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      {notice && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {notice}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs font-bold w-fit">
        {(['overview', 'problems', 'users'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl transition-all capitalize ${
              tab === t ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-xs text-slate-400 py-10">Loading admin data…</div>
      ) : (
        <>
          {tab === 'overview' && stats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { icon: Users, label: 'Students', value: stats.totalUsers, color: 'text-indigo-400' },
                { icon: Code2, label: 'Problems', value: stats.totalProblems, color: 'text-emerald-400' },
                { icon: FileCheck2, label: 'Submissions', value: stats.totalSubmissions, color: 'text-amber-400' },
                { icon: Trophy, label: 'Accepted', value: stats.acceptedSubmissions, color: 'text-cyan-400' },
                { icon: CheckCircle2, label: 'Mock Attempts', value: stats.totalTestAttempts, color: 'text-rose-400' }
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <Icon className={`w-5 h-5 ${s.color} mb-2`} />
                    <div className="text-xl font-black text-white">{s.value}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">{s.label}</div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'problems' && (
            <div className="space-y-4">
              {/* Add / Edit form */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h3 className="text-xs font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2 mb-4">
                  {editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingId ? `Editing problem ${editingId}` : 'Add new placement problem'}
                  {editingId && (
                    <button onClick={resetForm} className="ml-auto text-slate-400 hover:text-white flex items-center gap-1 normal-case">
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}
                </h3>
                <form onSubmit={handleSave} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className={labelCls}>Title *</label>
                      <input required value={form.title} onChange={set('title')} className={inputCls} placeholder="e.g. Two Sum" />
                    </div>
                    <div>
                      <label className={labelCls}>Topic</label>
                      <input value={form.topic} onChange={set('topic')} className={inputCls} placeholder="Arrays" />
                    </div>
                    <div>
                      <label className={labelCls}>Difficulty</label>
                      <select value={form.difficulty} onChange={set('difficulty')} className={inputCls}>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Description (include Input/Output format)</label>
                    <textarea rows={4} value={form.description} onChange={set('description')} className={`${inputCls} font-mono`} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Expected Time</label>
                      <input value={form.expectedTimeComplexity} onChange={set('expectedTimeComplexity')} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Expected Space</label>
                      <input value={form.expectedSpaceComplexity} onChange={set('expectedSpaceComplexity')} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Companies (comma-separated)</label>
                    <input value={form.companies} onChange={set('companies')} className={inputCls} placeholder="Amazon, Google" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Constraints (one per line)</label>
                      <textarea rows={2} value={form.constraints} onChange={set('constraints')} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Hints (one per line)</label>
                      <textarea rows={2} value={form.hints} onChange={set('hints')} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Visible examples (one per line: input === output === explanation?)</label>
                    <textarea rows={2} value={form.examples} onChange={set('examples')} className={`${inputCls} font-mono`} placeholder="4 2 7 11 15 9 === 0 1" />
                  </div>
                  <div>
                    <label className={labelCls}>Judge test cases (one per line: input === expected === hidden 0/1?)</label>
                    <textarea rows={3} value={form.testCases} onChange={set('testCases')} className={`${inputCls} font-mono`} placeholder="4 2 7 11 15 9 === 0 1 === 1" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>C++ starter (full program)</label>
                      <textarea rows={4} value={form.cppStarter} onChange={set('cppStarter')} className={`${inputCls} font-mono`} />
                    </div>
                    <div>
                      <label className={labelCls}>Python starter (full program)</label>
                      <textarea rows={4} value={form.pythonStarter} onChange={set('pythonStarter')} className={`${inputCls} font-mono`} />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-50"
                  >
                    {saving ? 'Saving…' : editingId ? 'Update Problem' : 'Add Problem'}
                  </button>
                </form>
              </div>

              {/* Problems table */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Topic</th>
                        <th className="py-3 px-4">Difficulty</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {problems.map(p => (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-4 font-mono text-slate-400">{p.id}</td>
                          <td className="py-2.5 px-4 font-bold text-white">{p.title}</td>
                          <td className="py-2.5 px-4 text-slate-300">{p.topic}</td>
                          <td className="py-2.5 px-4 text-slate-300">{p.difficulty}</td>
                          <td className="py-2.5 px-4 text-right whitespace-nowrap">
                            <button onClick={() => handleEdit(p.id)} className="p-1.5 text-indigo-400 hover:text-indigo-300" title="Edit">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(p.id, p.title)} className="p-1.5 text-rose-400 hover:text-rose-300" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">College</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">Solved</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-4">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="py-2.5 px-4 text-slate-300">{u.college}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-emerald-400">{u.prepVerseScore}</td>
                        <td className="py-2.5 px-4 text-slate-300">{u.problemsSolved}</td>
                        <td className="py-2.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {u.id !== user?.id && (
                            <button
                              onClick={() => handleRole(u, u.role === 'admin' ? 'student' : 'admin')}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold"
                            >
                              {u.role === 'admin' ? 'Demote' : 'Make admin'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
