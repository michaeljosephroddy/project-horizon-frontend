import React, { useState } from 'react';
import { SafeAreaView, TextInput, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { loginStyles } from '../styles/loginStyles';
import { authService } from '../services/authService';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { setAuth } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            const { token, user } = await authService.login(email, password);
            await setAuth(user, token);
            navigation.replace('Dashboard'); // Navigate to your main screen
        } catch (err) {
            Alert.alert('Login Failed', (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={loginStyles.container}>
            <Text style={loginStyles.title}>Login</Text>

            <TextInput
                placeholder="Email"
                style={loginStyles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                placeholder="Password"
                style={loginStyles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity onPress={handleLogin} style={loginStyles.button} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={loginStyles.buttonText}>Login</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={loginStyles.link}>Don’t have an account? Register</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};
