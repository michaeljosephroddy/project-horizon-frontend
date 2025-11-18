// services/logService.ts
const API_BASE_URL = 'http://192.168.49.1:9095';

export const logService = {
    createMoodLog: async (data: {
        userId: number;
        moodRating: number;
        note?: string;
        moodTagIds: number[];
    }) => {
        const res = await fetch(`${API_BASE_URL}/logs/mood`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Failed to create mood log');
        return res.json();
    }
}
