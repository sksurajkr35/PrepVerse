import { ResumeData, StudyPlanItem } from '../types';
import { mockResumeData, mockStudyPlan } from '../data/mockData';
import { apiFetch, getToken } from './api';

const RESUME_KEY = 'prepverse_resume';
const PLAN_KEY = 'prepverse_study_plan';

export interface StudyPlanState {
  targetCompany: string;
  dailyHours: string;
  currentLevel: string;
  items: StudyPlanItem[];
}

const DEFAULT_PLAN: StudyPlanState = {
  targetCompany: 'Amazon',
  dailyHours: '4',
  currentLevel: 'Intermediate',
  items: mockStudyPlan
};

function readCache<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch {
    // ignore
  }
  return fallback;
}

function writeCache(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

const timers: Record<string, ReturnType<typeof setTimeout> | undefined> = {};

function debounced(key: string, fn: () => void, ms = 800): void {
  clearTimeout(timers[key]);
  timers[key] = setTimeout(fn, ms);
}

function isResumeData(v: unknown): v is ResumeData {
  return !!v && typeof v === 'object' && 'personalInfo' in v && 'projects' in v;
}

function isPlanState(v: unknown): v is StudyPlanState {
  return !!v && typeof v === 'object' && Array.isArray((v as StudyPlanState).items);
}

/**
 * Resume + study-plan store: synchronous localStorage cache for instant
 * paint (works offline), debounced PUT sync to MySQL when logged in.
 */
export const userDataService = {
  getCachedResume(): ResumeData {
    const cached = readCache<ResumeData>(RESUME_KEY, mockResumeData);
    return isResumeData(cached) ? cached : mockResumeData;
  },

  async fetchResume(): Promise<ResumeData> {
    if (!getToken()) {
      return this.getCachedResume();
    }
    try {
      const data = await apiFetch<ResumeData>('/api/resume');
      if (data && isResumeData(data)) {
        writeCache(RESUME_KEY, data);
        return data;
      }
    } catch {
      // offline / never saved -> cached copy
    }
    return this.getCachedResume();
  },

  saveResume(resume: ResumeData): void {
    writeCache(RESUME_KEY, resume);
    if (!getToken()) {
      return;
    }
    const snapshot = JSON.stringify(resume);
    debounced('resume', () => {
      apiFetch('/api/resume', { method: 'PUT', body: snapshot }).catch(() => {});
    });
  },

  getCachedPlan(): StudyPlanState {
    const cached = readCache<StudyPlanState>(PLAN_KEY, DEFAULT_PLAN);
    return isPlanState(cached) ? cached : DEFAULT_PLAN;
  },

  async fetchPlan(): Promise<StudyPlanState> {
    if (!getToken()) {
      return this.getCachedPlan();
    }
    try {
      const data = await apiFetch<StudyPlanState>('/api/study-plan');
      if (data && isPlanState(data)) {
        const normalized: StudyPlanState = {
          targetCompany: data.targetCompany || DEFAULT_PLAN.targetCompany,
          dailyHours: data.dailyHours || DEFAULT_PLAN.dailyHours,
          currentLevel: data.currentLevel || DEFAULT_PLAN.currentLevel,
          items: data.items
        };
        writeCache(PLAN_KEY, normalized);
        return normalized;
      }
    } catch {
      // offline / never saved -> cached copy
    }
    return this.getCachedPlan();
  },

  savePlan(plan: StudyPlanState): void {
    writeCache(PLAN_KEY, plan);
    if (!getToken()) {
      return;
    }
    const snapshot = JSON.stringify(plan);
    debounced('study-plan', () => {
      apiFetch('/api/study-plan', { method: 'PUT', body: snapshot }).catch(() => {});
    });
  }
};
