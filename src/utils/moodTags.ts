// utils/moodTags.ts
export interface MoodTag {
  id: number;
  name: string;
  category: number;
}

export interface MoodTagCategory {
  name: string;
  color: string;
}

// Fix the type definition to allow number indexing
export const MOOD_TAG_CATEGORIES: Record<number, MoodTagCategory> = {
  1: { name: 'Positive', color: '#4CAF50' },
  2: { name: 'Negative', color: '#F44336' },
  3: { name: 'Neutral', color: '#FF9800' },
  4: { name: 'Energy', color: '#2196F3' },
  5: { name: 'Clinical', color: '#9C27B0' },
};

export const MOOD_TAGS: MoodTag[] = [
  // Positive
  { id: 1, name: 'Happy', category: 1 },
  { id: 2, name: 'Excited', category: 1 },
  { id: 3, name: 'Calm', category: 1 },
  { id: 4, name: 'Grateful', category: 1 },
  { id: 5, name: 'Confident', category: 1 },
  
  // Negative
  { id: 6, name: 'Sad', category: 2 },
  { id: 7, name: 'Anxious', category: 2 },
  { id: 8, name: 'Angry', category: 2 },
  { id: 9, name: 'Frustrated', category: 2 },
  { id: 10, name: 'Lonely', category: 2 },
  
  // Neutral
  { id: 11, name: 'Content', category: 3 },
  { id: 12, name: 'Restless', category: 3 },
  { id: 13, name: 'Confused', category: 3 },
  { id: 14, name: 'Bored', category: 3 },
  
  // Energy
  { id: 15, name: 'Energetic', category: 4 },
  { id: 16, name: 'Tired', category: 4 },
  
  // Clinical
  { id: 17, name: 'Manic', category: 5 },
  { id: 18, name: 'Hypomanic', category: 5 },
  { id: 19, name: 'Depressed', category: 5 },
  { id: 20, name: 'Mixed State', category: 5 },
  { id: 21, name: 'Irritable', category: 5 },
];
