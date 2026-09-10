import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, User, GraduationCap, Code2, Briefcase, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void; initialMode?: 'login' | 'signup' }> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { setUser, loginDemoUser } = useApp();

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginDemoUser();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('surya@dtu.ac.in');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Surya Rastogi');
  const [college, setCollege] = useState('Delhi Technological University (DTU)');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [targetRole, setTargetRole] = useState('Software Development Engineer (SDE-1)');
  const [preferredLanguage, setPreferredLanguage] = useState('C++');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await authService.login(email, password);
      setUser(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await authService.signup({
        name,
        email,
        college,
        branch,
        graduationYear: parseInt(graduationYear) || 2026,
        targetRole,
        preferredLanguage,
        password
      });
      setUser(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {mode === 'login' ? 'Welcome Back to PrepVerse' : 'Create Your PrepVerse Account'}
              </h3>
              <p className="text-[11px] text-slate-400">Learn. Practice. Compete. Get Placed.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setMode('login')}
            className={`py-2 text-center rounded-lg transition-colors ${
              mode === 'login' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`py-2 text-center rounded-lg transition-colors ${
              mode === 'signup' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register (Student)
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">College Email / Personal Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                    placeholder="student@dtu.ac.in"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0" />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset instructions sent to email.'); }} className="text-indigo-400 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In to Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
                <span className="relative px-2 bg-slate-900 text-[10px] text-slate-500 uppercase">Or continue with</span>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/30 text-xs font-semibold text-indigo-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Instant Guest Demo Access
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">College</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Grad Year</label>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Target Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white"
                >
                  <option>Software Development Engineer (SDE-1)</option>
                  <option>Data Analyst / Scientist</option>
                  <option>Cloud / DevOps Engineer</option>
                  <option>Product Manager</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Password (min 6 characters)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white"
                    placeholder="Choose a strong password"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-colors mt-2"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
