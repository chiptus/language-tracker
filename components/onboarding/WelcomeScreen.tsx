import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { getRandomQuote, MOTIVATIONAL_QUOTES } from '../../data/quotes';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export default function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const quote = getRandomQuote(MOTIVATIONAL_QUOTES);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>¡Bienvenido a tu Viaje de Español!</Text>
        <Text style={styles.subtitle}>Welcome to your Spanish Journey!</Text>
        
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{quote.text}"</Text>
          <Text style={styles.quoteTranslation}>"{quote.translation}"</Text>
          <Text style={styles.quoteAuthor}>— {quote.author}</Text>
        </View>

        <Text style={styles.description}>
          Este aplicativo te ayudará a planificar, rastrear y analizar tu progreso 
          en el aprendizaje del español across seis habilidades fundamentales.
        </Text>
        
        <Text style={styles.descriptionEn}>
          This app will help you plan, track, and analyze your Spanish learning 
          progress across six core skills with personalized schedules.
        </Text>
      </View>

      <Pressable style={styles.continueButton} onPress={onContinue}>
        <Text style={styles.continueButtonText}>¡Comenzar! / Let's Start!</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 40,
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
  description: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  descriptionEn: {
    fontSize: 14,
    color: '#A0522D',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});