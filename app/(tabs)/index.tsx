import React from 'react';
import { ActivityIndicator, SafeAreaView, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import { DashboardScreen } from '../../src/screens/DashboardScreen';
import { AnalyticsScreen } from '../../src/screens/AnalyticsScreen';
import { LoginScreen } from '../../src/screens/LoginScreen';
import { RegisterScreen } from '../../src/screens/RegisterScreen';
import { MoodAnalyticsScreen } from '@/src/screens/MoodAnalyticsScreen';
import { SleepAnalyticsScreen } from '@/src/screens/SleepAnalyticsScreen';
import { MedicationAnalyticsScreen } from '@/src/screens/MedicationAnalyticsScreen';

// Auth Context
import { AuthProvider, useAuth } from '../../src/context/AuthContext';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <SafeAreaView
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={{ marginTop: 10, color: '#333' }}>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <Stack.Navigator>
            {user ? (
                <>
                    <Stack.Screen
                        name="Dashboard"
                        component={DashboardScreen}
                        options={{ title: 'Dashboard' }}
                    />
                    <Stack.Screen
                        name="MoodAnalytics"
                        component={MoodAnalyticsScreen}
                        options={{ title: 'Mood Analytics' }}
                    />
                    <Stack.Screen
                        name="SleepAnalytics"
                        component={SleepAnalyticsScreen}
                        options={{ title: 'Sleep Analytics' }}
                    />
                    <Stack.Screen
                        name="MedicationAnalytics"
                        component={MedicationAnalyticsScreen}
                        options={{ title: 'Medication Analytics' }}
                    />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{ headerShown: false }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

// Use this as your Expo Router layout component
export default function AppLayout() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
}
