import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { dashboardStyles } from '../styles/dashboardStyles';
import { useAuth } from '../context/AuthContext';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

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
            await logout(); // This clears storage and context
            navigation.replace('Login'); // Navigate back to login
          },
        },
      ]
    );
  };

  const userData = {
    name: user?.name || 'User',
    email: user?.email || '',
    userId: user?.id || '',
  };

  return (
    <SafeAreaView style={dashboardStyles.container}>
      <View style={dashboardStyles.card}>
        <Text style={dashboardStyles.title}>Dashboard</Text>
        <Text style={dashboardStyles.subtitle}>Welcome back!</Text>

        <Text style={dashboardStyles.userInfo}>Name: {userData.name}</Text>
        <Text style={dashboardStyles.userInfo}>Email: {userData.email}</Text>
        <Text style={dashboardStyles.userInfo}>User ID: {userData.userId}</Text>
      </View>

      <TouchableOpacity
        style={dashboardStyles.button}
        onPress={() => navigation.navigate('Analytics')}
      >
        <Text style={dashboardStyles.buttonText}>View Analytics</Text>
      </TouchableOpacity>

      {/* 🚪 Logout button */}
      <TouchableOpacity
        style={[dashboardStyles.button, { backgroundColor: '#ff3b30', marginTop: 16 }]}
        onPress={handleLogout}
      >
        <Text style={dashboardStyles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
