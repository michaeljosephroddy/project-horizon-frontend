// screens/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView, 
  Text, 
  TouchableOpacity, 
  View, 
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { dashboardStyles } from '../styles/dashboardStyles';
import { useAuth } from '../context/AuthContext';
import { FAB } from '../components/FAB';
import { LogModal } from '../components/LogModal';
import { analyticsService } from '../services/analyticsService';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wellbeingStats, setWellbeingStats] = useState({
    avgMood: 0,
    moodTrend: 'stable',
    avgSleep: 0,
    sleepQuality: 'Good',
    adherenceRate: 0,
  });

  useEffect(() => {
    loadWellbeingData();
  }, []);

  const loadWellbeingData = async () => {
    try {
      // Get last 7 days for quick stats
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Use userId or id based on your auth setup
      const userId = String(user?.userId);

      const [mood, sleep, medication] = await Promise.all([
        analyticsService.getMoodMetrics(userId, startDate, endDate).catch(() => null),
        analyticsService.getSleepMetrics(userId, startDate, endDate).catch(() => null),
        analyticsService.getMedicationMetrics(userId, startDate, endDate).catch(() => null),
      ]);

      setWellbeingStats({
        avgMood: mood?.avgRating || 0,
        moodTrend: mood?.trend || 'stable',
        avgSleep: sleep?.avgSleepHours || 0,
        sleepQuality: sleep?.stability || 'Good',
        adherenceRate: medication?.adherenceRate || 0,
      });
    } catch (error) {
      console.error('Failed to load wellbeing data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWellbeingData();
  };

  const userData = {
    name: user?.name || 'User',
    email: user?.email || '',
    userId: user?.userId || user?.id || '',
  };

  const getMoodIcon = (rating: number) => {
    if (rating >= 7) return { icon: 'emoticon-happy', color: '#4CAF50' };
    if (rating >= 4) return { icon: 'emoticon-neutral', color: '#FF9800' };
    return { icon: 'emoticon-sad', color: '#F44336' };
  };

  const getSleepIcon = (hours: number) => {
    if (hours >= 7) return { icon: 'weather-night', color: '#673AB7' };
    if (hours >= 5) return { icon: 'weather-cloudy', color: '#FF9800' };
    return { icon: 'alert-circle', color: '#F44336' };
  };

  return (
    <SafeAreaView style={dashboardStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* User Info Card */}
        <View style={dashboardStyles.card}>
          <Text style={dashboardStyles.title}>Welcome back!</Text>
          <Text style={dashboardStyles.subtitle}>{userData.name}</Text>
          <Text style={dashboardStyles.userInfo}>{userData.email}</Text>
        </View>

        {/* Wellbeing Stats Section */}
        <View style={dashboardStyles.statsSection}>
          <Text style={dashboardStyles.sectionTitle}>Your Wellbeing (Last 7 days)</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />
          ) : (
            <>
              {/* Mood Card */}
              <TouchableOpacity 
                style={dashboardStyles.statCard}
                onPress={() => navigation.navigate('Analytics')}
                activeOpacity={0.7}
              >
                <View style={dashboardStyles.statCardLeft}>
                  <Icon 
                    name={getMoodIcon(wellbeingStats.avgMood).icon} 
                    size={32} 
                    color={getMoodIcon(wellbeingStats.avgMood).color} 
                  />
                </View>
                <View style={dashboardStyles.statCardContent}>
                  <Text style={dashboardStyles.statLabel}>Mood</Text>
                  <Text style={dashboardStyles.statValue}>
                    {wellbeingStats.avgMood.toFixed(1)}/10
                  </Text>
                  <Text style={dashboardStyles.statSubtext}>
                    Trend: {wellbeingStats.moodTrend}
                  </Text>
                </View>
                <Icon name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>

              {/* Sleep Card */}
              <TouchableOpacity 
                style={dashboardStyles.statCard}
                onPress={() => navigation.navigate('Analytics')}
                activeOpacity={0.7}
              >
                <View style={dashboardStyles.statCardLeft}>
                  <Icon 
                    name={getSleepIcon(wellbeingStats.avgSleep).icon} 
                    size={32} 
                    color={getSleepIcon(wellbeingStats.avgSleep).color} 
                  />
                </View>
                <View style={dashboardStyles.statCardContent}>
                  <Text style={dashboardStyles.statLabel}>Sleep</Text>
                  <Text style={dashboardStyles.statValue}>
                    {wellbeingStats.avgSleep.toFixed(1)} hrs
                  </Text>
                  <Text style={dashboardStyles.statSubtext}>
                    Quality: {wellbeingStats.sleepQuality}
                  </Text>
                </View>
                <Icon name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>

              {/* Medication Card */}
              <TouchableOpacity 
                style={dashboardStyles.statCard}
                onPress={() => navigation.navigate('Analytics')}
                activeOpacity={0.7}
              >
                <View style={dashboardStyles.statCardLeft}>
                  <Icon 
                    name="pill" 
                    size={32} 
                    color={wellbeingStats.adherenceRate >= 80 ? '#4CAF50' : '#FF9800'} 
                  />
                </View>
                <View style={dashboardStyles.statCardContent}>
                  <Text style={dashboardStyles.statLabel}>Medication</Text>
                  <Text style={dashboardStyles.statValue}>
                    {Math.round(wellbeingStats.adherenceRate)}%
                  </Text>
                  <Text style={dashboardStyles.statSubtext}>
                    Adherence Rate
                  </Text>
                </View>
                <Icon name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={dashboardStyles.button}
          onPress={() => navigation.navigate('Analytics')}
        >
          <Text style={dashboardStyles.buttonText}>View Detailed Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[dashboardStyles.button, { backgroundColor: '#ff3b30', marginTop: 16 }]}
          onPress={handleLogout}
        >
          <Text style={dashboardStyles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB onPress={() => setModalVisible(true)} />

      {/* Log Entry Modal */}
      <LogModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLogCreated={() => {
          setModalVisible(false);
          loadWellbeingData(); // Refresh data after new log
        }}
      />
    </SafeAreaView>
  );
};
