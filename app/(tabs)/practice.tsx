import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { getEmptyDailyPractice } from '../../utils/calculations';
import DailyPracticeTracker from '../../components/practice/DailyPracticeTracker';
import { DailyPractice } from '../../types';

export default function PracticeScreen() {
  const { state, updateWeeklyData } = useApp();

  const dailyGoals = useMemo(() => {
    if (!state.userProfile) return getEmptyDailyPractice();
    
    // Calculate daily goals by dividing weekly goals by days per week
    const daysPerWeek = state.userProfile.schedule.daysPerWeek;
    return {
      listening: Math.round(state.userProfile.weeklyGoals.listening / daysPerWeek),
      reading: Math.round(state.userProfile.weeklyGoals.reading / daysPerWeek),
      writing: Math.round(state.userProfile.weeklyGoals.writing / daysPerWeek),
      speaking: Math.round(state.userProfile.weeklyGoals.speaking / daysPerWeek),
      fluency: Math.round(state.userProfile.weeklyGoals.fluency / daysPerWeek),
      pronunciation: Math.round(state.userProfile.weeklyGoals.pronunciation / daysPerWeek),
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

  if (!state.userProfile || !state.currentWeekData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontró el perfil de usuario o datos semanales</Text>
        <Text style={styles.errorSubtext}>User profile or weekly data not found</Text>
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
});