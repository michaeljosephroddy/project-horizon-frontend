import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import apiClient from "../../../src/api/apiClient";
import { AuthContext } from "../../../src/context/AuthContext";

type Medication = {
  medicationId: number;
  name: string;
  dosage: string;
};

type MoodTag = {
  moodTagId: number;
  name: string;
};

type JournalEntry = {
  journalEntryId: number;
  overallRating: number;
  note?: string;
  timestamp: string;
  medications?: Medication[];
  moodTags?: MoodTag[];
};

export default function JournalList() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useContext(AuthContext);

  async function load() {
    setLoading(true);
    try {
      const userId = user?.id ?? 1;
      const res = await apiClient.get(
        `/journal/users/${userId}/journal-entries`
      );
      setEntries(res.data || []);
    } catch (err) {
      console.log("Failed to load journal entries", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title="New Entry"
        onPress={() => {
          /* navigate to new */
        }}
        disabled={loading}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>Loading…</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(i) => String(i.journalEntryId)}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.rating}>⭐ {item.overallRating}</Text>

              {item.moodTags && item.moodTags.length > 0 && (
                <View style={styles.tagContainer}>
                  {item.moodTags.map((tag) => (
                    <View key={tag.moodTagId} style={styles.tag}>
                      <Text style={styles.tagText}>{tag.name}</Text>
                    </View>
                  ))}
                </View>
              )}

              {item.medications && item.medications.length > 0 && (
                <Text style={styles.medication}>
                  💊{" "}
                  {item.medications
                    .map((m) => `${m.name} (${m.dosage})`)
                    .join(", ")}
                </Text>
              )}

              {item.note && <Text style={styles.note}>{item.note}</Text>}

              <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No entries yet.</Text>}
          refreshing={false}
          onRefresh={load}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  item: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
  rating: { fontWeight: "700", fontSize: 16, marginBottom: 6 },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 6 },
  tag: {
    backgroundColor: "#e0e7ff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: { fontSize: 12, fontWeight: "500", color: "#374151" },
  medication: { fontSize: 14, marginBottom: 6, color: "#4b5563" },
  note: { fontSize: 14, color: "#111827", marginBottom: 6 },
  timestamp: { fontSize: 12, color: "#6b7280" },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
});
