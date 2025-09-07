import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SkillPercentages, SKILLS } from '../../types';
import { validateSkillPercentages } from '../../utils/calculations';

interface SkillPriorityStepProps {
  onNext: (skillPercentages: SkillPercentages) => void;
  onBack: () => void;
}

export default function SkillPriorityStep({ onNext, onBack }: SkillPriorityStepProps) {
  const [skillPercentages, setSkillPercentages] = useState<SkillPercentages>({
    listening: 20,
    reading: 20,
    writing: 15,
    speaking: 25,
    fluency: 10,
    pronunciation: 10,
  });

  const totalPercentage = Object.values(skillPercentages).reduce((sum, value) => sum + value, 0);

  const updateSkillPercentage = (skill: keyof SkillPercentages, value: string) => {
    // Allow empty string for clearing
    if (value === '') {
      setSkillPercentages(prev => ({
        ...prev,
        [skill]: 0,
      }));
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setSkillPercentages(prev => ({
        ...prev,
        [skill]: numValue,
      }));
    }
  };

  const handleNext = () => {
    if (!validateSkillPercentages(skillPercentages)) {
      Alert.alert(
        'Error de Validación',
        'Los porcentajes deben sumar exactamente 100%. Actualmente suman ' + totalPercentage + '%.',
        [{ text: 'OK' }]
      );
      return;
    }
    onNext(skillPercentages);
  };

  const getSkillLabel = (skill: keyof SkillPercentages): string => {
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
          <Text style={styles.title}>Paso 1: Prioridades de Habilidades</Text>
          <Text style={styles.subtitle}>Step 1: Skill Priorities</Text>
          <Text style={styles.description}>
            Asigna porcentajes a cada habilidad. Deben sumar 100%.
          </Text>
          <Text style={styles.descriptionEn}>
            Assign percentages to each skill. They must total 100%.
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total: {totalPercentage}%
            </Text>
            <View style={[
              styles.totalIndicator,
              { backgroundColor: totalPercentage === 100 ? '#4CAF50' : '#FF6B6B' }
            ]} />
          </View>

          {SKILLS.map((skill) => (
            <View key={skill} style={styles.skillRow}>
              <Text style={styles.skillLabel}>{getSkillLabel(skill)}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={skillPercentages[skill] === 0 ? '' : skillPercentages[skill].toString()}
                  onChangeText={(value) => updateSkillPercentage(skill, value)}
                  keyboardType="numeric"
                  maxLength={3}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <Text style={styles.percentSign}>%</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </Pressable>
        
        <Pressable 
          style={[
            styles.nextButton,
            { opacity: totalPercentage === 100 ? 1 : 0.6 }
          ]} 
          onPress={handleNext}
          disabled={totalPercentage !== 100}
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
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#FDF5E6',
    borderRadius: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginRight: 10,
  },
  totalIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#FDF5E6',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  skillLabel: {
    fontSize: 16,
    color: '#8B4513',
    flex: 1,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#8B4513',
    minWidth: 60,
    textAlign: 'center',
  },
  percentSign: {
    fontSize: 16,
    color: '#8B4513',
    marginLeft: 5,
    fontWeight: 'bold',
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