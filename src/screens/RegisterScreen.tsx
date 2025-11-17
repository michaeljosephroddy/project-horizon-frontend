import React, { useState } from 'react';
import { SafeAreaView, TextInput, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { authService } from '../services/authService';
import { registerStyles } from '../styles/registerStyles'

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await authService.register(email, password, name);
      Alert.alert('Success', 'Account created! You can now log in.');
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Registration Failed', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={registerStyles.container}>
      <Text style={registerStyles.title}>Create Account</Text>

      <TextInput
        placeholder="Name"
        style={registerStyles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        style={registerStyles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={registerStyles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleRegister} style={registerStyles.button} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={registerStyles.buttonText}>Register</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={registerStyles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
