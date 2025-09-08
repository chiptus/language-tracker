import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import WelcomeScreen from './WelcomeScreen';
import SkillPriorityStep from './SkillPriorityStep';
import SchedulePlanningStep from './SchedulePlanningStep';
import GoalVisualizationStep from './GoalVisualizationStep';
import { SkillPercentages, Schedule, UserProfile, WeeklySchedulePlan } from '../../types';
import { calculateWeeklyGoals } from '../../utils/calculations';

interface OnboardingFlowProps {
  onComplete: (userProfile: UserProfile) => void;
}

type OnboardingStep = 'welcome' | 'skills' | 'schedule' | 'visualization';

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [skillPercentages, setSkillPercentages] = useState<SkillPercentages | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  const handleWelcomeContinue = () => {
    setCurrentStep('skills');
  };

  const handleSkillsNext = (skills: SkillPercentages) => {
    setSkillPercentages(skills);
    setCurrentStep('schedule');
  };

  const handleSkillsBack = () => {
    setCurrentStep('welcome');
  };

  const handleScheduleNext = (scheduleData: Schedule) => {
    setSchedule(scheduleData);
    setCurrentStep('visualization');
  };

  const handleScheduleBack = () => {
    setCurrentStep('skills');
  };

  const handleVisualizationBack = () => {
    setCurrentStep('schedule');
  };

  const handleComplete = (startDate: string, customPlan?: WeeklySchedulePlan) => {
    if (!skillPercentages || !schedule) return;

    const weeklyGoals = calculateWeeklyGoals(skillPercentages, schedule);
    
    const userProfile: UserProfile = {
      skillPercentages,
      schedule,
      startDate,
      weeklyGoals,
      weeklySchedulePlan: customPlan,
    };

    onComplete(userProfile);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onContinue={handleWelcomeContinue} />;
      
      case 'skills':
        return (
          <SkillPriorityStep 
            onNext={handleSkillsNext}
            onBack={handleSkillsBack}
          />
        );
      
      case 'schedule':
        return (
          <SchedulePlanningStep
            onNext={handleScheduleNext}
            onBack={handleScheduleBack}
          />
        );
      
      case 'visualization':
        if (!skillPercentages || !schedule) return null;
        return (
          <GoalVisualizationStep
            skillPercentages={skillPercentages}
            schedule={schedule}
            onComplete={handleComplete}
            onBack={handleVisualizationBack}
          />
        );
      
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderCurrentStep()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});