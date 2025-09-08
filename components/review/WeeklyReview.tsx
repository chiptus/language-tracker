import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { WeeklyData, WeeklyGoals, MOTIVATION_LEVELS } from '../../types';
import { formatMinutesToHours, calculateTotalWeeklyMinutes, calculateAverageSuccessRate } from '../../utils/calculations';
import { getQuoteForWeek } from '../../data/quotes';

interface WeeklyReviewProps {
  weekData: WeeklyData;
  weeklyGoals: WeeklyGoals;
  onSaveReview: (updatedWeekData: WeeklyData) => void;
}

export default function WeeklyReview({ weekData, weeklyGoals, onSaveReview }: WeeklyReviewProps) {
  const [hardWorkRating, setHardWorkRating] = useState(weekData.weeklyReflection.hardWorkRating);
  const [onTrackRating, setOnTrackRating] = useState(weekData.weeklyReflection.onTrackRating);
  const [moodRating, setMoodRating] = useState(weekData.weeklyReflection.moodRating);
  const [starRating, setStarRating] = useState(weekData.weeklyReflection.starRating);

  const quote = getQuoteForWeek(weekData.weekNumber);
  const totalPracticed = calculateTotalWeeklyMinutes(weekData.dailyPractice);
  const totalGoal = Object.values(weeklyGoals).reduce((sum, minutes) => sum + minutes, 0);
  const overallSuccessRate = calculateAverageSuccessRate(weekData.successRates);

  const getSkillComparison = () => {
    const skills = [
      { name: 'Escuchar', key: 'listening' as const, emoji: '🎧' },
      { name: 'Leer', key: 'reading' as const, emoji: '📖' },
      { name: 'Escribir', key: 'writing' as const, emoji: '✍️' },
      { name: 'Hablar', key: 'speaking' as const, emoji: '🗣' },
      { name: 'Fluidez', key: 'fluency' as const, emoji: '💬' },
      { name: 'Pronunciación', key: 'pronunciation' as const, emoji: '🔊' },
    ];

    return skills.map(skill => {
      const practiced = Object.values(weekData.dailyPractice).reduce(
        (sum, day) => sum + day[skill.key], 0
      );
      const goal = weeklyGoals[skill.key];
      const successRate = weekData.successRates[skill.key];
      
      return {
        ...skill,
        practiced,
        goal,
        successRate,
      };
    }).filter(skill => skill.goal > 0);
  };

  const skillComparison = getSkillComparison();

  const saveReview = () => {
    if (!hardWorkRating || !onTrackRating || !moodRating || starRating === 0) {
      Alert.alert(
        'Revisión Incompleta',
        'Por favor completa todas las preguntas de autoevaluación.',
        [{ text: 'OK' }]
      );
      return;
    }

    const updatedWeekData = {
      ...weekData,
      weeklyReflection: {
        hardWorkRating,
        onTrackRating,
        moodRating,
        starRating,
      },
    };

    onSaveReview(updatedWeekData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Revisión Semanal #{weekData.weekNumber}</Text>
        <Text style={styles.subtitle}>Weekly Review #{weekData.weekNumber}</Text>
        <Text style={styles.dateRange}>
          {weekData.dateRange.start} - {weekData.dateRange.end}
        </Text>
        
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{quote.text}"</Text>
          <Text style={styles.quoteTranslation}>"{quote.translation}"</Text>
        </View>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Resumen de la Semana / Week Summary</Text>
        
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tiempo Practicado</Text>
            <Text style={styles.summaryValue}>{formatMinutesToHours(totalPracticed)}</Text>
            <Text style={styles.summarySubtext}>Practiced Time</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Objetivo Semanal</Text>
            <Text style={styles.summaryValue}>{formatMinutesToHours(totalGoal)}</Text>
            <Text style={styles.summarySubtext}>Weekly Goal</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Éxito General</Text>
            <Text style={[
              styles.summaryValue,
              { color: overallSuccessRate >= 0.8 ? '#4CAF50' : overallSuccessRate >= 0.5 ? '#FF8C00' : '#FF6B6B' }
            ]}>
              {Math.round(overallSuccessRate * 100)}%
            </Text>
            <Text style={styles.summarySubtext}>Overall Success</Text>
          </View>
        </View>
      </View>

      <View style={styles.comparisonSection}>
        <Text style={styles.sectionTitle}>Planificado vs. Real / Planned vs. Actual</Text>
        
        {skillComparison.map((skill) => (
          <View key={skill.key} style={styles.comparisonRow}>
            <View style={styles.skillInfo}>
              <Text style={styles.skillEmoji}>{skill.emoji}</Text>
              <Text style={styles.skillName}>{skill.name}</Text>
            </View>
            
            <View style={styles.comparisonData}>
              <Text style={styles.comparisonText}>
                {skill.practiced} / {skill.goal} min
              </Text>
              <View style={styles.successIndicator}>
                <Text style={[
                  styles.successText,
                  { color: skill.successRate >= 0.8 ? '#4CAF50' : skill.successRate >= 0.5 ? '#FF8C00' : '#FF6B6B' }
                ]}>
                  {Math.round(skill.successRate * 100)}%
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.reflectionSection}>
        <Text style={styles.sectionTitle}>Autoevaluación / Self-Assessment</Text>
        
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>¿Trabajaste lo suficiente esta semana?</Text>
          <Text style={styles.questionSubtext}>Have you worked hard enough this week?</Text>
          <View style={styles.optionsContainer}>
            {['Sí, mucho', 'Bastante bien', 'Podría mejorar', 'No lo suficiente'].map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.optionButton,
                  hardWorkRating === option && styles.selectedOption
                ]}
                onPress={() => setHardWorkRating(option)}
              >
                <Text style={[
                  styles.optionText,
                  hardWorkRating === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>¿Estás en camino a lograr tu meta de español?</Text>
          <Text style={styles.questionSubtext}>Are you on track to achieve your Spanish goal?</Text>
          <View style={styles.optionsContainer}>
            {['Definitivamente sí', 'Creo que sí', 'No estoy seguro/a', 'Necesito cambios'].map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.optionButton,
                  onTrackRating === option && styles.selectedOption
                ]}
                onPress={() => setOnTrackRating(option)}
              >
                <Text style={[
                  styles.optionText,
                  onTrackRating === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>¿Cómo te sientes sobre el trabajo de esta semana?</Text>
          <Text style={styles.questionSubtext}>How do you feel about this week's work?</Text>
          <View style={styles.moodContainer}>
            {MOTIVATION_LEVELS.map((mood) => (
              <Pressable
                key={mood}
                style={[
                  styles.moodButton,
                  moodRating === mood && styles.selectedMood
                ]}
                onPress={() => setMoodRating(mood)}
              >
                <Text style={styles.moodEmoji}>
                  {mood === 'Super feliz' ? '😄' : 
                   mood === 'Feliz' ? '😊' : 
                   mood === 'Neutral' ? '😐' :
                   mood === 'Triste' ? '😔' : '😢'}
                </Text>
                <Text style={[
                  styles.moodText,
                  moodRating === mood && styles.selectedMoodText
                ]}>
                  {mood}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>Califica tu semana del 1 al 5 estrellas</Text>
          <Text style={styles.questionSubtext}>Rate your week from 1 to 5 stars</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                style={styles.starButton}
                onPress={() => setStarRating(star)}
              >
                <Text style={[
                  styles.starText,
                  { color: star <= starRating ? '#FFD700' : '#DDD' }
                ]}>
                  ⭐
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.actionSection}>
        <Pressable style={styles.saveButton} onPress={saveReview}>
          <Text style={styles.saveButtonText}>Guardar Revisión / Save Review</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 8,
  },
  dateRange: {
    fontSize: 16,
    color: '#A0522D',
    textAlign: 'center',
    marginBottom: 20,
  },
  quoteContainer: {
    backgroundColor: '#FDF5E6',
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
    width: '100%',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 8,
  },
  quoteTranslation: {
    fontSize: 14,
    color: '#A0522D',
    textAlign: 'center',
  },
  summarySection: {
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
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 2,
  },
  summarySubtext: {
    fontSize: 10,
    color: '#4CAF50',
    textAlign: 'center',
  },
  comparisonSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  skillInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  skillEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  comparisonData: {
    alignItems: 'flex-end',
  },
  comparisonText: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 2,
  },
  successIndicator: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  successText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  reflectionSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: '#FDF5E6',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 4,
  },
  questionSubtext: {
    fontSize: 14,
    color: '#A0522D',
    textAlign: 'center',
    marginBottom: 15,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#DDD',
  },
  selectedOption: {
    borderColor: '#FF8C00',
    backgroundColor: '#FFF3E0',
  },
  optionText: {
    fontSize: 14,
    color: '#8B4513',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#FF8C00',
    fontWeight: 'bold',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 10,
  },
  moodButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    minWidth: 60,
  },
  selectedMood: {
    backgroundColor: '#FFF3E0',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodText: {
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
  },
  selectedMoodText: {
    color: '#FF8C00',
    fontWeight: 'bold',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  starButton: {
    padding: 5,
  },
  starText: {
    fontSize: 36,
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});