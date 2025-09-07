import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { getRandomQuote, MOTIVATIONAL_QUOTES } from '../../data/quotes';

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useApp();
  const quote = getRandomQuote(MOTIVATIONAL_QUOTES);

  useEffect(() => {
    if (!state.isOnboarded) {
      router.replace('/onboarding');
    }
  }, [state.isOnboarded, router]);

  if (!state.isOnboarded) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¡Bienvenido de nuevo!</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
      </View>

      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>"{quote.text}"</Text>
        <Text style={styles.quoteTranslation}>"{quote.translation}"</Text>
        <Text style={styles.quoteAuthor}>— {quote.author}</Text>
      </View>

      {state.userProfile && (
        <View style={styles.profileSection}>
          <Text style={styles.profileTitle}>Tu Plan de Estudio</Text>
          <Text style={styles.profileDetail}>
            {state.userProfile.schedule.daysPerWeek} días por semana, {state.userProfile.schedule.minutesPerDay} minutos por día
          </Text>
        </View>
      )}

      <View style={styles.actionsContainer}>
        <Text style={styles.actionsTitle}>¿Qué te gustaría hacer hoy?</Text>
        <Text style={styles.actionsSubtitle}>What would you like to do today?</Text>
        
        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📚 Comenzar Práctica / Start Practice</Text>
        </View>
        
        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📊 Ver Progreso / View Progress</Text>
        </View>
        
        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📝 Revisión Semanal / Weekly Review</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#8B4513',
    textAlign: 'center',
  },
  quoteContainer: {
    backgroundColor: '#FDF5E6',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 8,
  },
  quoteTranslation: {
    fontSize: 14,
    color: '#A0522D',
    textAlign: 'center',
    marginBottom: 10,
  },
  quoteAuthor: {
    fontSize: 12,
    color: '#D2691E',
    textAlign: 'center',
    fontWeight: '600',
  },
  profileSection: {
    backgroundColor: '#E8F5E8',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8,
  },
  profileDetail: {
    fontSize: 16,
    color: '#2E7D32',
    textAlign: 'center',
  },
  actionsContainer: {
    flex: 1,
  },
  actionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionsSubtitle: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#8B4513',
    textAlign: 'center',
  },
});