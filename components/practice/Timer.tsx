import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';

interface TimerProps {
  isRunning: boolean;
  targetMinutes?: number;
  onTimeUpdate: (secondsElapsed: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onComplete?: () => void;
}

export default function Timer({ 
  isRunning, 
  targetMinutes = 5,
  onTimeUpdate,
  onStart,
  onPause,
  onReset,
  onComplete
}: TimerProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(targetMinutes);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const totalSeconds = selectedMinutes * 60;
  const remainingSeconds = totalSeconds - secondsElapsed;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsElapsed(prevElapsed => {
          const newElapsed = prevElapsed + 1;
          const newRemaining = totalSeconds - newElapsed;
          
          // Timer completed (show alert only once when crossing the threshold)
          if (newRemaining <= 0 && prevElapsed < totalSeconds) {
            Alert.alert(
              '¡Tiempo completado! / Time\'s up!',
              `¡Excelente trabajo! Has completado ${selectedMinutes} minutos de práctica. Puedes continuar o guardar tu sesión. / Great job! You've completed ${selectedMinutes} minutes of practice. You can continue or save your session.`,
              [
                { text: 'Continuar / Continue', style: 'default' },
                { text: 'Guardar / Save', onPress: onComplete }
              ]
            );
          }
          
          // Call onTimeUpdate outside of the setState callback
          setTimeout(() => onTimeUpdate(newElapsed), 0);
          
          return newElapsed;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, totalSeconds, selectedMinutes, onTimeUpdate, onComplete]);

  useEffect(() => {
    setSecondsElapsed(0);
  }, [selectedMinutes]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setSecondsElapsed(0);
    onReset();
  };

  const handleTimeSelect = (minutes: number) => {
    if (!isRunning) {
      setSelectedMinutes(minutes);
      setSecondsElapsed(0);
    }
  };

  const isCompleted = remainingSeconds <= 0 && secondsElapsed > 0;

  return (
    <View style={styles.container}>
      {!isRunning && secondsElapsed === 0 && (
        <View style={styles.timeSelector}>
          <Text style={styles.selectorTitle}>Selecciona tiempo / Select time:</Text>
          <View style={styles.timeOptions}>
            {[5, 10, 15, 20, 25, 30].map(minutes => (
              <Pressable
                key={minutes}
                style={[
                  styles.timeOption,
                  selectedMinutes === minutes && styles.selectedTimeOption
                ]}
                onPress={() => handleTimeSelect(minutes)}
              >
                <Text style={[
                  styles.timeOptionText,
                  selectedMinutes === minutes && styles.selectedTimeOptionText
                ]}>
                  {minutes}m
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      
      <View style={styles.timeDisplay}>
        <View style={styles.dualTimer}>
          <View style={styles.timerSection}>
            <Text style={[
              styles.timeText,
              { color: '#4CAF50', fontSize: 36 }
            ]}>
              {formatTime(secondsElapsed)}
            </Text>
            <Text style={styles.timeLabel}>Tiempo transcurrido / Elapsed</Text>
          </View>
          
          <View style={styles.timerDivider}>
            <Text style={styles.dividerText}>/</Text>
          </View>
          
          <View style={styles.timerSection}>
            <Text style={[
              styles.timeText,
              { 
                color: remainingSeconds <= 0 ? '#4CAF50' : remainingSeconds <= 60 ? '#FF6B6B' : '#FF8C00',
                fontSize: 36
              }
            ]}>
              {remainingSeconds <= 0 ? 
                `+${formatTime(secondsElapsed - totalSeconds)}` : 
                formatTime(remainingSeconds)
              }
            </Text>
            <Text style={styles.timeLabel}>
              {remainingSeconds <= 0 ? '¡Tiempo extra! / Overtime!' : 'Restante / Remaining'}
            </Text>
          </View>
        </View>
        
        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar,
              { 
                width: `${totalSeconds > 0 ? Math.min((secondsElapsed / totalSeconds) * 100, 100) : 0}%`,
                backgroundColor: remainingSeconds <= 0 ? '#4CAF50' : '#FF8C00'
              }
            ]} 
          />
          {/* Overtime indicator */}
          {remainingSeconds <= 0 && (
            <View 
              style={[
                styles.overtimeBar,
                { 
                  width: `${Math.min(((secondsElapsed - totalSeconds) / totalSeconds) * 100, 100)}%`,
                }
              ]} 
            />
          )}
        </View>
      </View>
      
      <View style={styles.controls}>
        <Pressable 
          style={[styles.controlButton, styles.resetButton]} 
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>⟲</Text>
        </Pressable>
        
        <Pressable 
          style={[
            styles.controlButton, 
            styles.playPauseButton,
            { backgroundColor: isRunning ? '#FF6B6B' : isCompleted ? '#4CAF50' : '#2196F3' }
          ]} 
          onPress={isCompleted ? handleReset : (isRunning ? onPause : onStart)}
          disabled={remainingSeconds <= 0 && !isCompleted}
        >
          <Text style={styles.playPauseButtonText}>
            {isCompleted ? '✅' : isRunning ? '⏸' : '▶️'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FDF5E6',
    borderRadius: 15,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#FF8C00',
  },
  timeSelector: {
    marginBottom: 20,
    alignItems: 'center',
  },
  selectorTitle: {
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 10,
    textAlign: 'center',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  timeOption: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectedTimeOption: {
    borderColor: '#FF8C00',
    backgroundColor: '#FFF3E0',
  },
  timeOptionText: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
  },
  selectedTimeOptionText: {
    color: '#FF8C00',
  },
  timeDisplay: {
    marginBottom: 20,
    alignItems: 'center',
  },
  dualTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  timerSection: {
    alignItems: 'center',
    flex: 1,
  },
  timerDivider: {
    marginHorizontal: 10,
  },
  dividerText: {
    fontSize: 32,
    color: '#D2691E',
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  timeLabel: {
    fontSize: 12,
    color: '#A0522D',
    textAlign: 'center',
    lineHeight: 16,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  overtimeBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    opacity: 0.7,
    transform: [{ scaleY: 1.2 }],
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resetButton: {
    backgroundColor: '#DDD',
  },
  resetButtonText: {
    fontSize: 24,
    color: '#666',
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  playPauseButtonText: {
    fontSize: 24,
    color: '#FFF',
  },
});