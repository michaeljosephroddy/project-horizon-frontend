import { useRouter } from "expo-router";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "../../src/api/apiClient";
import { AuthContext } from "../../src/context/AuthContext";

type JournalEntry = {
  journalEntryId: number;
  overallRating: number; // 1..10
  timestamp: string; // ISO
};

function ratingToEmoji(avg: number | null) {
  if (avg == null) return "–";
  if (avg >= 8.5) return "😄";
  if (avg >= 7) return "😊";
  if (avg >= 5.5) return "🙂";
  if (avg >= 4) return "😕";
  return "☹️";
}

function formatAvg(avg: number | null) {
  return avg == null ? "–" : `${avg.toFixed(1)}/10`;
}

function computeCurrentStreakDays(datesIso: string[]) {
  if (datesIso.length === 0) return 0;
  const set = new Set(datesIso.map((d) => d.split("T")[0]));
  // Start from the latest date we have
  const latest = datesIso
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  let streak = 0;
  const cursor = new Date(latest);
  while (true) {
    const key = cursor.toISOString().split("T")[0];
    if (set.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function Dashboard() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const userId = user?.id ?? 1;

  const [loading, setLoading] = useState<boolean>(true);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(
          `/journal/users/${userId}/journal-entries`
        );
        if (!cancelled) setEntries(res.data || []);
      } catch (e) {
        if (!cancelled) setError("Failed to load stats");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const entriesCount = entries.length;
  const averageRating: number | null = useMemo(() => {
    if (entries.length === 0) return null;
    const sum = entries.reduce(
      (acc, e) => acc + Number(e.overallRating || 0),
      0
    );
    return sum / entries.length;
  }, [entries]);
  const avgEmoji = ratingToEmoji(averageRating);
  const avgLabel = formatAvg(averageRating);
  const streakDays = useMemo(
    () => computeCurrentStreakDays(entries.map((e) => e.timestamp)),
    [entries]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MoodTrendz Dashboard</Text>

      {loading ? (
        <View style={{ alignItems: "center", paddingVertical: 24 }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>Loading…</Text>
        </View>
      ) : (
        <>
          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{entriesCount}</Text>
              <Text style={styles.statLabel}>Journal Entries</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{avgEmoji}</Text>
              <Text style={styles.statLabel}>Average Mood ({avgLabel})</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{streakDays}🔥</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
          {error && (
            <Text style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</Text>
          )}
        </>
      )}

      {/* Navigation Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/journal/CreateJournalEntryView")}
      >
        <Text style={styles.buttonText}>➕ Add Journal Entry</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/journal")}
      >
        <Text style={styles.buttonText}>📖 View Journal</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/analytics")}
      >
        <Text style={styles.buttonText}>📊 View Analytics</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    marginTop: Platform.OS === "android" || Platform.OS === "ios" ? 12 : 0,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#f4f6f8",
    borderRadius: 12,
    padding: 15,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4cafef",
  },
  statLabel: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#4cafef",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
