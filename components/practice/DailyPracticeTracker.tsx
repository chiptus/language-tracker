import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SkillType, DailyPractice, SKILLS } from '../../types';
import { formatMinutesToHours } from '../../utils/calculations';
import Timer from './Timer';

interface DailyPracticeTrackerProps {
  dailyPractice: DailyPractice;
  dailyGoals: DailyPractice; // Goals distributed per day
  onUpdatePractice: (practice: DailyPractice) => Promise<void>;
}

export default function DailyPracticeTracker({ 
  dailyPractice, 
  dailyGoals, 
  onUpdatePractice 
}: DailyPracticeTrackerProps) {
  const [activeSkill, setActiveSkill] = useState<SkillType | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(0);

  const getSkillLabel = (skill: SkillType): string => {
    const labels = {
      listening: 'Escuchar / Listening',
      reading: 'Leer / Reading', 
      writing: 'Escribir / Writing',
      speaking: 'Hablar / Speaking',
      fluency: 'Fluidez / Fluency',
      pronunciation: 'Pronunciación / Pronunciation',
    };
    return labels[skill];
  };

  const getSkillEmoji = (skill: SkillType): string => {
    const emojis = {
      listening: '🎧',
      reading: '📖',
      writing: '✍️',
      speaking: '🗣',
      fluency: '💬',
      pronunciation: '🔊',
    };
    return emojis[skill];
  };

  const startSkillSession = (skill: SkillType) => {
    if (activeSkill && activeSkill !== skill) {
      Alert.alert(
        'Cambiar Habilidad',
        `¿Quieres cambiar de ${getSkillLabel(activeSkill)} a ${getSkillLabel(skill)}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Cambiar', 
            onPress: () => {
              setActiveSkill(skill);
              setCurrentSession(0);
              setIsTimerRunning(false);
            }
          },
        ]
      );
      return;
    }
    setActiveSkill(skill);
    setCurrentSession(0);
  };

  const handleTimerStart = () => {
    setIsTimerRunning(true);
  };

  const handleTimerPause = () => {
    setIsTimerRunning(false);
  };

  const handleTimerReset = () => {
    setCurrentSession(0);
    setIsTimerRunning(false);
  };

  const handleTimeUpdate = (seconds: number) => {
    setCurrentSession(seconds);
  };

  const saveSession = async () => {
    if (!activeSkill || currentSession < 60) {
      Alert.alert(
        'Sesión muy corta',
        'Las sesiones deben ser de al menos 1 minuto para ser guardadas.',
        [{ text: 'OK' }]
      );
      return;
    }

    const minutes = Math.floor(currentSession / 60);
    const updatedPractice = {
      ...dailyPractice,
      [activeSkill]: dailyPractice[activeSkill] + minutes,
    };

    try {
      await onUpdatePractice(updatedPractice);
      
      Alert.alert(
        '¡Sesión Guardada!',
        `Se han agregado ${minutes} minuto${minutes !== 1 ? 's' : ''} de ${getSkillLabel(activeSkill)}.`,
        [{ text: 'Continuar', onPress: () => {
          setCurrentSession(0);
          setIsTimerRunning(false);
        }}]
      );
    } catch {
      Alert.alert(
        'Error',
        'No se pudo guardar la sesión. Intenta de nuevo.',
        [{ text: 'OK' }]
      );
    }
  };

  const getProgressPercentage = (skill: SkillType): number => {
    const goal = dailyGoals[skill];
    const practiced = dailyPractice[skill];
    return goal > 0 ? Math.min((practiced / goal) * 100, 100) : 0;
  };

  const getTotalPracticed = (): number => {
    return Object.values(dailyPractice).reduce((sum, minutes) => sum + minutes, 0);
  };

  const getTotalGoal = (): number => {
    return Object.values(dailyGoals).reduce((sum, minutes) => sum + minutes, 0);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Práctica de Hoy</Text>
        <Text style={styles.subtitle}>Today's Practice</Text>
        
        <View style={styles.totalProgress}>
          <Text style={styles.totalLabel}>Progreso Total del Día</Text>
          <Text style={styles.totalTime}>
            {formatMinutesToHours(getTotalPracticed())} / {formatMinutesToHours(getTotalGoal())}
          </Text>
          <View style={styles.totalProgressBar}>
            <View 
              style={[
                styles.totalProgressFill, 
                { width: `${Math.min((getTotalPracticed() / getTotalGoal()) * 100, 100)}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {activeSkill && (
        <View style={styles.activeSession}>
          <Text style={styles.activeSkillTitle}>
            {getSkillEmoji(activeSkill)} {getSkillLabel(activeSkill)}
          </Text>
          
          <Timer
            isRunning={isTimerRunning}
            targetMinutes={Math.round(dailyGoals[activeSkill] / 4)} // Suggest 1/4 of daily goal as session length
            onTimeUpdate={handleTimeUpdate}
            onStart={handleTimerStart}
            onPause={handleTimerPause}
            onReset={handleTimerReset}
            onComplete={() => {
              saveSession();
            }}
          />
          
          <View style={styles.sessionActions}>
            <Pressable 
              style={[styles.actionButton, styles.saveButton]}
              onPress={saveSession}
              disabled={currentSession < 60}
            >
              <Text style={styles.saveButtonText}>
                Guardar Sesión ({Math.floor(currentSession / 60)} min)
              </Text>
            </Pressable>
            
            <Pressable 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                setActiveSkill(null);
                setCurrentSession(0);
                setIsTimerRunning(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.skillsSection}>
        <Text style={styles.sectionTitle}>Selecciona una Habilidad</Text>
        
        {SKILLS.filter(skill => dailyGoals[skill] > 0).map((skill) => {
          const progress = getProgressPercentage(skill);
          const isComplete = progress >= 100;
          
          return (
            <Pressable 
              key={skill}
              style={[
                styles.skillCard,
                activeSkill === skill && styles.activeSkillCard,
                isComplete && styles.completeSkillCard,
              ]}
              onPress={() => startSkillSession(skill)}
            >
              <View style={styles.skillHeader}>
                <View style={styles.skillInfo}>
                  <Text style={styles.skillEmoji}>{getSkillEmoji(skill)}</Text>
                  <View style={styles.skillTextInfo}>
                    <Text style={styles.skillName}>{getSkillLabel(skill)}</Text>
                    <Text style={styles.skillTime}>
                      {dailyPractice[skill]} / {dailyGoals[skill]} min
                    </Text>
                  </View>
                </View>
                <View style={styles.skillStatus}>
                  {isComplete && <Text style={styles.completeIcon}>✅</Text>}
                  <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>
              </View>
              
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${progress}%`,
                      backgroundColor: isComplete ? '#4CAF50' : '#FF8C00'
                    }
                  ]} 
                />
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>💡 Consejos de Práctica</Text>
        <Text style={styles.tipText}>• Usa auriculares para listening</Text>
        <Text style={styles.tipText}>• Habla en voz alta para speaking y pronunciation</Text>
        <Text style={styles.tipText}>• Toma descansos entre habilidades diferentes</Text>
        <Text style={styles.tipText}>• Practica en un ambiente sin distracciones</Text>
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
    marginBottom: 20,
  },
  totalProgress: {
    backgroundColor: '#FDF5E6',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  totalTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D2691E',
    marginBottom: 10,
  },
  totalProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#DDD',
    borderRadius: 4,
    overflow: 'hidden',
  },
  totalProgressFill: {
    height: '100%',
    backgroundColor: '#FF8C00',
    borderRadius: 4,
  },
  activeSession: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  activeSkillTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 15,
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skillsSection: {
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
  skillCard: {
    backgroundColor: '#FDF5E6',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  activeSkillCard: {
    backgroundColor: '#E3F2FD',
    borderLeftColor: '#2196F3',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  completeSkillCard: {
    backgroundColor: '#E8F5E8',
    borderLeftColor: '#4CAF50',
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  skillInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  skillEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  skillTextInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 2,
  },
  skillTime: {
    fontSize: 14,
    color: '#A0522D',
  },
  skillStatus: {
    alignItems: 'center',
  },
  completeIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#DDD',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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