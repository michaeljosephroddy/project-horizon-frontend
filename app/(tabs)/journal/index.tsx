import Ionicons from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
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
      // console.log("API response:", res.data);
      setEntries((res.data || []).toReversed());
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
      {/* Header row with back button */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 0,

          marginTop: 0,
        }}
      >
        <Pressable onPress={() => router.push("/(tabs)")}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </Pressable>
        <Text style={[styles.header, { marginLeft: 12, marginTop: 0 }]}>
          Create Journal Entry
        </Text>
      </View>

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
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    marginTop: Platform.OS === "android" || Platform.OS === "ios" ? 12 : 0,
  },
  header: { fontSize: 24, fontWeight: "700", marginBottom: 0 },
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
