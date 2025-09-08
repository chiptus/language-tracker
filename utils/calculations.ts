import {
  DailyPractice,
  Schedule,
  SkillPercentages,
  SuccessRates,
  WeeklyGoals,
  WeeklyPractice,
  WeeklySchedulePlan,
  SKILLS,
  DAYS_OF_WEEK,
} from "../types";

export function calculateWeeklyGoals(
  skillPercentages: SkillPercentages,
  schedule: Schedule,
): WeeklyGoals {
  const totalWeeklyMinutes = schedule.daysPerWeek * schedule.minutesPerDay;

  return {
    listening: Math.round(
      (skillPercentages.listening / 100) * totalWeeklyMinutes,
    ),
    reading: Math.round((skillPercentages.reading / 100) * totalWeeklyMinutes),
    writing: Math.round((skillPercentages.writing / 100) * totalWeeklyMinutes),
    speaking: Math.round(
      (skillPercentages.speaking / 100) * totalWeeklyMinutes,
    ),
    fluency: Math.round((skillPercentages.fluency / 100) * totalWeeklyMinutes),
    pronunciation: Math.round(
      (skillPercentages.pronunciation / 100) * totalWeeklyMinutes,
    ),
  };
}

export function calculateSuccessRates(
  actualMinutes: WeeklyPractice,
  goalMinutes: WeeklyGoals,
): SuccessRates {
  const getTotalMinutesForSkill = (skill: keyof DailyPractice): number => {
    return Object.values(actualMinutes).reduce(
      (total, day) => total + day[skill],
      0,
    );
  };

  return {
    listening:
      goalMinutes.listening > 0
        ? Math.min(
            getTotalMinutesForSkill("listening") / goalMinutes.listening,
            1,
          )
        : 0,
    reading:
      goalMinutes.reading > 0
        ? Math.min(getTotalMinutesForSkill("reading") / goalMinutes.reading, 1)
        : 0,
    writing:
      goalMinutes.writing > 0
        ? Math.min(getTotalMinutesForSkill("writing") / goalMinutes.writing, 1)
        : 0,
    speaking:
      goalMinutes.speaking > 0
        ? Math.min(
            getTotalMinutesForSkill("speaking") / goalMinutes.speaking,
            1,
          )
        : 0,
    fluency:
      goalMinutes.fluency > 0
        ? Math.min(getTotalMinutesForSkill("fluency") / goalMinutes.fluency, 1)
        : 0,
    pronunciation:
      goalMinutes.pronunciation > 0
        ? Math.min(
            getTotalMinutesForSkill("pronunciation") /
              goalMinutes.pronunciation,
            1,
          )
        : 0,
  };
}

export function getWeekDateRange(
  weekNumber: number,
  startDate: string,
): { start: string; end: string } {
  const start = new Date(startDate);
  const weekStart = new Date(start);
  weekStart.setDate(start.getDate() + (weekNumber - 1) * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return {
    start: weekStart.toISOString().split("T")[0],
    end: weekEnd.toISOString().split("T")[0],
  };
}

export function getCurrentWeekNumber(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 7);
}

export function formatMinutesToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${mins} min`;
  }
}

export function calculateTotalWeeklyMinutes(
  weeklyPractice: WeeklyPractice,
): number {
  return Object.values(weeklyPractice).reduce((total, day: DailyPractice) => {
    return (
      total +
      Object.values(day).reduce(
        (dayTotal: number, minutes: number) => dayTotal + minutes,
        0,
      )
    );
  }, 0);
}

export function calculateAverageSuccessRate(
  successRates: SuccessRates,
): number {
  const rates = Object.values(successRates);
  return rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
}

export function validateSkillPercentages(
  percentages: SkillPercentages,
): boolean {
  const total = Object.values(percentages).reduce(
    (sum, value) => sum + value,
    0,
  );
  return total === 100;
}

export function getEmptyDailyPractice(): DailyPractice {
  return {
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    fluency: 0,
    pronunciation: 0,
  };
}

export function getEmptyWeeklyPractice(): WeeklyPractice {
  return {
    monday: getEmptyDailyPractice(),
    tuesday: getEmptyDailyPractice(),
    wednesday: getEmptyDailyPractice(),
    thursday: getEmptyDailyPractice(),
    friday: getEmptyDailyPractice(),
    saturday: getEmptyDailyPractice(),
    sunday: getEmptyDailyPractice(),
  };
}

export function generateDefaultSchedulePlan(
  skillPercentages: SkillPercentages,
  schedule: Schedule
): WeeklySchedulePlan {
  const weeklyGoals = calculateWeeklyGoals(skillPercentages, schedule);
  const activeDays = DAYS_OF_WEEK.slice(0, schedule.daysPerWeek);
  
  // Create empty plan
  const plan: WeeklySchedulePlan = {
    monday: getEmptyDailyPractice(),
    tuesday: getEmptyDailyPractice(),
    wednesday: getEmptyDailyPractice(),
    thursday: getEmptyDailyPractice(),
    friday: getEmptyDailyPractice(),
    saturday: getEmptyDailyPractice(),
    sunday: getEmptyDailyPractice(),
  };

  // Distribute each skill evenly across active days
  SKILLS.forEach(skill => {
    const goalMinutes = weeklyGoals[skill];
    if (goalMinutes > 0) {
      const baseMinutesPerDay = Math.floor(goalMinutes / activeDays.length);
      const extraMinutes = goalMinutes % activeDays.length;

      activeDays.forEach((day, index) => {
        const minutes = baseMinutesPerDay + (index < extraMinutes ? 1 : 0);
        plan[day][skill] = minutes;
      });
    }
  });

  return plan;
}
