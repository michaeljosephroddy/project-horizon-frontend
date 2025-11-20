import { authStorage } from '../utils/authStorage';

const API_BASE_URL = 'http://192.168.49.1:9095';

interface UserMedication {
    user_medication_id: number;
    medication_id: number;
    name: string;
    dosage?: string;
    note?: string;
    description?: string;
}

async function authorizedFetch(url: string, options: RequestInit = {}) {
    const token = await authStorage.getToken();
    if (!token) {
        throw new Error('No authentication token found');
    }

    const headers = {
        'Content-Type': 'application/json',
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

export const logService = {
    createMoodLog: async (data: {
        userId: number;
        moodRating: number;
        note?: string;
        moodTagIds: number[];
    }) => {
        const url = `${API_BASE_URL}/logs/mood`;
        return authorizedFetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    createSleepLog: async (data: {
        userId: number;
        hoursSlept: number;
        sleepQualityTagIds: number;
        note?: string;
        sleepDate: string;
    }) => {
        const url = `${API_BASE_URL}/logs/sleep`;
        return authorizedFetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getUserMedications: async (userId: number): Promise<UserMedication[]> => {
        const url = `${API_BASE_URL}/users/${userId}/user-medication`;
        return authorizedFetch(url, { method: 'GET' });
    },

    createMedicationLog: async (data: {
        userId: number;
        userMedicationId: number;
        takenAt: string;
        note?: string;
    }) => {
        const url = `${API_BASE_URL}/logs/medication`;
        return authorizedFetch(url, {
            method: 'POST',
            body: JSON.stringify({
                user_id: data.userId,
                user_medication_id: data.userMedicationId,
                taken_at: data.takenAt,
                note: data.note,
            }),
        });
    },
};
