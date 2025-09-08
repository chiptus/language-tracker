import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import WeeklySchedule from '../../components/schedule/WeeklySchedule';
import SchedulePlanner from '../../components/schedule/SchedulePlanner';
import { generateDefaultSchedulePlan } from '../../utils/calculations';

export default function ScheduleScreen() {
  const { state, saveUserProfile } = useApp();
  const [showPlanner, setShowPlanner] = useState(false);

  if (!state.userProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontró el perfil de usuario</Text>
        <Text style={styles.errorSubtext}>User profile not found</Text>
      </View>
    );
  }

  const handleSavePlan = async (plan: any) => {
    try {
      const updatedProfile = {
        ...state.userProfile,
        weeklySchedulePlan: plan,
      };
      await saveUserProfile(updatedProfile);
      setShowPlanner(false);
    } catch (error) {
      console.error('Error saving schedule plan:', error);
    }
  };

  if (showPlanner) {
    return (
      <SchedulePlanner
        weeklyGoals={state.userProfile.weeklyGoals}
        existingPlan={
          state.userProfile.weeklySchedulePlan || 
          generateDefaultSchedulePlan(state.userProfile.skillPercentages, state.userProfile.schedule)
        }
        onSavePlan={handleSavePlan}
        onCancel={() => setShowPlanner(false)}
      />
    );
  }

  return (
    <View style={styles.scheduleContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Horario / My Schedule</Text>
        <Pressable 
          style={styles.planButton}
          onPress={() => setShowPlanner(true)}
        >
          <Text style={styles.planButtonText}>
            ✏️ Editar Horario / Edit Schedule
          </Text>
        </Pressable>
      </View>
      
      <WeeklySchedule 
        weeklyGoals={state.userProfile.weeklyGoals}
        schedule={state.userProfile.schedule}
        skillPercentages={state.userProfile.skillPercentages}
        customPlan={
          state.userProfile.weeklySchedulePlan || 
          generateDefaultSchedulePlan(state.userProfile.skillPercentages, state.userProfile.schedule)
        }
      />
    </View>
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
  scheduleContainer: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 15,
  },
  planButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  planButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
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