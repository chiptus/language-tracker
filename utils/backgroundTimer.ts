import * as Notifications from 'expo-notifications';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

const TIMER_TASK_NAME = 'background-timer-task';
const TIMER_STATE_KEY = 'timer_state';

export interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  totalPausedDuration: number;
  pauseStartTime: number | null;
  targetDurationMs: number;
  scheduledNotificationId: string | null;
  skillType: string | null;
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Define background task
TaskManager.defineTask(TIMER_TASK_NAME, async () => {
  try {
    const timerState = await getTimerState();
    if (timerState && timerState.isRunning && timerState.startTime) {
      const elapsed = getElapsedTime(timerState);
      if (elapsed >= timerState.targetDurationMs) {
        // Timer completed - could trigger additional logic here
        console.log('Timer completed in background');
      }
    }
  } catch (error) {
    console.error('Background timer task error:', error);
  }
});

export const initializeBackgroundTimer = async (): Promise<void> => {
  try {
    // Request notification permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permissions not granted');
    }

    // Register background task
    await BackgroundTask.registerTaskAsync(TIMER_TASK_NAME);

    console.log('Background timer initialized');
  } catch (error) {
    console.error('Failed to initialize background timer:', error);
  }
};

export const saveTimerState = async (state: TimerState): Promise<void> => {
  try {
    await AsyncStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save timer state:', error);
  }
};

export const getTimerState = async (): Promise<TimerState | null> => {
  try {
    const stateJson = await AsyncStorage.getItem(TIMER_STATE_KEY);
    return stateJson ? JSON.parse(stateJson) : null;
  } catch (error) {
    console.error('Failed to get timer state:', error);
    return null;
  }
};

export const clearTimerState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TIMER_STATE_KEY);
  } catch (error) {
    console.error('Failed to clear timer state:', error);
  }
};

export const getElapsedTime = (state: TimerState): number => {
  if (!state.startTime) return 0;
  
  const currentTime = Date.now();
  const totalRunTime = currentTime - state.startTime;
  const adjustedTime = totalRunTime - state.totalPausedDuration;
  
  // If currently paused, subtract current pause duration
  if (!state.isRunning && state.pauseStartTime) {
    const currentPauseDuration = currentTime - state.pauseStartTime;
    return Math.max(0, adjustedTime - currentPauseDuration);
  }
  
  return Math.max(0, adjustedTime);
};

export const scheduleCompletionNotification = async (
  durationMs: number,
  skillType: string
): Promise<string> => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: '¡Tiempo completado! / Time\'s up!',
      body: `Tu sesión de ${skillType} ha terminado. / Your ${skillType} session is complete.`,
      sound: 'default',
      priority: 'high',
    },
    trigger: {
      type: 'timeInterval',
      seconds: Math.floor(durationMs / 1000),
    } as Notifications.TimeIntervalTriggerInput,
  });
  
  return notificationId;
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
};

export const createInitialTimerState = (
  targetMinutes: number,
  skillType: string
): TimerState => ({
  isRunning: false,
  startTime: null,
  totalPausedDuration: 0,
  pauseStartTime: null,
  targetDurationMs: targetMinutes * 60 * 1000,
  scheduledNotificationId: null,
  skillType,
});

// App state change handler
let appStateSubscription: any = null;

export const setupAppStateListener = (onAppStateChange: (state: string) => void): void => {
  if (appStateSubscription) {
    appStateSubscription.remove();
  }
  
  appStateSubscription = AppState.addEventListener('change', onAppStateChange);
};

export const removeAppStateListener = (): void => {
  if (appStateSubscription) {
    appStateSubscription.remove();
    appStateSubscription = null;
  }
};

export const handleAppStateChange = async (nextAppState: string): Promise<void> => {
  if (nextAppState === 'active') {
    // App came to foreground - recalculate timer state
    const state = await getTimerState();
    if (state && state.isRunning) {
      // Timer state will be recalculated by the Timer component
      console.log('App returned to foreground, timer state will be updated');
    }
  }
};