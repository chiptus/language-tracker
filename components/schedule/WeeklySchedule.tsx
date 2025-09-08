import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { WeeklyGoals, Schedule, SkillPercentages, WeeklySchedulePlan, SKILLS, DAYS_OF_WEEK, DayOfWeek } from '../../types';
import { formatMinutesToHours } from '../../utils/calculations';

interface WeeklyScheduleProps {
  weeklyGoals: WeeklyGoals;
  schedule: Schedule;
  skillPercentages: SkillPercentages;
  customPlan: WeeklySchedulePlan;
}

export default function WeeklySchedule({ weeklyGoals, schedule, skillPercentages, customPlan }: WeeklyScheduleProps) {
  const getSkillLabel = (skill: keyof SkillPercentages): string => {
    const labels = {
      listening: 'Escuchar',
      reading: 'Leer', 
      writing: 'Escribir',
      speaking: 'Hablar',
      fluency: 'Fluidez',
      pronunciation: 'Pronunciación',
    };
    return labels[skill];
  };

  const getDayLabel = (day: DayOfWeek): string => {
    const labels = {
      monday: 'Lun',
      tuesday: 'Mar',
      wednesday: 'Mié',
      thursday: 'Jue',
      friday: 'Vie',
      saturday: 'Sáb',
      sunday: 'Dom',
    };
    return labels[day];
  };

  // Generate daily breakdown from custom plan
  const generateDailySchedule = () => {
    return DAYS_OF_WEEK.map((day) => {
      const daySkills = SKILLS.filter(skill => customPlan[day][skill] > 0).map(skill => ({
        skill,
        minutes: customPlan[day][skill],
        percentage: skillPercentages[skill],
      }));

      return {
        day,
        skills: daySkills,
        totalMinutes: daySkills.reduce((sum, item) => sum + item.minutes, 0),
      };
    }).filter(dayData => dayData.totalMinutes > 0);
  };

  const dailySchedule = generateDailySchedule();
  const totalWeeklyMinutes = Object.values(weeklyGoals).reduce((sum, minutes) => sum + minutes, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Tu Horario Semanal</Text>
        <Text style={styles.subtitle}>Your Weekly Schedule</Text>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen Total</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Días de estudio:</Text>
            <Text style={styles.summaryValue}>{schedule.daysPerWeek} días</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tiempo semanal:</Text>
            <Text style={styles.summaryValue}>{formatMinutesToHours(totalWeeklyMinutes)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Promedio diario:</Text>
            <Text style={styles.summaryValue}>{schedule.minutesPerDay} min</Text>
          </View>
        </View>
      </View>

      <View style={styles.goalsSection}>
        <Text style={styles.sectionTitle}>Distribución por Habilidad</Text>
        {SKILLS.filter(skill => weeklyGoals[skill] > 0).map((skill) => (
          <View key={skill} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalSkill}>{getSkillLabel(skill)}</Text>
              <Text style={styles.goalPercentage}>{skillPercentages[skill]}%</Text>
            </View>
            <Text style={styles.goalTime}>{formatMinutesToHours(weeklyGoals[skill])} por semana</Text>
            <Text style={styles.goalDaily}>
              ~{Math.round(weeklyGoals[skill] / schedule.daysPerWeek)} min por día
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.scheduleSection}>
        <Text style={styles.sectionTitle}>Horario Diario Sugerido</Text>
        {dailySchedule.map((dayData) => (
          <View key={dayData.day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>{getDayLabel(dayData.day)}</Text>
              <Text style={styles.dayTotal}>{formatMinutesToHours(dayData.totalMinutes)}</Text>
            </View>
            
            <View style={styles.skillsContainer}>
              {dayData.skills.map((skillData) => (
                <View key={skillData.skill} style={styles.skillItem}>
                  <View style={styles.skillInfo}>
                    <Text style={styles.skillName}>{getSkillLabel(skillData.skill)}</Text>
                    <Text style={styles.skillMinutes}>{skillData.minutes} min</Text>
                  </View>
                  <View style={[
                    styles.skillBar,
                    { width: `${(skillData.minutes / schedule.minutesPerDay) * 100}%` }
                  ]} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>💡 Consejos para el Éxito</Text>
        <Text style={styles.tipText}>• Mantén consistencia en tus horarios de estudio</Text>
        <Text style={styles.tipText}>• Ajusta los tiempos según tu progreso</Text>
        <Text style={styles.tipText}>• Toma descansos entre diferentes habilidades</Text>
        <Text style={styles.tipText}>• Practica speaking y pronunciation en voz alta</Text>
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
  customBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  customBadgeText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#FDF5E6',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#8B4513',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  goalsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 15,
  },
  goalCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  goalSkill: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  goalPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  goalTime: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  goalDaily: {
    fontSize: 12,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  scheduleSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dayCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  dayTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  skillsContainer: {
    gap: 8,
  },
  skillItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  skillInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  skillName: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  skillMinutes: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  skillBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#E3F2FD',
    opacity: 0.5,
  },
  tipsSection: {
    backgroundColor: '#FFF3E0',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB74D',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 15,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#E65100',
    marginBottom: 8,
    lineHeight: 20,
  },
});