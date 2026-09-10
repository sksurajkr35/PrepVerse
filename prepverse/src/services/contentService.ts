import {
  AptitudeQuestion, MockTest, Company, CoreCSSubject, InterviewQuestion
} from '../types';
import {
  mockAptitudeQuestions, mockTestsList, mockCompanies,
  mockCoreCSSubjects, mockInterviewQuestions
} from '../data/mockData';
import { apiFetch } from './api';

/** GETs a reference bank from MySQL; falls back to the bundled copy offline. */
async function fetchBank<T>(path: string, fallback: T[]): Promise<T[]> {
  try {
    const list = await apiFetch<T[]>(path);
    if (Array.isArray(list) && list.length > 0) {
      return list;
    }
  } catch {
    // offline -> bundled fallback below
  }
  return fallback;
}

export const contentService = {
  getAptitude: (): Promise<AptitudeQuestion[]> =>
    fetchBank('/api/content/aptitude', mockAptitudeQuestions),
  getMockTests: (): Promise<MockTest[]> =>
    fetchBank('/api/content/mock-tests', mockTestsList),
  getCompanies: (): Promise<Company[]> =>
    fetchBank('/api/content/companies', mockCompanies),
  getCoreSubjects: (): Promise<CoreCSSubject[]> =>
    fetchBank('/api/content/core-subjects', mockCoreCSSubjects),
  getInterview: (): Promise<InterviewQuestion[]> =>
    fetchBank('/api/content/interview', mockInterviewQuestions)
};
