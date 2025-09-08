import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { getEmptyDailyPractice, getCurrentWeekNumber, getWeekDateRange, getEmptyWeeklyPractice } from '../../utils/calculations';
import DailyPracticeTracker from '../../components/practice/DailyPracticeTracker';
import { DailyPractice } from '../../types';

export default function PracticeScreen() {
  const { state, updateWeeklyData, dispatch } = useApp();

  // Initialize current week data if it doesn't exist
  useEffect(() => {
    if (state.userProfile && !state.currentWeekData) {
      const currentWeekNumber = getCurrentWeekNumber(state.userProfile.startDate);
      const dateRange = getWeekDateRange(currentWeekNumber, state.userProfile.startDate);
      const currentWeekData = {
        weekNumber: currentWeekNumber,
        dateRange,
        dailyPractice: getEmptyWeeklyPractice(),
        weeklyReflection: {
          hardWorkRating: '',
          onTrackRating: '',
          moodRating: '',
          starRating: 0,
        },
        successRates: {
          listening: 0,
          reading: 0,
          writing: 0,
          speaking: 0,
          fluency: 0,
          pronunciation: 0,
        },
      };
      dispatch({ type: 'SET_CURRENT_WEEK_DATA', payload: currentWeekData });
    }
  }, [state.userProfile, state.currentWeekData, dispatch]);

  const { dailyGoals, todaysPlannedMinutes } = useMemo(() => {
    if (!state.userProfile) {
      return {
        dailyGoals: getEmptyDailyPractice(),
        todaysPlannedMinutes: getEmptyDailyPractice()
      };
    }
    
    // Get today's day of week
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayKey = today as keyof typeof state.userProfile.weeklySchedulePlan;
    
    // Use custom schedule if available, otherwise fall back to even distribution
    if (state.userProfile.weeklySchedulePlan && state.userProfile.weeklySchedulePlan[dayKey]) {
      const todaysSchedule = state.userProfile.weeklySchedulePlan[dayKey];
      return {
        dailyGoals: todaysSchedule, // Today's actual planned minutes
        todaysPlannedMinutes: todaysSchedule // Today's planned minutes for timer
      };
    }
    
    // Fallback: Calculate daily goals by dividing weekly goals by days per week
    const daysPerWeek = state.userProfile.schedule.daysPerWeek;
    const fallbackGoals = {
      listening: Math.round(state.userProfile.weeklyGoals.listening / daysPerWeek),
      reading: Math.round(state.userProfile.weeklyGoals.reading / daysPerWeek),
      writing: Math.round(state.userProfile.weeklyGoals.writing / daysPerWeek),
      speaking: Math.round(state.userProfile.weeklyGoals.speaking / daysPerWeek),
      fluency: Math.round(state.userProfile.weeklyGoals.fluency / daysPerWeek),
      pronunciation: Math.round(state.userProfile.weeklyGoals.pronunciation / daysPerWeek),
    };
    
    return {
      dailyGoals: fallbackGoals,
      todaysPlannedMinutes: fallbackGoals
    };
  }, [state.userProfile]);

  const handleUpdatePractice = async (practice: DailyPractice) => {
    if (!state.currentWeekData || !state.userProfile) return;

    // Get current day of week
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayKey = today as keyof typeof state.currentWeekData.dailyPractice;

    const updatedWeekData = {
      ...state.currentWeekData,
      dailyPractice: {
        ...state.currentWeekData.dailyPractice,
        [dayKey]: practice,
      },
    };

    try {
      await updateWeeklyData(updatedWeekData);
    } catch (error) {
      console.error('Error updating practice:', error);
    }
  };

  if (!state.userProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontró el perfil de usuario</Text>
        <Text style={styles.errorSubtext}>User profile not found</Text>
      </View>
    );
  }

  if (!state.currentWeekData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Inicializando datos de la semana...</Text>
        <Text style={styles.loadingSubtext}>Initializing week data...</Text>
      </View>
    );
  }

  // Get today's practice data
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const dayKey = today as keyof typeof state.currentWeekData.dailyPractice;
  const todaysPractice = state.currentWeekData.dailyPractice[dayKey] || getEmptyDailyPractice();

  return (
    <DailyPracticeTracker
      dailyPractice={todaysPractice}
      dailyGoals={dailyGoals}
      todaysPlannedMinutes={todaysPlannedMinutes}
      onUpdatePractice={handleUpdatePractice}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#64B5F6',
    textAlign: 'center',
  },
});