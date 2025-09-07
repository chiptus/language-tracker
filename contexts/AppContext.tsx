import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, UserProfile, WeeklyData, ProgressData } from '../types';
import * as storage from '../utils/storage';
import { getEmptyWeeklyPractice, getCurrentWeekNumber, calculateSuccessRates, calculateTotalWeeklyMinutes, getWeekDateRange } from '../utils/calculations';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  loadInitialData: () => Promise<void>;
  saveUserProfile: (profile: UserProfile) => Promise<void>;
  updateWeeklyData: (data: WeeklyData) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

type AppAction =
  | { type: 'SET_INITIAL_DATA'; payload: AppState }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile }
  | { type: 'SET_CURRENT_WEEK_DATA'; payload: WeeklyData }
  | { type: 'UPDATE_PROGRESS_DATA'; payload: ProgressData }
  | { type: 'SET_ONBOARDED'; payload: boolean }
  | { type: 'RESET_APP' };

const initialState: AppState = {
  userProfile: null,
  currentWeekData: null,
  progressData: {
    totalMinutes: 0,
    totalHours: 0,
    averageSuccessRate: 0,
    weeklyHistory: [],
    currentMotivation: 'Neutral',
  },
  isOnboarded: null, // null means we haven't loaded the state yet
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
      return action.payload;
    case 'SET_USER_PROFILE':
      return {
        ...state,
        userProfile: action.payload,
      };
    case 'SET_CURRENT_WEEK_DATA':
      return {
        ...state,
        currentWeekData: action.payload,
      };
    case 'UPDATE_PROGRESS_DATA':
      return {
        ...state,
        progressData: action.payload,
      };
    case 'SET_ONBOARDED':
      return {
        ...state,
        isOnboarded: action.payload,
      };
    case 'RESET_APP':
      return initialState;
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const loadInitialData = async () => {
    try {
      const isOnboarded = await storage.getOnboardingStatus();
      const userProfile = await storage.getUserProfile();
      const progressData = await storage.getProgressData();

      let currentWeekData = null;
      if (userProfile) {
        const currentWeekNumber = getCurrentWeekNumber(userProfile.startDate);
        currentWeekData = await storage.getWeeklyData(currentWeekNumber);
        
        if (!currentWeekData) {
          const dateRange = getWeekDateRange(currentWeekNumber, userProfile.startDate);
          currentWeekData = {
            weekNumber: currentWeekNumber,
            dateRange,
            dailyPractice: getEmptyWeeklyPractice(),
            weeklyReflection: {
              hardWorkRating: '',
              onTrackRating: '',
              moodRating: '',
              starRating: 0,
            },
            successRates: {
              listening: 0,
              reading: 0,
              writing: 0,
              speaking: 0,
              fluency: 0,
              pronunciation: 0,
            },
          };
        }
      }

      const appState: AppState = {
        userProfile,
        currentWeekData,
        progressData: progressData || initialState.progressData,
        isOnboarded,
      };

      dispatch({ type: 'SET_INITIAL_DATA', payload: appState });
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const saveUserProfileData = async (profile: UserProfile) => {
    try {
      await storage.saveUserProfile(profile);
      dispatch({ type: 'SET_USER_PROFILE', payload: profile });
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  };

  const updateWeeklyData = async (data: WeeklyData) => {
    try {
      if (!state.userProfile) return;

      const successRates = calculateSuccessRates(data.dailyPractice, state.userProfile.weeklyGoals);
      const updatedData = { ...data, successRates };

      await storage.saveWeeklyData(data.weekNumber, updatedData);
      dispatch({ type: 'SET_CURRENT_WEEK_DATA', payload: updatedData });

      const allWeeklyData = await storage.getAllWeeklyData();
      const totalMinutes = allWeeklyData.reduce(
        (sum, week) => sum + calculateTotalWeeklyMinutes(week.dailyPractice),
        0
      );
      const averageSuccessRate = allWeeklyData.length > 0
        ? allWeeklyData.reduce((sum, week) => {
            const weekAvg = Object.values(week.successRates).reduce((s, r) => s + r, 0) / 6;
            return sum + weekAvg;
          }, 0) / allWeeklyData.length
        : 0;

      const updatedProgressData: ProgressData = {
        totalMinutes,
        totalHours: Math.floor(totalMinutes / 60),
        averageSuccessRate,
        weeklyHistory: allWeeklyData,
        currentMotivation: state.progressData.currentMotivation,
      };

      await storage.saveProgressData(updatedProgressData);
      dispatch({ type: 'UPDATE_PROGRESS_DATA', payload: updatedProgressData });
    } catch (error) {
      console.error('Error updating weekly data:', error);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    try {
      await storage.saveOnboardingStatus(true);
      dispatch({ type: 'SET_ONBOARDED', payload: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        loadInitialData,
        saveUserProfile: saveUserProfileData,
        updateWeeklyData,
        completeOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}