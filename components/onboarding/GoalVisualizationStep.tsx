import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Schedule, SkillPercentages, SKILLS } from "../../types";
import { calculateWeeklyGoals } from "../../utils/calculations";

interface GoalVisualizationStepProps {
  skillPercentages: SkillPercentages;
  schedule: Schedule;
  onComplete: (startDate: string) => void;
  onBack: () => void;
}

export default function GoalVisualizationStep({
  skillPercentages,
  schedule,
  onComplete,
  onBack,
}: GoalVisualizationStepProps) {
  const startDate = new Date().toISOString().split("T")[0];

  const weeklyGoals = calculateWeeklyGoals(skillPercentages, schedule);
  const totalWeeklyMinutes = schedule.daysPerWeek * schedule.minutesPerDay;

  const getSkillLabel = (skill: keyof SkillPercentages): string => {
    const labels = {
      listening: "Escuchar / Listening",
      reading: "Leer / Reading",
      writing: "Escribir / Writing",
      speaking: "Hablar / Speaking",
      fluency: "Fluidez / Fluency",
      pronunciation: "Pronunciación / Pronunciation",
    };
    return labels[skill];
  };

  const formatMinutes = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    return `${minutes}min`;
  };

  const handleComplete = () => {
    onComplete(startDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paso 3: Visualización de Objetivos</Text>
        <Text style={styles.subtitle}>Step 3: Goal Visualization</Text>
        <Text style={styles.description}>
          Revisa tu plan personalizado y confirma para comenzar tu journey.
        </Text>
        <Text style={styles.descriptionEn}>
          Review your personalized plan and confirm to start your journey.
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>
            Resumen del Horario / Schedule Summary
          </Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Días por semana:</Text>
            <Text style={styles.summaryValue}>{schedule.daysPerWeek} días</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Minutos por día:</Text>
            <Text style={styles.summaryValue}>
              {schedule.minutesPerDay} min
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total semanal:</Text>
            <Text style={styles.summaryValue}>
              {formatMinutes(totalWeeklyMinutes)}
            </Text>
          </View>
        </View>

        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>
            Objetivos Semanales / Weekly Goals
          </Text>
          {SKILLS.map((skill) => (
            <View key={skill} style={styles.goalRow}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalSkill}>{getSkillLabel(skill)}</Text>
                <Text style={styles.goalPercentage}>
                  {skillPercentages[skill]}%
                </Text>
              </View>
              <Text style={styles.goalTime}>
                {formatMinutes(weeklyGoals[skill])}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>
            Horario Semanal Sugerido / Suggested Weekly Schedule
          </Text>
          <Text style={styles.scheduleNote}>
            Basado en {schedule.daysPerWeek} días de estudio por semana:
          </Text>

          {SKILLS.filter((skill) => weeklyGoals[skill] > 0).map((skill) => {
            const minutesPerDay = Math.round(
              weeklyGoals[skill] / schedule.daysPerWeek,
            );
            return (
              <View key={skill} style={styles.scheduleRow}>
                <Text style={styles.scheduleSkill}>{getSkillLabel(skill)}</Text>
                <Text style={styles.scheduleTime}>
                  ~{minutesPerDay} min/día
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.motivationSection}>
          <Text style={styles.motivationTitle}>¡Tu Journey Comienza Hoy!</Text>
          <Text style={styles.motivationText}>
            Con esta dedicación constante, estarás en camino hacia la fluidez en
            español. Recuerda: la consistencia es más importante que la
            perfección.
          </Text>
          <Text style={styles.motivationTextEn}>
            With this consistent dedication, you&apos;ll be on your way to
            Spanish fluency. Remember: consistency is more important than
            perfection.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </Pressable>

        <Pressable style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>¡Comenzar Journey!</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D2691E",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#8B4513",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#8B4513",
    textAlign: "center",
    marginBottom: 5,
  },
  descriptionEn: {
    fontSize: 14,
    color: "#A0522D",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  summarySection: {
    backgroundColor: "#FDF5E6",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF8C00",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D2691E",
    marginBottom: 15,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#8B4513",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8C00",
  },
  goalsSection: {
    backgroundColor: "#E8F5E8",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  goalInfo: {
    flex: 1,
  },
  goalSkill: {
    fontSize: 15,
    color: "#2E7D32",
    fontWeight: "500",
  },
  goalPercentage: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  goalTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  scheduleSection: {
    backgroundColor: "#E3F2FD",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  scheduleNote: {
    fontSize: 14,
    color: "#1976D2",
    marginBottom: 15,
    fontStyle: "italic",
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  scheduleSkill: {
    fontSize: 15,
    color: "#1976D2",
    flex: 1,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
  },
  motivationSection: {
    backgroundColor: "#FFF3E0",
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: "#FFB74D",
    alignItems: "center",
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F57C00",
    marginBottom: 15,
    textAlign: "center",
  },
  motivationText: {
    fontSize: 16,
    color: "#E65100",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 10,
  },
  motivationTextEn: {
    fontSize: 14,
    color: "#FF8F00",
    textAlign: "center",
    lineHeight: 20,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "#DDD",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  backButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
