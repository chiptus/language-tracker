import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { WeeklyGoals, WeeklySchedulePlan, SKILLS, DAYS_OF_WEEK, SkillType, DayOfWeek } from '../../types';
import { getEmptyDailyPractice } from '../../utils/calculations';

interface SchedulePlannerProps {
  weeklyGoals: WeeklyGoals;
  existingPlan?: WeeklySchedulePlan;
  onSavePlan: (plan: WeeklySchedulePlan) => void;
  onCancel: () => void;
}

const DAY_LABELS = {
  monday: { es: 'Lunes', en: 'Monday', short: 'Lun' },
  tuesday: { es: 'Martes', en: 'Tuesday', short: 'Mar' },
  wednesday: { es: 'Miércoles', en: 'Wednesday', short: 'Mié' },
  thursday: { es: 'Jueves', en: 'Thursday', short: 'Jue' },
  friday: { es: 'Viernes', en: 'Friday', short: 'Vie' },
  saturday: { es: 'Sábado', en: 'Saturday', short: 'Sáb' },
  sunday: { es: 'Domingo', en: 'Sunday', short: 'Dom' },
};

const SKILL_LABELS = {
  listening: { es: 'Escuchar', en: 'Listening', icon: '🎧', color: '#FF8C00' },
  reading: { es: 'Leer', en: 'Reading', icon: '📖', color: '#D2691E' },
  writing: { es: 'Escribir', en: 'Writing', icon: '✍️', color: '#4CAF50' },
  speaking: { es: 'Hablar', en: 'Speaking', icon: '🗣', color: '#2196F3' },
  fluency: { es: 'Fluidez', en: 'Fluency', icon: '💬', color: '#9C27B0' },
  pronunciation: { es: 'Pronunciación', en: 'Pronunciation', icon: '🔊', color: '#FF5722' },
};

export default function SchedulePlanner({ weeklyGoals, existingPlan, onSavePlan, onCancel }: SchedulePlannerProps) {
  const [schedulePlan, setSchedulePlan] = useState<WeeklySchedulePlan>(
    existingPlan || {
      monday: getEmptyDailyPractice(),
      tuesday: getEmptyDailyPractice(),
      wednesday: getEmptyDailyPractice(),
      thursday: getEmptyDailyPractice(),
      friday: getEmptyDailyPractice(),
      saturday: getEmptyDailyPractice(),
      sunday: getEmptyDailyPractice(),
    }
  );

  const [selectedSkill, setSelectedSkill] = useState<SkillType>('speaking');
  const [remainingMinutes, setRemainingMinutes] = useState<Record<SkillType, number>>({} as Record<SkillType, number>);

  useEffect(() => {
    // Calculate remaining minutes for each skill
    const remaining = {} as Record<SkillType, number>;
    SKILLS.forEach(skill => {
      const totalScheduled = DAYS_OF_WEEK.reduce((sum, day) => sum + schedulePlan[day][skill], 0);
      remaining[skill] = Math.max(0, weeklyGoals[skill] - totalScheduled);
    });
    setRemainingMinutes(remaining);
  }, [schedulePlan, weeklyGoals]);

  const updateDaySkill = (day: DayOfWeek, skill: SkillType, minutes: number) => {
    const numMinutes = Math.max(0, Math.min(minutes, 120)); // Max 2 hours per skill per day
    setSchedulePlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [skill]: numMinutes,
      },
    }));
  };

  const getTotalScheduled = (skill: SkillType): number => {
    return DAYS_OF_WEEK.reduce((sum, day) => sum + schedulePlan[day][skill], 0);
  };

  const isComplete = (): boolean => {
    return SKILLS.every(skill => getTotalScheduled(skill) === weeklyGoals[skill]);
  };

  const handleAutoDistribute = (skill: SkillType) => {
    const goalMinutes = weeklyGoals[skill];
    if (goalMinutes === 0) return;

    // Reset this skill to 0 first
    const resetPlan = { ...schedulePlan };
    DAYS_OF_WEEK.forEach(day => {
      resetPlan[day] = { ...resetPlan[day], [skill]: 0 };
    });

    // Distribute evenly across 7 days
    const baseMinutesPerDay = Math.floor(goalMinutes / 7);
    const extraMinutes = goalMinutes % 7;

    DAYS_OF_WEEK.forEach((day, index) => {
      const minutes = baseMinutesPerDay + (index < extraMinutes ? 1 : 0);
      resetPlan[day][skill] = minutes;
    });

    setSchedulePlan(resetPlan);
  };

  const handleSave = () => {
    const incomplete = SKILLS.filter(skill => getTotalScheduled(skill) !== weeklyGoals[skill]);
    
    if (incomplete.length > 0) {
      const incompleteSkills = incomplete.map(skill => SKILL_LABELS[skill].es).join(', ');
      Alert.alert(
        'Horario Incompleto / Incomplete Schedule',
        `Faltan minutos por asignar en: ${incompleteSkills}\n\nMissing minutes to assign in: ${incomplete.map(skill => SKILL_LABELS[skill].en).join(', ')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    onSavePlan(schedulePlan);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Planificador Semanal</Text>
        <Text style={styles.subtitle}>Weekly Schedule Planner</Text>
        <Text style={styles.description}>
          Distribuye tus minutos semanales de práctica como prefieras
        </Text>
        <Text style={styles.descriptionEn}>
          Distribute your weekly practice minutes as you prefer
        </Text>
      </View>

      {/* Skill Selection */}
      <View style={styles.skillSelector}>
        <Text style={styles.sectionTitle}>Selecciona Habilidad / Select Skill</Text>
        <View style={styles.skillButtons}>
          {SKILLS.filter(skill => weeklyGoals[skill] > 0).map(skill => (
            <Pressable
              key={skill}
              style={[
                styles.skillButton,
                { backgroundColor: selectedSkill === skill ? SKILL_LABELS[skill].color : '#FFF' },
                selectedSkill === skill && styles.selectedSkillButton
              ]}
              onPress={() => setSelectedSkill(skill)}
            >
              <Text style={styles.skillIcon}>{SKILL_LABELS[skill].icon}</Text>
              <Text style={[
                styles.skillButtonText,
                { color: selectedSkill === skill ? '#FFF' : SKILL_LABELS[skill].color }
              ]}>
                {SKILL_LABELS[skill].es}
              </Text>
              <Text style={[
                styles.skillProgress,
                { color: selectedSkill === skill ? '#FFF' : '#666' }
              ]}>
                {getTotalScheduled(skill)}/{weeklyGoals[skill]} min
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Current Skill Status */}
      <View style={styles.skillStatus}>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Meta Semanal / Weekly Goal</Text>
          <Text style={styles.statusValue}>{weeklyGoals[selectedSkill]} min</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Programado / Scheduled</Text>
          <Text style={styles.statusValue}>{getTotalScheduled(selectedSkill)} min</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Restante / Remaining</Text>
          <Text style={[
            styles.statusValue,
            { color: remainingMinutes[selectedSkill] === 0 ? '#4CAF50' : '#FF6B6B' }
          ]}>
            {remainingMinutes[selectedSkill]} min
          </Text>
        </View>
      </View>

      {/* Auto-distribute button */}
      <Pressable 
        style={styles.autoButton}
        onPress={() => handleAutoDistribute(selectedSkill)}
      >
        <Text style={styles.autoButtonText}>
          📅 Auto-distribuir / Auto-distribute
        </Text>
      </Pressable>

      {/* Daily Schedule */}
      <View style={styles.weeklyGrid}>
        <Text style={styles.sectionTitle}>
          {SKILL_LABELS[selectedSkill].icon} {SKILL_LABELS[selectedSkill].es} / {SKILL_LABELS[selectedSkill].en}
        </Text>
        
        {DAYS_OF_WEEK.map(day => (
          <View key={day} style={styles.dayRow}>
            <View style={styles.dayLabel}>
              <Text style={styles.dayName}>{DAY_LABELS[day].es}</Text>
              <Text style={styles.dayNameEn}>{DAY_LABELS[day].en}</Text>
            </View>
            
            <View style={styles.minuteInput}>
              <TextInput
                style={styles.input}
                value={schedulePlan[day][selectedSkill].toString()}
                onChangeText={(text) => {
                  const minutes = parseInt(text) || 0;
                  updateDaySkill(day, selectedSkill, minutes);
                }}
                keyboardType="numeric"
                placeholder="0"
                maxLength={3}
              />
              <Text style={styles.inputLabel}>min</Text>
            </View>

            <View style={styles.dayTotal}>
              <Text style={styles.dayTotalText}>
                Total: {Object.values(schedulePlan[day]).reduce((sum, mins) => sum + mins, 0)} min
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancelar / Cancel</Text>
        </Pressable>
        
        <Pressable 
          style={[
            styles.saveButton,
            { backgroundColor: isComplete() ? '#4CAF50' : '#CCC' }
          ]} 
          onPress={handleSave}
          disabled={!isComplete()}
        >
          <Text style={styles.saveButtonText}>
            {isComplete() ? '✅ Guardar / Save' : '⏳ Incomplete'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  header: {
    padding: 20,
    alignItems: 'center',
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
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 4,
  },
  descriptionEn: {
    fontSize: 12,
    color: '#A0522D',
    textAlign: 'center',
  },
  skillSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 15,
  },
  skillButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  skillButton: {
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  selectedSkillButton: {
    borderColor: 'transparent',
  },
  skillIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  skillButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  skillProgress: {
    fontSize: 10,
  },
  skillStatus: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#FDF5E6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 10,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D2691E',
  },
  autoButton: {
    backgroundColor: '#2196F3',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  autoButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  weeklyGrid: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF5E6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  dayLabel: {
    flex: 1,
  },
  dayName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  dayNameEn: {
    fontSize: 10,
    color: '#A0522D',
  },
  minuteInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 10,
  },
  input: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    minWidth: 40,
    paddingVertical: 8,
  },
  inputLabel: {
    fontSize: 12,
    color: '#A0522D',
    marginLeft: 4,
  },
  dayTotal: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dayTotalText: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});