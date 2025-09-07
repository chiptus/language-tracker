import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import WeeklySchedule from '../../components/schedule/WeeklySchedule';

export default function ScheduleScreen() {
  const { state } = useApp();

  if (!state.userProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontró el perfil de usuario</Text>
        <Text style={styles.errorSubtext}>User profile not found</Text>
      </View>
    );
  }

  return (
    <WeeklySchedule 
      weeklyGoals={state.userProfile.weeklyGoals}
      schedule={state.userProfile.schedule}
      skillPercentages={state.userProfile.skillPercentages}
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