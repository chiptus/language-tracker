import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, WeeklyData, ProgressData, AppState } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: '@spanish_tracker_user_profile',
  WEEKLY_DATA: '@spanish_tracker_weekly_data_',
  PROGRESS_DATA: '@spanish_tracker_progress_data',
  IS_ONBOARDED: '@spanish_tracker_is_onboarded',
  APP_STATE: '@spanish_tracker_app_state',
} as const;

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function saveWeeklyData(weekNumber: number, data: WeeklyData): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `${STORAGE_KEYS.WEEKLY_DATA}${weekNumber}`,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error('Error saving weekly data:', error);
    throw error;
  }
}

export async function getWeeklyData(weekNumber: number): Promise<WeeklyData | null> {
  try {
    const data = await AsyncStorage.getItem(`${STORAGE_KEYS.WEEKLY_DATA}${weekNumber}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting weekly data:', error);
    return null;
  }
}

export async function getAllWeeklyData(): Promise<WeeklyData[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const weeklyDataKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.WEEKLY_DATA));
    
    const weeklyDataPromises = weeklyDataKeys.map(async (key) => {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    });
    
    const weeklyDataArray = await Promise.all(weeklyDataPromises);
    return weeklyDataArray
      .filter(data => data !== null)
      .sort((a, b) => a.weekNumber - b.weekNumber);
  } catch (error) {
    console.error('Error getting all weekly data:', error);
    return [];
  }
}

export async function saveProgressData(data: ProgressData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving progress data:', error);
    throw error;
  }
}

export async function getProgressData(): Promise<ProgressData | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting progress data:', error);
    return null;
  }
}

export async function saveOnboardingStatus(isOnboarded: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_ONBOARDED, JSON.stringify(isOnboarded));
  } catch (error) {
    console.error('Error saving onboarding status:', error);
    throw error;
  }
}

export async function getOnboardingStatus(): Promise<boolean> {
  try {
    const status = await AsyncStorage.getItem(STORAGE_KEYS.IS_ONBOARDED);
    return status ? JSON.parse(status) : false;
  } catch (error) {
    console.error('Error getting onboarding status:', error);
    return false;
  }
}

export async function saveAppState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving app state:', error);
    throw error;
  }
}

export async function getAppState(): Promise<AppState | null> {
  try {
    const state = await AsyncStorage.getItem(STORAGE_KEYS.APP_STATE);
    return state ? JSON.parse(state) : null;
  } catch (error) {
    console.error('Error getting app state:', error);
    return null;
  }
}

export async function clearAllData(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const trackerKeys = keys.filter(key => key.startsWith('@spanish_tracker_'));
    await AsyncStorage.multiRemove(trackerKeys);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
}