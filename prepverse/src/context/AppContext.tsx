import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Problem, ThemeMode } from '../types';
import { authService } from '../services/authService';
import { apiFetch, getToken, onUnauthorized } from '../services/api';
import { storageService } from '../services/storageService';
import { mockProblems } from '../data/mockData';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  theme: ThemeMode;
  activeTab: string;
  currentProblem: Problem | null;
  activeCompanyId: string | null;
  activeSubjectId: string | null;
  searchQuery: string;
  notifications: string[];
  solvedCount: number;
  prepVerseScore: number;

  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  navigate: (tab: string, extraId?: string) => void;
  openProblemInArena: (problem: Problem) => void;
  openCompanyDetail: (companyId: string) => void;
  openSubjectDetail: (subjectId: string) => void;
  setSearchQuery: (query: string) => void;
  markProblemSolved: (problemId: string, code: string, language: string) => void;
  loginDemoUser: () => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function initialTheme(): ThemeMode {
  const serverTheme = authService.getCurrentUser()?.theme;
  if (serverTheme === 'light' || serverTheme === 'dark') {
    return serverTheme;
  }
  const saved = localStorage.getItem('prepverse_theme');
  return saved === 'light' ? 'light' : 'dark';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [theme, setThemeState] = useState<ThemeMode>(initialTheme);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(mockProblems[0]);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>('comp_amazon');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>('dbms');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>(() => storageService.getSolvedProblemIds());

  const streakDays = user?.streakDays ?? 0;
  const notifications = [
    streakDays > 0
      ? `🔥 ${streakDays} Day Streak achieved! Keep grinding!`
      : '🔥 Solve a problem today to start your streak!',
    '🎯 New Mock Test "TCS NQT National Qualifier" is live.',
    '💡 Amazon updated hiring pattern for 2026 Batch.',
    '🏆 You jumped 2 ranks in College Leaderboard!'
  ];

  // Theme: localStorage instantly + document class, MySQL in the background.
  useEffect(() => {
    localStorage.setItem('prepverse_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (getToken()) {
      apiFetch('/api/users/me', { method: 'PUT', body: JSON.stringify({ theme }) }).catch(() => {});
    }
  }, [theme]);

  // Refresh profile from the Java backend on load (when a JWT exists)
  useEffect(() => {
    authService.fetchMe().then((u) => {
      if (u) {
        setUser(u);
        if (u.theme === 'light' || u.theme === 'dark') {
          setThemeState(u.theme);
        }
      }
    }).catch(() => {});
  }, []);

  // Backend rejected our JWT (401 expired/invalid) -> bounce to landing.
  useEffect(() => {
    return onUnauthorized(() => {
      setUser(null);
      setActiveTab('landing');
    });
  }, []);

  const loginDemoUser = async () => {
    const demoUser = await authService.demoLogin();
    setUser(demoUser);
    if (demoUser.theme === 'light' || demoUser.theme === 'dark') {
      setThemeState(demoUser.theme);
    }
    setActiveTab('dashboard');
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const navigate = (tab: string, extraId?: string) => {
    setActiveTab(tab);
    if (extraId) {
      if (tab === 'companies') setActiveCompanyId(extraId);
      if (tab === 'core-cs') setActiveSubjectId(extraId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProblemInArena = (problem: Problem) => {
    setCurrentProblem(problem);
    setActiveTab('compiler');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCompanyDetail = (companyId: string) => {
    setActiveCompanyId(companyId);
    setActiveTab('companies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSubjectDetail = (subjectId: string) => {
    setActiveSubjectId(subjectId);
    setActiveTab('core-cs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markProblemSolved = (problemId: string, code: string, language: string) => {
    storageService.markProblemSolved(problemId, code, language);
    const updatedSolved = storageService.getSolvedProblemIds();
    setSolvedProblemIds(updatedSolved);

    if (user) {
      const newScore = Math.min(1000, user.prepVerseScore + 5);
      const newReadiness = Math.min(100, Math.floor(newScore / 10));
      const updatedUser: User = {
        ...user,
        problemsSolved: updatedSolved.length,
        prepVerseScore: newScore,
        placementReadiness: newReadiness,
        xp: user.xp + 100
      };
      authService.updateProfile(updatedUser);
      setUser(updatedUser);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setActiveTab('landing');
  };

  // Recalculated values
  const solvedCount = solvedProblemIds.length;
  const prepVerseScore = user ? user.prepVerseScore : 742;

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        theme,
        activeTab,
        currentProblem,
        activeCompanyId,
        activeSubjectId,
        searchQuery,
        notifications,
        solvedCount,
        prepVerseScore,

        setUser,
        setTheme,
        toggleTheme,
        navigate,
        openProblemInArena,
        openCompanyDetail,
        openSubjectDetail,
        setSearchQuery,
        markProblemSolved,
        loginDemoUser,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
