import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import apiClient from "../../../src/api/apiClient";
import { AuthContext } from "../../../src/context/AuthContext";

const MOOD_TAGS = [
  { id: 3, name: "ANGRY" },
  { id: 4, name: "ANXIOUS" },
  { id: 6, name: "CALM" },
  { id: 9, name: "CONTENT" },
  { id: 7, name: "DEPRESSED" },
  { id: 5, name: "EXCITED" },
  { id: 1, name: "HAPPY" },
  { id: 8, name: "IRRITATED" },
  { id: 2, name: "SAD" },
  { id: 10, name: "STRESSED" },
];

const MOOD_RATINGS = Array.from({ length: 10 }, (_, i) => ({
  label: (i + 1).toString(),
  score: i + 1,
}));

export default function NewJournalEntry() {
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [selectedMoodRating, setSelectedMoodRating] = useState(
    MOOD_RATINGS[0].score
  );
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [medications, setMedications] = useState<
    { name: string; dosage: string }[]
  >([]);

  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("");

  function toggleTag(tagId: number) {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  }

  function addMedication() {
    if (!medName.trim() || !medDosage.trim()) return;
    setMedications((prev) => [...prev, { name: medName, dosage: medDosage }]);
    setMedName("");
    setMedDosage("");
  }

  async function create() {
    try {
      const userId = user?.id ?? 1;
      const body = {
        userId,
        overallRating: selectedMoodRating,
        note,
        timestamp: new Date().toISOString(),
        moodTags: selectedTags.map((id) => {
          const tag = MOOD_TAGS.find((t) => t.id === id);
          return { id: tag?.id, name: tag?.name };
        }),
        medications,
      };
      await apiClient.post(`/journal/users/${userId}/journal-entries`, body);
      setSuccess(true);
    } catch (err) {
      Alert.alert("Error", "Failed to create entry");
    }
  }

  if (success) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
          Entry Created! 📝
        </Text>
        <Text style={{ marginBottom: 24 }}>
          Your journal entry has been saved successfully.
        </Text>
        <Button
          title="View All Entries"
          onPress={() => router.push("/(tabs)/journal")}
        />
        <View style={{ height: 12 }} />
        <Button
          title="Go to Dashboard"
          onPress={() => router.push("/(tabs)")}
        />
        <View style={{ height: 12 }} />
        <Button
          title="Add Another"
          onPress={() => {
            setSuccess(false);
            setSelectedMoodRating(MOOD_RATINGS[0].score);
            setNote("");
            setSelectedTags([]);
            setMedications([]);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mood Rating */}
      <Text style={styles.sectionTitle}>Mood Rating</Text>

      <View style={styles.row}>
        {MOOD_RATINGS.map((r) => (
          <Pressable
            key={r.label}
            style={[
              styles.choice,
              selectedMoodRating === r.score && styles.choiceSelected,
            ]}
            onPress={() => setSelectedMoodRating(r.score)}
          >
            <Text
              style={[
                styles.choiceText,
                selectedMoodRating === r.score && styles.choiceTextSelected,
              ]}
            >
              {r.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Mood Tags */}
      <Text style={styles.sectionTitle}>Mood Tags</Text>
      <View style={styles.rowWrap}>
        {MOOD_TAGS.map((tag) => (
          <Pressable
            key={tag.id}
            style={[
              styles.tag,
              selectedTags.includes(tag.id) && styles.tagSelected,
            ]}
            onPress={() => toggleTag(tag.id)}
          >
            <Text
              style={[
                styles.tagText,
                selectedTags.includes(tag.id) && styles.tagTextSelected,
              ]}
            >
              {tag.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Medications */}
      <Text style={styles.sectionTitle}>Medications 💊</Text>
      <View style={styles.row}>
        <TextInput
          placeholder="Name"
          value={medName}
          onChangeText={setMedName}
          style={[styles.input, { flex: 1 }]}
        />
        <TextInput
          placeholder="Dosage"
          value={medDosage}
          onChangeText={setMedDosage}
          style={[styles.input, { flex: 1, marginLeft: 8 }]}
        />
        <Button title="Add" onPress={addMedication} />
      </View>
      {medications.map((med, idx) => (
        <Text key={idx} style={styles.medItem}>
          💊 {med.name} — {med.dosage}
        </Text>
      ))}

      {/* Note */}
      <Text style={styles.sectionTitle}>Notes</Text>
      <TextInput
        placeholder="Write something..."
        value={note}
        onChangeText={setNote}
        style={[styles.input, { height: 120 }]}
        multiline
      />

      <Button title="Save" onPress={create} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  sectionTitle: { fontWeight: "600", marginVertical: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  choice: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  choiceSelected: { backgroundColor: "#4cafef", borderColor: "#4cafef" },
  choiceText: { color: "#333" },
  choiceTextSelected: { color: "#fff" },
  tag: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagSelected: { backgroundColor: "#4cafef", borderColor: "#4cafef" },
  tagText: { fontSize: 12 },
  tagTextSelected: { color: "#fff" },
  medItem: { marginBottom: 4 },
});
