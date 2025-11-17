import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text } from 'react-native';
import { MedicationMetrics } from '../components/MedicationMetrics';
import { MoodMetrics } from '../components/MoodMetrics';
import { SleepMetrics } from '../components/SleepMetrics';
import { analyticsService } from '../services/analyticsService';
import { analyticsStyles } from '../styles/analyticsStyles';
import { MedicationMetrics as MedicationMetricsType, MoodMetrics as MoodMetricsType, SleepMetrics as SleepMetricsType } from '../types/analytics';
import { useAuth } from '../context/AuthContext'; // Add this import

const START_DATE = '2025-08-01';
const END_DATE = '2025-08-28';

export const AnalyticsScreen: React.FC = () => {
  const { user } = useAuth(); // Get user from auth context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moodData, setMoodData] = useState<MoodMetricsType | null>(null);
  const [sleepData, setSleepData] = useState<SleepMetricsType | null>(null);
  const [medicationData, setMedicationData] = useState<MedicationMetricsType | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []); // Just run once on mount

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [mood, sleep, medication] = await Promise.all([
        analyticsService.getMoodMetrics(String(user!.userId), START_DATE, END_DATE), // user! since we know it exists
        analyticsService.getSleepMetrics(String(user!.userId), START_DATE, END_DATE),
        analyticsService.getMedicationMetrics(String(user!.userId), START_DATE, END_DATE),
      ]);

      setMoodData(mood);
      setSleepData(sleep);
      setMedicationData(medication);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={analyticsStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={analyticsStyles.loadingText}>Loading Analytics...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={analyticsStyles.errorContainer}>
        <Text style={analyticsStyles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={analyticsStyles.container}>
      <ScrollView contentContainerStyle={analyticsStyles.scrollContent}>
        <Text style={analyticsStyles.title}>Analytics</Text>

        {moodData && <MoodMetrics data={moodData} />}
        {sleepData && <SleepMetrics data={sleepData} />}
        {medicationData && <MedicationMetrics data={medicationData} />}
      </ScrollView>
    </SafeAreaView>
  );
};
