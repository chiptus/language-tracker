export interface SkillPercentages {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  fluency: number;
  pronunciation: number;
}

export interface Schedule {
  daysPerWeek: number;
  minutesPerDay: number;
}

export interface WeeklyGoals {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  fluency: number;
  pronunciation: number;
}

export interface UserProfile {
  skillPercentages: SkillPercentages;
  schedule: Schedule;
  startDate: string;
  weeklyGoals: WeeklyGoals;
}

export interface DailyPractice {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  fluency: number;
  pronunciation: number;
}

export interface WeeklyPractice {
  monday: DailyPractice;
  tuesday: DailyPractice;
  wednesday: DailyPractice;
  thursday: DailyPractice;
  friday: DailyPractice;
  saturday: DailyPractice;
  sunday: DailyPractice;
}

export interface WeeklyReflection {
  hardWorkRating: string;
  onTrackRating: string;
  moodRating: string;
  starRating: number;
}

export interface SuccessRates {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  fluency: number;
  pronunciation: number;
}

export interface WeeklyData {
  weekNumber: number;
  dateRange: {
    start: string;
    end: string;
  };
  dailyPractice: WeeklyPractice;
  weeklyReflection: WeeklyReflection;
  successRates: SuccessRates;
}

export interface ProgressData {
  totalMinutes: number;
  totalHours: number;
  averageSuccessRate: number;
  weeklyHistory: WeeklyData[];
  currentMotivation: string;
}

export type SkillType = keyof SkillPercentages;
export type DayOfWeek = keyof WeeklyPractice;

export const SKILLS: SkillType[] = [
  'listening',
  'reading',
  'writing',
  'speaking',
  'fluency',
  'pronunciation',
];

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const MOTIVATION_LEVELS = [
  'Super triste',
  'Triste',
  'Neutral',
  'Feliz',
  'Super feliz',
] as const;

export type MotivationLevel = typeof MOTIVATION_LEVELS[number];

export interface AppState {
  userProfile: UserProfile | null;
  currentWeekData: WeeklyData | null;
  progressData: ProgressData;
  isOnboarded: boolean | null;
}