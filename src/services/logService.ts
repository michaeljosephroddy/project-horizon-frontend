// services/logService.ts
const API_BASE_URL = 'http://192.168.49.1:9095';

export const logService = {
  createMoodLog: async (data: {
    user_id: number | string;
    mood_rating: number;
    note?: string;
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
