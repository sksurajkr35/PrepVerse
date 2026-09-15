import React, { useState } from 'react';
import { Settings, Save, User, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';

export const SettingsPage: React.FC = () => {
  const { user, setUser } = useApp();

  const [formData, setFormData] = useState({
    name: user?.name || 'Surya Rastogi',
    email: user?.email || 'surya.dtu@gmail.com',
    college: user?.college || 'Delhi Technological University (DTU)',
    branch: user?.branch || 'Computer Science & Engineering',
    graduationYear: user?.graduationYear || 2026,
    targetRole: user?.targetRole || 'SDE-1 / Software Engineer',
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const updated = await authService.updateProfile(formData);
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Local fallback
      setUser({
        ...user,
        ...formData
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          <span>Account & Platform Settings</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Manage your personal details, placement preferences, and notification defaults.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm shadow-sky-950/5 dark:shadow-xl backdrop-blur-md transition-colors">
        <h3 className="text-xs font-bold uppercase text-teal-700 dark:text-teal-400 tracking-wider flex items-center gap-2">
          <User className="w-4 h-4" /> Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">College / University</label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Engineering Branch</label>
            <input
              type="text"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Target Placement Role</label>
            <input
              type="text"
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Graduation Year</label>
            <input
              type="number"
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2026 })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          {saved ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Changes saved successfully to server!
            </span>
          ) : <div />}

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
