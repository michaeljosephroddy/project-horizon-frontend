import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { dashboardStyles } from '../styles/dashboardStyles';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const userData = {
    name: 'User Name',
    email: 'user@example.com',
    userId: '3',
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
    </SafeAreaView>
  );
};