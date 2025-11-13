export interface MoodMetrics {
  userId: string;
  granularity: string;
  startDate: string;
  endDate: string;
  movingAvg: number;
  avgRating: number;
  trend: string;
  stdDeviation: number;
  stability: string;
  topTagOverall: TagData;
  topTagPositiveDays: TagData;
  topTagNegativeDays: TagData;
  topTagNeutralDays: TagData;
  topTagClinicalDays: TagData;
}

export interface TagData {
  tagName: string;
  count: number;
  percentage: number;
}

export interface SleepMetrics {
  userID: string;
  granularity: string;
  startDate: string;
  endDate: string;
  avgSleepHours: number;
  movingAvg: number;
  sleepTrend: string;
  stdDeviation: number;
  stability: string;
  bestSleepDay: string;
  worstSleepDay: string;
  topSleepQualityTag: TagData;
}

export interface MedicationStat {
  medicationId: number;
  name: string;
  totalDoses: number;
  daysActive: number;
  avgDosesPerDay: number;
  avgTakenAtTime: string;
  timingStdDevMinutes: number;
  timingDescription: string;
  earliestTime: string;
  latestTime: string;
  longestStreak: number;
  currentStreak: number;
}

export interface MedicationMetrics {
  userID: string;
  granularity: string;
  startDate: string;
  endDate: string;
  adherenceRate: number;
  medicationStats: MedicationStat[];
}