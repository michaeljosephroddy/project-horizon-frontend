import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import apiClient from "../../../src/api/apiClient";
import { AuthContext } from "../../../src/context/AuthContext";
import PatternDetectionView, {
  PatternDetectionResponse,
} from "./PatternDetectionView";
import PeriodComparisonView, {
  PeriodComparisonResponse,
} from "./PeriodComparisonView";
import ReportView from "./ReportView";
import TrendAnalysisView, { TrendAnalysisResponse } from "./TrendAnalysisView";

// Utility functions for date ranges
function getLast4WeeksRange() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 28);
  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
}

function getPeriodComparisonRanges() {
  const today = new Date();

  // Period 2 → last 4 weeks
  const endPeriod2 = today;
  const startPeriod2 = new Date();
  startPeriod2.setDate(endPeriod2.getDate() - 28);

  // Period 1 → 4 weeks before period 2
  const endPeriod1 = new Date(startPeriod2);
  endPeriod1.setDate(startPeriod2.getDate() - 1);
  const startPeriod1 = new Date(endPeriod1);
  startPeriod1.setDate(endPeriod1.getDate() - 27);

  return {
    period1: {
      start: startPeriod1.toISOString().split("T")[0],
      end: endPeriod1.toISOString().split("T")[0],
    },
    period2: {
      start: startPeriod2.toISOString().split("T")[0],
      end: endPeriod2.toISOString().split("T")[0],
    },
  };
}

// Format the plain text report into styled sections
function formatReport(report: string) {
  const lines = report.split("\n");
  return lines.map((line, idx) => {
    // Headings
    if (line.startsWith("==")) {
      return (
        <Text key={idx} style={styles.sectionHeader}>
          {line.replace(/==/g, "").trim()}
        </Text>
      );
    }
    // Title line
    if (line.startsWith("Mood Analytics Report")) {
      return (
        <Text key={idx} style={styles.reportTitle}>
          {line}
        </Text>
      );
    }
    // Bullet points
    if (line.startsWith("•") || line.startsWith("-")) {
      return (
        <Text key={idx} style={styles.bullet}>
          {line}
        </Text>
      );
    }
    // Blank line
    if (line.trim() === "") {
      return <View key={idx} style={{ height: 8 }} />;
    }
    // Default line
    return (
      <Text key={idx} style={styles.normalText}>
        {line}
      </Text>
    );
  });
}

export default function AnalyticsScreen() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [trendData, setTrendData] = useState<TrendAnalysisResponse | null>(
    null
  );
  const [patternData, setPatternData] =
    useState<PatternDetectionResponse | null>(null);
  const [comparisonData, setComparisonData] =
    useState<PeriodComparisonResponse | null>(null);
  const { user } = useContext(AuthContext);

  const userId = user?.id ?? 1;

  // Keep ranges in state to pass to child views
  const [{ startDate, endDate }, setTrendRange] = useState(
    getLast4WeeksRange()
  );
  const [{ period1, period2 }, setCompareRanges] = useState(
    getPeriodComparisonRanges()
  );

  // Load analytics on mount
  React.useEffect(() => {
    const { startDate, endDate } = getLast4WeeksRange();
    const { period1, period2 } = getPeriodComparisonRanges();
    // also store
    setTrendRange({ startDate, endDate });
    setCompareRanges({ period1, period2 });
    let cancelled = false;
    async function loadAll() {
      setLoading(true);
      try {
        const [trendRes, patternRes, compareRes] = await Promise.all([
          apiClient.get(`/analytics/users/${userId}/trend-analysis`, {
            params: { startDate, endDate },
          }),
          apiClient.get(`/analytics/users/${userId}/pattern-detection`, {
            params: { startDate, endDate },
          }),
          apiClient.get(`/analytics/users/${userId}/period-comparison`, {
            params: {
              period1Start: period1.start,
              period1End: period1.end,
              period2Start: period2.start,
              period2End: period2.end,
            },
          }),
        ]);
        if (cancelled) return;
        setTrendData(trendRes.data as TrendAnalysisResponse);
        setPatternData(patternRes.data as PatternDetectionResponse);
        setComparisonData(compareRes.data as PeriodComparisonResponse);
      } catch (err) {
        if (!cancelled) {
          // Keep minimal error surface; sections render will handle nulls
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  async function fetchReport() {
    const { startDate, endDate } = getLast4WeeksRange();
    const { period1, period2 } = getPeriodComparisonRanges();
    setLoading(true);
    try {
      const [reportRes, trendRes, patternRes, compareRes] = await Promise.all([
        apiClient.get(`/analytics/users/${userId}/generate-report`, {
          params: {
            startDate,
            endDate,
            period1Start: period1.start,
            period1End: period1.end,
            period2Start: period2.start,
            period2End: period2.end,
          },
        }),
        apiClient.get(`/analytics/users/${userId}/trend-analysis`, {
          params: { startDate, endDate },
        }),
        apiClient.get(`/analytics/users/${userId}/pattern-detection`, {
          params: { startDate, endDate },
        }),
        apiClient.get(`/analytics/users/${userId}/period-comparison`, {
          params: {
            period1Start: period1.start,
            period1End: period1.end,
            period2Start: period2.start,
            period2End: period2.end,
          },
        }),
      ]);
      setResult({
        reportText: reportRes.data,
        trend: trendRes.data,
        pattern: patternRes.data,
        comparison: compareRes.data,
        _type: "report",
      });
    } catch (err) {
      setResult({ error: "Failed to generate report" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Analytics</Text>

      {/* Auto-loaded sections below; keep Generate Report as manual */}
      <Button
        title="📝 Generate Report"
        onPress={fetchReport}
        disabled={loading}
      />

      <View style={{ height: 12 }} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>Loading…</Text>
        </View>
      ) : (
        <>
          <Text style={styles.resultHeader}>Trend Analysis</Text>
          {trendData ? (
            <View style={{ marginTop: 12 }}>
              <TrendAnalysisView data={trendData} />
            </View>
          ) : (
            <Text>Unable to load trend analysis.</Text>
          )}

          <Text style={styles.resultHeader}>Pattern Detection</Text>
          {patternData ? (
            <View style={{ marginTop: 12 }}>
              <PatternDetectionView
                data={patternData}
                startDate={startDate}
                endDate={endDate}
              />
            </View>
          ) : (
            <Text>Unable to load pattern detection.</Text>
          )}

          <Text style={styles.resultHeader}>Period Comparison</Text>
          {comparisonData ? (
            <View style={{ marginTop: 12 }}>
              <PeriodComparisonView
                data={comparisonData}
                period1Start={period1.start}
                period1End={period1.end}
                period2Start={period2.start}
                period2End={period2.end}
              />
            </View>
          ) : (
            <Text>Unable to load period comparison.</Text>
          )}

          {/* Render consolidated report if generated below */}
          {result && (result as any)._type === "report" && (
            <View style={{ marginTop: 12 }}>
              <ReportView
                reportText={(result as any).reportText}
                trend={(result as any).trend}
                pattern={(result as any).pattern}
                comparison={(result as any).comparison}
              />
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  resultHeader: { fontWeight: "600", marginTop: 12 },
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
});
