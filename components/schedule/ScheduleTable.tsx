import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  DayOfWeek,
  DAYS_OF_WEEK,
  SKILLS,
  SkillType,
  WeeklyGoals,
  WeeklySchedulePlan,
} from "../../types";

interface ScheduleTableProps {
  weeklyGoals: WeeklyGoals;
  initialPlan: WeeklySchedulePlan;
  onPlanChange: (plan: WeeklySchedulePlan) => void;
}

const DAY_LABELS = {
  monday: { es: "Lun", en: "Mon" },
  tuesday: { es: "Mar", en: "Tue" },
  wednesday: { es: "Mié", en: "Wed" },
  thursday: { es: "Jue", en: "Thu" },
  friday: { es: "Vie", en: "Fri" },
  saturday: { es: "Sáb", en: "Sat" },
  sunday: { es: "Dom", en: "Sun" },
};

const SKILL_LABELS = {
  listening: { es: "Escuchar", en: "Listening", icon: "🎧", color: "#FF8C00" },
  reading: { es: "Leer", en: "Reading", icon: "📖", color: "#D2691E" },
  writing: { es: "Escribir", en: "Writing", icon: "✍️", color: "#4CAF50" },
  speaking: { es: "Hablar", en: "Speaking", icon: "🗣", color: "#2196F3" },
  fluency: { es: "Fluidez", en: "Fluency", icon: "💬", color: "#9C27B0" },
  pronunciation: {
    es: "Pronunciación",
    en: "Pronunciation",
    icon: "🔊",
    color: "#FF5722",
  },
};

export default function ScheduleTable({
  weeklyGoals,
  initialPlan,
  onPlanChange,
}: ScheduleTableProps) {
  const [schedulePlan, setSchedulePlan] =
    useState<WeeklySchedulePlan>(initialPlan);

  useEffect(() => {
    setSchedulePlan(initialPlan);
  }, [initialPlan]);

  useEffect(() => {
    onPlanChange(schedulePlan);
  }, [schedulePlan, onPlanChange]);

  const updateCell = (day: DayOfWeek, skill: SkillType, minutes: number) => {
    const numMinutes = Math.max(0, Math.min(minutes, 120));
    setSchedulePlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [skill]: numMinutes,
      },
    }));
  };

  const getTotalForSkill = (skill: SkillType): number => {
    return DAYS_OF_WEEK.reduce((sum, day) => sum + schedulePlan[day][skill], 0);
  };

  const getTotalForDay = (day: DayOfWeek): number => {
    return SKILLS.reduce((sum, skill) => sum + schedulePlan[day][skill], 0);
  };

  const activeSkills = SKILLS.filter((skill) => weeklyGoals[skill] > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planificador Semanal / Weekly Planner</Text>

      <View style={styles.tableWrapper}>
        {/* Fixed Left Column - Skills */}
        <View style={styles.leftColumn}>
          {/* Corner cell */}
          <View style={[styles.cell, styles.cornerCell]}>
            <Text style={styles.cornerText}>Habilidad{"\n"}Skill</Text>
          </View>
          
          {/* Skill headers */}
          {activeSkills.map((skill) => (
            <View
              key={skill}
              style={[
                styles.cell,
                styles.skillHeaderCell,
                { borderLeftColor: SKILL_LABELS[skill].color },
              ]}
            >
              <Text style={styles.skillIcon}>{SKILL_LABELS[skill].icon}</Text>
              <Text style={styles.skillHeaderText}>
                {SKILL_LABELS[skill].es}
              </Text>
              <Text style={styles.skillHeaderTextEn}>
                {SKILL_LABELS[skill].en}
              </Text>
              <Text style={styles.skillGoal}>
                Meta: {weeklyGoals[skill]}m
              </Text>
            </View>
          ))}
          
          {/* Daily totals header */}
          <View style={[styles.cell, styles.totalHeaderCell]}>
            <Text style={styles.totalRowHeaderText}>Total Diario</Text>
            <Text style={styles.totalRowHeaderTextEn}>Daily Total</Text>
          </View>
        </View>

        {/* Scrollable Middle Section - Days */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.middleColumn}
        >
          <View style={styles.scrollableContent}>
            {/* Header row */}
            <View style={styles.headerRow}>
              {DAYS_OF_WEEK.map((day) => (
                <View key={day} style={[styles.cell, styles.headerCell]}>
                  <Text style={styles.dayHeaderText}>{DAY_LABELS[day].es}</Text>
                  <Text style={styles.dayHeaderTextEn}>{DAY_LABELS[day].en}</Text>
                </View>
              ))}
            </View>

            {/* Skill rows */}
            {activeSkills.map((skill) => (
              <View key={skill} style={styles.skillRow}>
                {DAYS_OF_WEEK.map((day) => (
                  <View key={day} style={[styles.cell, styles.inputCell]}>
                    <TextInput
                      style={styles.minuteInput}
                      value={schedulePlan[day][skill].toString()}
                      onChangeText={(text) => {
                        const minutes = parseInt(text) || 0;
                        updateCell(day, skill, minutes);
                      }}
                      keyboardType="numeric"
                      placeholder="0"
                      maxLength={3}
                      selectTextOnFocus
                    />
                    <Text style={styles.minuteLabel}>min</Text>
                  </View>
                ))}
              </View>
            ))}

            {/* Daily totals row */}
            <View style={[styles.skillRow, styles.totalsRow]}>
              {DAYS_OF_WEEK.map((day) => (
                <View key={day} style={[styles.cell, styles.dayTotalCell]}>
                  <Text style={styles.dayTotalText}>{getTotalForDay(day)}</Text>
                  <Text style={styles.dayTotalLabel}>min</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Fixed Right Column - Totals */}
        <View style={styles.rightColumn}>
          {/* Total header */}
          <View style={[styles.cell, styles.totalCell, { height: 45 }]}>
            <Text style={styles.totalHeaderText}>Total</Text>
          </View>
          
          {/* Skill totals */}
          {activeSkills.map((skill) => (
            <View key={skill} style={[styles.cell, styles.totalCell]}>
              <Text
                style={[
                  styles.skillTotalText,
                  {
                    color:
                      getTotalForSkill(skill) === weeklyGoals[skill]
                        ? "#4CAF50"
                        : "#FF6B6B",
                  },
                ]}
              >
                {getTotalForSkill(skill)}/{weeklyGoals[skill]}
              </Text>
            </View>
          ))}
          
          {/* Grand total */}
          <View style={[styles.cell, styles.grandTotalCell]}>
            <Text style={styles.grandTotalText}>
              {DAYS_OF_WEEK.reduce(
                (sum, day) => sum + getTotalForDay(day),
                0,
              )}
            </Text>
            <Text style={styles.grandTotalLabel}>min</Text>
          </View>
        </View>
      </View>

      {/* Validation Summary */}
      <View style={styles.validationSummary}>
        {activeSkills.map((skill) => {
          const total = getTotalForSkill(skill);
          const goal = weeklyGoals[skill];
          const isComplete = total === goal;
          const difference = total - goal;

          return (
            <View
              key={skill}
              style={[
                styles.validationItem,
                { backgroundColor: isComplete ? "#E8F5E8" : "#FFF3E0" },
              ]}
            >
              <Text style={styles.validationSkill}>
                {SKILL_LABELS[skill].icon} {SKILL_LABELS[skill].es}
              </Text>
              <Text
                style={[
                  styles.validationStatus,
                  {
                    color: isComplete
                      ? "#4CAF50"
                      : difference > 0
                        ? "#FF6B6B"
                        : "#FF8C00",
                  },
                ]}
              >
                {isComplete
                  ? "✅ Completo"
                  : difference > 0
                    ? `+${difference} min`
                    : `${Math.abs(difference)} min faltantes`}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF5E6",
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D2691E",
    textAlign: "center",
    marginBottom: 10,
  },
  tableContainer: {
    marginBottom: 10,
  },
  tableWrapper: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFF",
    marginBottom: 10,
  },
  leftColumn: {
    backgroundColor: "#F9F9F9",
    borderRightWidth: 1,
    borderRightColor: "#DDD",
  },
  middleColumn: {
    flex: 1,
  },
  rightColumn: {
    backgroundColor: "#F9F9F9",
    borderLeftWidth: 1,
    borderLeftColor: "#DDD",
  },
  scrollableContent: {
    backgroundColor: "#FFF",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
  },
  skillRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalsRow: {
    backgroundColor: "#FFF3E0",
  },
  cell: {
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    height: 50, // Fixed height instead of minHeight
  },
  cornerCell: {
    width: 70,
    backgroundColor: "#EEEEEE",
    height: 45, // Smaller height for header
  },
  cornerText: {
    fontSize: 9,
    color: "#666",
    textAlign: "center",
    fontWeight: "600",
  },
  headerCell: {
    width: 40,
    backgroundColor: "#F0F8FF",
    height: 45, // Same as corner cell
  },
  dayHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2196F3",
    textAlign: "center",
  },
  dayHeaderTextEn: {
    fontSize: 8,
    color: "#64B5F6",
    textAlign: "center",
  },
  skillHeaderCell: {
    width: 70,
    backgroundColor: "#FDF5E6",
    borderLeftWidth: 3,
    height: 60, // Taller for skill content
  },
  skillIcon: {
    fontSize: 12,
    marginBottom: 1,
  },
  skillHeaderText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#8B4513",
    textAlign: "center",
    marginBottom: 1,
  },
  skillHeaderTextEn: {
    fontSize: 7,
    color: "#A0522D",
    textAlign: "center",
    marginBottom: 1,
  },
  skillGoal: {
    fontSize: 7,
    color: "#FF8C00",
    fontWeight: "bold",
    textAlign: "center",
  },
  inputCell: {
    width: 40,
    backgroundColor: "#FAFAFA",
    height: 60, // Same as skill header cells
  },
  minuteInput: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#D2691E",
    textAlign: "center",
    width: 28,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  minuteLabel: {
    fontSize: 7,
    color: "#A0522D",
    marginTop: 1,
  },
  totalCell: {
    width: 45,
    backgroundColor: "#F0F8FF",
    height: 60, // Same as skill rows
  },
  skillTotalText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  totalHeaderCell: {
    width: 70,
    backgroundColor: "#FFF3E0",
    height: 50, // Same as daily total row
  },
  totalRowHeaderText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#F57C00",
    textAlign: "center",
  },
  totalRowHeaderTextEn: {
    fontSize: 7,
    color: "#FFB74D",
    textAlign: "center",
  },
  dayTotalCell: {
    width: 40,
    backgroundColor: "#FFF8E1",
    height: 50, // Same as total header
  },
  dayTotalText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#F57C00",
    textAlign: "center",
  },
  dayTotalLabel: {
    fontSize: 7,
    color: "#FFB74D",
    marginTop: 1,
  },
  grandTotalCell: {
    width: 45,
    backgroundColor: "#E8F5E8",
    height: 50, // Same as daily total row
  },
  grandTotalText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
  },
  grandTotalLabel: {
    fontSize: 7,
    color: "#81C784",
    marginTop: 1,
  },
  totalHeaderText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#2196F3",
    textAlign: "center",
  },
  validationSummary: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 8,
  },
  validationItem: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  validationSkill: {
    fontSize: 8,
    fontWeight: "600",
    color: "#8B4513",
    textAlign: "center",
  },
  validationStatus: {
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
  },
});
