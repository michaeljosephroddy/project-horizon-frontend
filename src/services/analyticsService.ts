import { authStorage } from '../utils/authStorage';
import { MedicationMetrics, MoodMetrics, SleepMetrics } from '../types/analytics';

const API_BASE_URL = 'http://192.168.49.1:9095';

async function authorizedFetch(url: string, options: RequestInit = {}) {
    const token = await authStorage.getToken();
    if (!token) {
        throw new Error('No authentication token found');
    }

    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed: ${response.status}`);
    }
    return response.json();
}

export const analyticsService = {
    getMoodMetrics: async (userId: string, startDate: string, endDate: string): Promise<MoodMetrics> => {
        const url = `${API_BASE_URL}/analytics/users/${userId}/mood?startDate=${startDate}&endDate=${endDate}`;
        return authorizedFetch(url);
    },

    getSleepMetrics: async (userId: string, startDate: string, endDate: string): Promise<SleepMetrics> => {
        const url = `${API_BASE_URL}/analytics/users/${userId}/sleep?startDate=${startDate}&endDate=${endDate}`;
        return authorizedFetch(url);
    },

    getMedicationMetrics: async (userId: string, startDate: string, endDate: string): Promise<MedicationMetrics> => {
        const url = `${API_BASE_URL}/analytics/users/${userId}/medication?startDate=${startDate}&endDate=${endDate}`;
        return authorizedFetch(url);
    },
};
