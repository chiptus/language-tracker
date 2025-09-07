import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progreso y Reportes</Text>
      <Text style={styles.subtitle}>Progress & Reports</Text>
      <Text style={styles.comingSoon}>📊 Próximamente / Coming Soon</Text>
      <Text style={styles.description}>
        Aquí verás gráficos detallados de tu progreso, estadísticas y análisis de tendencias.
      </Text>
      <Text style={styles.descriptionEn}>
        Here you'll see detailed charts of your progress, statistics, and trend analysis.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  comingSoon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  descriptionEn: {
    fontSize: 14,
    color: '#A0522D',
    textAlign: 'center',
    lineHeight: 20,
  },
});