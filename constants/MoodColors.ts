export type Mood =
  | "HAPPY"
  | "SAD"
  | "ANGRY"
  | "ANXIOUS"
  | "EXCITED"
  | "CALM"
  | "DEPRESSED"
  | "IRRITATED"
  | "CONTENT"
  | "STRESSED";

export const MOOD_COLORS: Record<Mood, string> = {
  HAPPY: "#10B981",
  SAD: "#3B82F6",
  ANGRY: "#EF4444",
  ANXIOUS: "#F59E0B",
  EXCITED: "#8B5CF6",
  CALM: "#06B6D4",
  DEPRESSED: "#6366F1",
  IRRITATED: "#F97316",
  CONTENT: "#84CC16",
  STRESSED: "#EC4899",
};
