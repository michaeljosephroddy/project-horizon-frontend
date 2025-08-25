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
import TrendAnalysisView, { TrendAnalysisResponse } from "./TrendAnalysisView";

// Utility functions for date ranges
function getDateRange(weeks: number) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - weeks * 7);
  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
}

function getLast4WeeksRange() {
  return getDateRange(4);
}

function getLast2WeeksRange() {
  return getDateRange(2);
}

function getPeriodComparisonRanges(weeks: number) {
  const today = new Date();
  const daysInPeriod = weeks * 7;

  // Period 2 → last N weeks
  const endPeriod2 = today;
  const startPeriod2 = new Date();
  startPeriod2.setDate(endPeriod2.getDate() - daysInPeriod);

  // Period 1 → N weeks before period 2
  const endPeriod1 = new Date(startPeriod2);
  endPeriod1.setDate(startPeriod2.getDate() - 1);
  const startPeriod1 = new Date(endPeriod1);
  startPeriod1.setDate(endPeriod1.getDate() - (daysInPeriod - 1));

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
  const [currentPeriod, setCurrentPeriod] = useState<number>(4); // Track current period (2 or 4 weeks)
  const { user } = useContext(AuthContext);

  const userId = user?.id ?? 1;

  // Keep ranges in state to pass to child views
  const [{ startDate, endDate }, setTrendRange] = useState(
    getLast4WeeksRange()
  );
  const [{ period1, period2 }, setCompareRanges] = useState(
    getPeriodComparisonRanges(4)
  );

  // Load analytics function
  const loadAnalytics = async (weeks: number) => {
    const dateRange = getDateRange(weeks);
    const periodRanges = getPeriodComparisonRanges(weeks);

    // Update state with new ranges
    setTrendRange(dateRange);
    setCompareRanges(periodRanges);
    setCurrentPeriod(weeks);

    setLoading(true);
    try {
      const [trendRes, patternRes, compareRes] = await Promise.all([
        apiClient.get(`/analytics/users/${userId}/trend-analysis`, {
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        }),
        apiClient.get(`/analytics/users/${userId}/pattern-detection`, {
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        }),
        apiClient.get(`/analytics/users/${userId}/period-comparison`, {
          params: {
            period1Start: periodRanges.period1.start,
            period1End: periodRanges.period1.end,
            period2Start: periodRanges.period2.start,
            period2End: periodRanges.period2.end,
          },
        }),
      ]);

      setTrendData(trendRes.data as TrendAnalysisResponse);
      setPatternData(patternRes.data as PatternDetectionResponse);
      setComparisonData(compareRes.data as PeriodComparisonResponse);
      // Clear previous report when loading new analytics
      setResult(null);
    } catch (err) {
      // Keep minimal error surface; sections render will handle nulls
    } finally {
      setLoading(false);
    }
  };

  // Load analytics on mount (default to 4 weeks)
  React.useEffect(() => {
    loadAnalytics(4);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Analytics</Text>

      {/* Time period selection buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="📊 Last 2 Weeks"
            onPress={() => loadAnalytics(2)}
            disabled={loading}
            color={currentPeriod === 2 ? "#007AFF" : "#8E8E93"}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="📈 Last 4 Weeks"
            onPress={() => loadAnalytics(4)}
            disabled={loading}
            color={currentPeriod === 4 ? "#007AFF" : "#8E8E93"}
          />
        </View>
      </View>

      {/* Generate Report button */}
      <View style={styles.reportButtonContainer}>
        <Button title="📝 Generate Report" disabled={loading} />
      </View>

      <View style={{ height: 12 }} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>Loading…</Text>
        </View>
      ) : (
        <>
          <Text style={styles.resultHeader}>
            Trend Analysis ({currentPeriod} weeks)
          </Text>
          {trendData ? (
            <View style={{ marginTop: 12 }}>
              <TrendAnalysisView data={trendData} />
            </View>
          ) : (
            <Text>Unable to load trend analysis.</Text>
          )}

          <Text style={styles.resultHeader}>
            Pattern Detection ({currentPeriod} weeks)
          </Text>
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

          <Text style={styles.resultHeader}>
            Period Comparison ({currentPeriod} weeks)
          </Text>
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
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  reportButtonContainer: {
    marginBottom: 12,
  },
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
