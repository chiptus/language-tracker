import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface TimerProps {
  isRunning: boolean;
  initialSeconds?: number;
  onTimeUpdate: (seconds: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function Timer({ 
  isRunning, 
  initialSeconds = 0,
  onTimeUpdate,
  onStart,
  onPause,
  onReset 
}: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          onTimeUpdate(newSeconds);
          return newSeconds;
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
  }, [isRunning, onTimeUpdate]);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

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
    setSeconds(0);
    onReset();
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeDisplay}>
        <Text style={styles.timeText}>{formatTime(seconds)}</Text>
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
            { backgroundColor: isRunning ? '#FF6B6B' : '#4CAF50' }
          ]} 
          onPress={isRunning ? onPause : onStart}
        >
          <Text style={styles.playPauseButtonText}>
            {isRunning ? '⏸' : '▶️'}
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
  timeDisplay: {
    marginBottom: 20,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#D2691E',
    fontFamily: 'monospace',
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