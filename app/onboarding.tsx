import React from 'react';
import { useRouter } from 'expo-router';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';
import { useApp } from '../contexts/AppContext';
import { UserProfile } from '../types';

export default function OnboardingScreen() {
  const router = useRouter();
  const { saveUserProfile, completeOnboarding } = useApp();

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    try {
      await saveUserProfile(userProfile);
      await completeOnboarding();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
}