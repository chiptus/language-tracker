import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Schedule } from '../../types';

interface SchedulePlanningStepProps {
  onNext: (schedule: Schedule) => void;
  onBack: () => void;
}

export default function SchedulePlanningStep({ onNext, onBack }: SchedulePlanningStepProps) {
  const [schedule, setSchedule] = useState<Schedule>({
    daysPerWeek: 4,
    minutesPerDay: 20,
  });

  const updateDaysPerWeek = (value: string) => {
    // Allow empty string for clearing
    if (value === '') {
      setSchedule(prev => ({
        ...prev,
        daysPerWeek: 0,
      }));
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 7) {
      setSchedule(prev => ({
        ...prev,
        daysPerWeek: numValue,
      }));
    }
  };

  const updateMinutesPerDay = (value: string) => {
    // Allow empty string for clearing
    if (value === '') {
      setSchedule(prev => ({
        ...prev,
        minutesPerDay: 0,
      }));
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 240) {
      setSchedule(prev => ({
        ...prev,
        minutesPerDay: numValue,
      }));
    }
  };

  const handleNext = () => {
    if (schedule.daysPerWeek >= 1 && schedule.minutesPerDay >= 1) {
      onNext(schedule);
    }
  };

  const calculateTotals = () => {
    const weeklyMinutes = schedule.daysPerWeek * schedule.minutesPerDay;
    const weeklyHours = Math.floor(weeklyMinutes / 60);
    const remainingMinutes = weeklyMinutes % 60;
    const monthlyHours = Math.round((weeklyHours + remainingMinutes / 60) * 4.33);
    const yearlyHours = Math.round((weeklyHours + remainingMinutes / 60) * 52);

    return {
      weeklyMinutes,
      weeklyHours,
      remainingMinutes,
      monthlyHours,
      yearlyHours,
    };
  };

  const totals = calculateTotals();
  const isValid = schedule.daysPerWeek >= 1 && schedule.minutesPerDay >= 1;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Paso 2: Planificación de Horario</Text>
          <Text style={styles.subtitle}>Step 2: Schedule Planning</Text>
          <Text style={styles.description}>
            Define cuántos días por semana y minutos por día dedicarás al estudio.
          </Text>
          <Text style={styles.descriptionEn}>
            Define how many days per week and minutes per day you'll dedicate to studying.
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.inputSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Días por semana / Days per week</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={schedule.daysPerWeek === 0 ? '' : schedule.daysPerWeek.toString()}
                  onChangeText={updateDaysPerWeek}
                  keyboardType="numeric"
                  maxLength={1}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <Text style={styles.inputUnit}>días</Text>
              </View>
              <Text style={styles.inputHint}>Rango: 1-7 días</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Minutos por día / Minutes per day</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={schedule.minutesPerDay === 0 ? '' : schedule.minutesPerDay.toString()}
                  onChangeText={updateMinutesPerDay}
                  keyboardType="numeric"
                  maxLength={3}
                  returnKeyType="done"
                />
                <Text style={styles.inputUnit}>min</Text>
              </View>
              <Text style={styles.inputHint}>Rango: 1-240 minutos</Text>
            </View>
          </View>

          <View style={styles.calculationSection}>
            <Text style={styles.calculationTitle}>Resumen de Tiempo / Time Summary</Text>
            
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Por semana / Per week:</Text>
              <Text style={styles.calculationValue}>
                {totals.weeklyHours > 0 
                  ? `${totals.weeklyHours}h ${totals.remainingMinutes}min` 
                  : `${totals.weeklyMinutes} min`
                }
              </Text>
            </View>

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Por mes / Per month:</Text>
              <Text style={styles.calculationValue}>~{totals.monthlyHours} horas</Text>
            </View>

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Por año / Per year:</Text>
              <Text style={styles.calculationValue}>~{totals.yearlyHours} horas</Text>
            </View>
          </View>

          <View style={styles.motivationSection}>
            <Text style={styles.motivationText}>
              "Consistency is key! Even {schedule.minutesPerDay} minutes daily will add up to significant progress."
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </Pressable>
        
        <Pressable 
          style={[
            styles.nextButton,
            { opacity: isValid ? 1 : 0.6 }
          ]} 
          onPress={handleNext}
          disabled={!isValid}
        >
          <Text style={styles.nextButtonText}>Siguiente →</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 5,
  },
  descriptionEn: {
    fontSize: 14,
    color: '#A0522D',
    textAlign: 'center',
  },
  content: {
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF5E6',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 18,
    color: '#8B4513',
    minWidth: 80,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputUnit: {
    fontSize: 16,
    color: '#8B4513',
    marginLeft: 10,
    fontWeight: '500',
  },
  inputHint: {
    fontSize: 12,
    color: '#A0522D',
    marginTop: 5,
    marginLeft: 5,
  },
  calculationSection: {
    backgroundColor: '#FDF5E6',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF8C00',
  },
  calculationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 15,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calculationLabel: {
    fontSize: 16,
    color: '#8B4513',
  },
  calculationValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  motivationSection: {
    backgroundColor: '#E6F3FF',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  motivationText: {
    fontSize: 14,
    color: '#1976D2',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF5E6',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  backButton: {
    backgroundColor: '#DDD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});