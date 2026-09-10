export type ThemeMode = 'dark' | 'light';

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  graduationYear: number;
  targetRole: string;
  preferredLanguage: string;
  avatarUrl?: string;
  prepVerseScore: number;
  placementReadiness: number;
  codingRating: number;
  problemsSolved: number;
  mockTestsTaken: number;
  streakDays: number;
  xp: number;
  level: number;
  role: UserRole;
  githubUrl?: string;
  leetcodeUrl?: string;
  linkedinUrl?: string;
  codechefUrl?: string;
}

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  acceptanceRate: number;
  topic: string;
  companies: string[];
  status: 'Solved' | 'Attempted' | 'Unsolved';
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  hints: string[];
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
  starterCode: Record<string, string>; // language -> code template
}

export interface AptitudeQuestion {
  id: string;
  category: 'Quantitative' | 'Logical' | 'Verbal';
  topic: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface MockTest {
  id: string;
  title: string;
  type: 'Aptitude' | 'Coding' | 'Technical' | 'Verbal' | 'Full Placement' | 'Company';
  questionsCount: number;
  durationMinutes: number;
  difficulty: ProblemDifficulty;
  bestScore?: number;
  totalMarks: number;
  companyName?: string;
  description: string;
  questions: {
    id: string;
    text: string;
    options?: string[];
    correctIndex?: number;
    explanation?: string;
    type: 'mcq' | 'code';
    codeStarter?: string;
  }[];
}

export interface TestAttemptResult {
  testId: string;
  score: number;
  totalMarks: number;
  accuracy: number;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  percentile: number;
  topicBreakdown: Record<string, number>;
  completedAt: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  tier: 'Dream' | 'Super Dream' | 'Service' | 'Product';
  averagePackage: string; // e.g. "8.5 LPA"
  overview: string;
  hiringProcess: string[];
  examPattern: {
    section: string;
    questionsCount: number;
    timeMinutes: number;
  }[];
  importantTopics: string[];
  technicalQuestions: string[];
  hrQuestions: string[];
  rolesHiring: string[];
}

export interface CoreCSSubject {
  id: string;
  name: string;
  shortName: string;
  iconName: string;
  progressPercent: number;
  description: string;
  topics: {
    id: string;
    title: string;
    notes: string;
    keyPoints: string[];
  }[];
  mcqs: AptitudeQuestion[];
  interviewQuestions: string[];
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'HR' | 'Behavioral' | 'Project';
  subjectOrRole: string; // e.g. "C++", "DBMS", "HR"
  question: string;
  sampleAnswer: string;
  tips: string[];
  difficulty: ProblemDifficulty;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  college: string;
  rating: number;
  problemsSolved: number;
  score: number;
  avatarUrl: string;
  badge?: string;
  isCurrentUser?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'problems' | 'test' | 'rating';
}

export interface StudyPlanItem {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  topic: string;
  category: 'DSA' | 'Aptitude' | 'Core CS' | 'Interview';
  durationMinutes: number;
  completed: boolean;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
    summary: string;
  };
  education: {
    id: string;
    degree: string;
    institution: string;
    year: string;
    cgpaOrPercentage: string;
  }[];
  skills: {
    category: string;
    items: string;
  }[];
  projects: {
    id: string;
    title: string;
    techStack: string;
    description: string[];
    link?: string;
  }[];
  experience: {
    id: string;
    role: string;
    company: string;
    duration: string;
    highlights: string[];
  }[];
  achievements: string[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error';
  runtime: string;
  memory: string;
  submittedAt: string;
  code: string;
}
