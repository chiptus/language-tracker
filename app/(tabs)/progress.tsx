import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import { useApp } from '../../contexts/AppContext';
import { SKILLS, SkillType } from '../../types';
import { formatMinutesToHours } from '../../utils/calculations';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#FDF5E6',
  backgroundGradientFrom: '#FDF5E6',
  backgroundGradientTo: '#FFF5E6',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(210, 105, 30, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(139, 69, 19, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#FF8C00'
  }
};

export default function ProgressScreen() {
  const { state } = useApp();

  if (!state.userProfile || !state.progressData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No hay datos de progreso disponibles</Text>
        <Text style={styles.errorSubtext}>No progress data available</Text>
      </View>
    );
  }

  const getSkillLabel = (skill: SkillType): string => {
    const labels = {
      listening: 'Escuchar',
      reading: 'Leer',
      writing: 'Escribir',
      speaking: 'Hablar',
      fluency: 'Fluidez',
      pronunciation: 'Pronunciación',
    };
    return labels[skill];
  };

  const getWeeklyTrendData = () => {
    const recentWeeks = state.progressData.weeklyHistory.slice(-8);
    if (recentWeeks.length === 0) return null;

    return {
      labels: recentWeeks.map(week => `S${week.weekNumber}`),
      datasets: [{
        data: recentWeeks.map(week => {
          const totalMinutes = Object.values(week.dailyPractice)
            .reduce((sum, day) => sum + Object.values(day as any)
            .reduce((daySum: number, mins: number) => daySum + mins, 0), 0);
          return totalMinutes;
        }),
        color: (opacity = 1) => `rgba(255, 140, 0, ${opacity})`,
        strokeWidth: 2
      }]
    };
  };

  const getSkillDistributionData = () => {
    const totalTime = state.progressData.totalMinutes;
    if (totalTime === 0) return [];

    return SKILLS.map((skill, index) => {
      const skillTime = state.progressData.weeklyHistory.reduce((sum, week) => {
        return sum + Object.values(week.dailyPractice).reduce((weekSum, day) => {
          return weekSum + (day[skill] as number);
        }, 0);
      }, 0);

      const colors = ['#FF8C00', '#D2691E', '#4CAF50', '#2196F3', '#9C27B0', '#FF5722'];
      
      return {
        name: getSkillLabel(skill),
        minutes: skillTime,
        color: colors[index],
        legendFontColor: '#8B4513',
        legendFontSize: 12,
      };
    }).filter(item => item.minutes > 0);
  };

  const getSuccessRateData = () => {
    if (state.progressData.weeklyHistory.length === 0) return null;

    const recentWeeks = state.progressData.weeklyHistory.slice(-6);
    
    return {
      labels: recentWeeks.map(week => `Semana ${week.weekNumber}`),
      datasets: [{
        data: recentWeeks.map(week => {
          const avgSuccess = Object.values(week.successRates)
            .reduce((sum, rate) => sum + rate, 0) / 6;
          return Math.round(avgSuccess);
        })
      }]
    };
  };

  const getSkillProgressData = () => {
    if (!state.currentWeekData) return null;
    
    return {
      data: SKILLS.map(skill => {
        const successRate = state.currentWeekData!.successRates[skill] / 100;
        return successRate;
      }).filter((_, index) => state.userProfile!.weeklyGoals[SKILLS[index]] > 0)
    };
  };

  const weeklyTrendData = getWeeklyTrendData();
  const skillDistributionData = getSkillDistributionData();
  const successRateData = getSuccessRateData();
  const skillProgressData = getSkillProgressData();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Progreso y Reportes</Text>
        <Text style={styles.subtitle}>Progress & Reports</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{formatMinutesToHours(state.progressData.totalMinutes)}</Text>
          <Text style={styles.statLabel}>Tiempo Total</Text>
          <Text style={styles.statLabelEn}>Total Time</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{state.progressData.weeklyHistory.length}</Text>
          <Text style={styles.statLabel}>Semanas</Text>
          <Text style={styles.statLabelEn}>Weeks</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{Math.round(state.progressData.averageSuccessRate)}%</Text>
          <Text style={styles.statLabel}>Éxito Promedio</Text>
          <Text style={styles.statLabelEn}>Avg Success</Text>
        </View>
      </View>

      {weeklyTrendData && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Tendencia Semanal (Minutos)</Text>
          <Text style={styles.chartSubtitle}>Weekly Trend (Minutes)</Text>
          <LineChart
            data={weeklyTrendData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            bezier
          />
        </View>
      )}

      {skillDistributionData.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Distribución por Habilidad</Text>
          <Text style={styles.chartSubtitle}>Distribution by Skill</Text>
          <PieChart
            data={skillDistributionData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="minutes"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </View>
      )}

      {successRateData && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Tasa de Éxito Semanal (%)</Text>
          <Text style={styles.chartSubtitle}>Weekly Success Rate (%)</Text>
          <BarChart
            data={successRateData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisSuffix="%"
            yAxisLabel=""
            fromZero
          />
        </View>
      )}

      {skillProgressData && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Progreso Esta Semana</Text>
          <Text style={styles.chartSubtitle}>This Week's Progress</Text>
          <ProgressChart
            data={skillProgressData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      )}

      <View style={styles.insightsSection}>
        <Text style={styles.insightsTitle}>📈 Insights & Análisis</Text>
        
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Motivación Actual</Text>
          <Text style={styles.insightValue}>{state.progressData.currentMotivation}</Text>
        </View>
        
        {state.progressData.weeklyHistory.length > 0 && (
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Mejor Semana</Text>
            <Text style={styles.insightValue}>
              Semana {state.progressData.weeklyHistory
                .reduce((best, week) => {
                  const weekTotal = Object.values(week.dailyPractice)
                    .reduce((sum, day) => sum + Object.values(day as any)
                    .reduce((daySum: number, mins: number) => daySum + mins, 0), 0);
                  const bestTotal = Object.values(best.dailyPractice)
                    .reduce((sum, day) => sum + Object.values(day as any)
                    .reduce((daySum: number, mins: number) => daySum + mins, 0), 0);
                  return weekTotal > bestTotal ? week : best;
                }).weekNumber}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  header: {
    padding: 20,
    alignItems: 'center',
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
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#FDF5E6',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D2691E',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    textAlign: 'center',
  },
  statLabelEn: {
    fontSize: 12,
    color: '#A0522D',
    textAlign: 'center',
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  insightsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  insightsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
    marginBottom: 20,
  },
  insightCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});