import { MedicationMetrics, MoodMetrics, SleepMetrics } from '../types/analytics';

const API_BASE_URL = 'http://192.168.49.1:9095'; // Replace with your actual API URL

export const analyticsService = {
    getMoodMetrics: async (userId: string, startDate: string, endDate: string): Promise<MoodMetrics> => {
        const url = `${API_BASE_URL}/analytics/users/${userId}/mood?startDate=${startDate}&endDate=${endDate}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch mood metrics');
        }
        return response.json();
    },

    getSleepMetrics: async (userId: string, startDate: string, endDate: string): Promise<SleepMetrics> => {
        const url = `${API_BASE_URL}/analytics/users/${userId}/sleep?startDate=${startDate}&endDate=${endDate}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch sleep metrics');
        }
        return response.json();
    },

    getMedicationMetrics: async (userId: string, startDate: string, endDate: string): Promise<MedicationMetrics> => {
        const url = `${API_BASE_URL}/analytics/users/${userId}/medication?startDate=${startDate}&endDate=${endDate}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch medication metrics');
        }
        return response.json();
    },
};