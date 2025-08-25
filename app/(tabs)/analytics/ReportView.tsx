import React, { useContext } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  getHeuristicInsights,
  PatternDetectionResponseLite,
  PeriodComparisonResponseLite,
  TrendAnalysisResponseLite,
} from "../../../src/analytics/insights";
import { AuthContext } from "../../../src/context/AuthContext";
import PatternDetectionView, {
  PatternDetectionResponse,
} from "./PatternDetectionView";
import PeriodComparisonView, {
  PeriodComparisonResponse,
} from "./PeriodComparisonView";
import TrendAnalysisView, { TrendAnalysisResponse } from "./TrendAnalysisView";

export default function ReportView({
  reportText,
  trend,
  pattern,
  comparison,
}: {
  reportText: string;
  trend: TrendAnalysisResponse;
  pattern: PatternDetectionResponse;
  comparison: PeriodComparisonResponse;
}) {
  const heuristics = getHeuristicInsights(
    reportText,
    trend as unknown as TrendAnalysisResponseLite,
    pattern as unknown as PatternDetectionResponseLite,
    comparison as unknown as PeriodComparisonResponseLite
  );
  const { user } = useContext(AuthContext);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 12 }}
    >
      <Text style={styles.header}>Mood Analytics Report</Text>

      <Text style={styles.sectionTitle}>Trend Analysis</Text>
      <View style={styles.card}>
        <TrendAnalysisView data={trend} />
      </View>

      <Text style={styles.sectionTitle}>Pattern Detection</Text>
      <View style={styles.card}>
        <PatternDetectionView data={pattern} />
      </View>

      <Text style={styles.sectionTitle}>Period Comparison</Text>
      <View style={styles.card}>
        <PeriodComparisonView data={comparison} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  sectionTitle: { fontWeight: "600", marginTop: 16, marginBottom: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    // simple shadow-ish feel
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
  },
  reportTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "#4A4A4A",
  },
  bullet: { fontSize: 14, marginLeft: 8, marginBottom: 2 },
  normalText: { fontSize: 14, marginBottom: 2 },
});
