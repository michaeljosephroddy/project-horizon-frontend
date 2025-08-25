import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  getHeuristicInsights,
  PatternDetectionResponseLite,
  PeriodComparisonResponseLite,
  TrendAnalysisResponseLite,
} from "../../../src/analytics/insights";
import { generateAnalyticsInsights } from "../../../src/api/aiInsights";
import { AuthContext } from "../../../src/context/AuthContext";
import PatternDetectionView, {
  PatternDetectionResponse,
} from "./PatternDetectionView";
import PeriodComparisonView, {
  PeriodComparisonResponse,
} from "./PeriodComparisonView";
import TrendAnalysisView, { TrendAnalysisResponse } from "./TrendAnalysisView";

function formatReport(report: string) {
  const lines = report.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("==")) {
      return (
        <Text key={idx} style={styles.sectionHeader}>
          {line.replace(/==/g, "").trim()}
        </Text>
      );
    }
    if (line.startsWith("Mood Analytics Report")) {
      return (
        <Text key={idx} style={styles.reportTitle}>
          {line}
        </Text>
      );
    }
    if (line.startsWith("•") || line.startsWith("-")) {
      return (
        <Text key={idx} style={styles.bullet}>
          {line}
        </Text>
      );
    }
    if (line.trim() === "") {
      return <View key={idx} style={{ height: 8 }} />;
    }
    return (
      <Text key={idx} style={styles.normalText}>
        {line}
      </Text>
    );
  });
}

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
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setAiLoading(true);
        const res = await generateAnalyticsInsights(user?.id ?? 1, {
          reportText,
          trend,
          pattern,
          comparison,
        });
        if (!cancelled) setAiText(res?.text || null);
      } catch (e) {
        if (!cancelled) setAiText(null);
      } finally {
        if (!cancelled) setAiLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [reportText]);
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

      <Text style={styles.sectionTitle}>Clinical Summary</Text>
      <View style={styles.card}>{formatReport(reportText)}</View>

      <Text style={styles.sectionTitle}>Insights</Text>
      <View style={styles.card}>
        <View style={{ padding: 12 }}>
          {(aiText ? aiText.split("\n") : heuristics).map((line, idx) => (
            <Text key={idx} style={styles.normalText}>
              • {line}
            </Text>
          ))}
          {aiLoading && (
            <Text
              style={[styles.normalText, { color: "#6b7280", marginTop: 6 }]}
            >
              Generating AI insights…
            </Text>
          )}
        </View>
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
