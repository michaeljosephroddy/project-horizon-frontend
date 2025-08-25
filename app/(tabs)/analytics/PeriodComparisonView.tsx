import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { MOOD_COLORS } from "../../../constants/MoodColors";

type Mood = keyof typeof MOOD_COLORS;

export type PeriodComparisonResponse = {
  period1Stats: {
    entryCount: number;
    averageIntensity: number;
    moodFrequencies: Record<Mood, number>;
  };
  period2Stats: {
    entryCount: number;
    averageIntensity: number;
    moodFrequencies: Record<Mood, number>;
  };
  differences: {
    entryCountDifference: number;
    averageIntensityDifference: number;
    moodFrequencyDifference: Record<Mood, number>;
    moodChangeSummary: string[];
  };
};

function generateComparisonInsights(data: PeriodComparisonResponse): string[] {
  const insights: string[] = [];

  try {
    // Overall intensity change insight
    const intensityDiff = data.differences.averageIntensityDifference;
    if (intensityDiff !== 0) {
      const direction = intensityDiff > 0 ? "improved" : "declined";
      const magnitude = Math.abs(intensityDiff);
      insights.push(
        `Your overall mood rating ${direction} by ${magnitude.toFixed(
          1
        )} points.`
      );
    }

    // Entry count insight
    const entryDiff = data.differences.entryCountDifference;
    if (entryDiff !== 0) {
      const direction = entryDiff > 0 ? "increased" : "decreased";
      insights.push(
        `You made ${Math.abs(entryDiff)} more entries in the recent period.`
      );
    }

    // Top mood changes insight
    const moodChanges = Object.entries(
      data.differences.moodFrequencyDifference || {}
    )
      .map(([mood, change]) => ({ mood, change: Number(change) }))
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      .slice(0, 2);

    if (moodChanges.length > 0) {
      const topChange = moodChanges[0];
      const changeText = topChange.change > 0 ? "increased" : "decreased";
      const percentage = Math.abs(topChange.change * 100).toFixed(1);
      insights.push(
        `${topChange.mood} ${changeText} by ${percentage}% more than other moods.`
      );
    }

    // Overall assessment
    const p1Avg = data.period1Stats.averageIntensity;
    const p2Avg = data.period2Stats.averageIntensity;
    if (p1Avg && p2Avg) {
      const overallChange = p2Avg - p1Avg;
      if (Math.abs(overallChange) > 0.3) {
        const assessment = overallChange > 0 ? "better" : "more challenging";
        insights.push(
          `Overall, your recent period has been ${assessment} compared to the previous one.`
        );
      }
    }

    // Mood stability insight
    const positiveChanges = Object.values(
      data.differences.moodFrequencyDifference || {}
    ).filter((change) => change > 0).length;
    const negativeChanges = Object.values(
      data.differences.moodFrequencyDifference || {}
    ).filter((change) => change < 0).length;

    if (positiveChanges > negativeChanges) {
      insights.push(`More moods showed positive trends than negative ones.`);
    } else if (negativeChanges > positiveChanges) {
      insights.push(`More moods showed negative trends than positive ones.`);
    }
  } catch (error) {
    insights.push("Analyzing your period comparison...");
  }

  return insights.slice(0, 4); // Limit to 4 insights
}

// Calculate barWidth and spacing so all bars fit nicely
function getBarChartLayout(
  chartWidth: number,
  numBars: number,
  initialSpacing: number = 10
) {
  // More responsive breakpoints
  const isMobile = chartWidth < 400;
  const isTablet = chartWidth >= 400 && chartWidth < 768;

  // Dynamic sizing based on device type and number of bars
  let minBarWidth, maxBarWidth, minSpacing;

  if (isMobile) {
    // For mobile, prioritize fitting all bars
    minBarWidth = Math.max(6, Math.floor(chartWidth / (numBars * 2))); // Ensure minimum visibility
    maxBarWidth = Math.min(25, Math.floor((chartWidth / numBars) * 0.7)); // Max 70% of available space per bar
    minSpacing = 1;
  } else if (isTablet) {
    minBarWidth = 12;
    maxBarWidth = 35;
    minSpacing = 3;
  } else {
    minBarWidth = 15;
    maxBarWidth = 45;
    minSpacing = 5;
  }

  const availableWidth = chartWidth - initialSpacing * 2; // Account for both sides
  let barWidth = minBarWidth;
  let spacing = minSpacing;

  if (numBars > 0) {
    // Calculate optimal bar width that fits all bars
    const totalSpacingWidth = minSpacing * (numBars - 1);
    const availableBarWidth = availableWidth - totalSpacingWidth;

    barWidth = Math.floor(availableBarWidth / numBars);
    barWidth = Math.max(minBarWidth, Math.min(barWidth, maxBarWidth));

    // Recalculate spacing with final bar width
    const totalBarsWidth = barWidth * numBars;
    const remainingWidth = availableWidth - totalBarsWidth;

    if (numBars > 1) {
      spacing = Math.max(
        minSpacing,
        Math.floor(remainingWidth / (numBars - 1))
      );
    }
  }

  return { barWidth, spacing, initialSpacing };
}

export default function PeriodComparisonView({
  data,
  period1Start,
  period1End,
  period2Start,
  period2End,
}: {
  data: PeriodComparisonResponse;
  period1Start?: string;
  period1End?: string;
  period2Start?: string;
  period2End?: string;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = Math.max(screenWidth - 32, 280); // 32 for padding, min width fallback

  const period1Data = Object.entries(data.period1Stats.moodFrequencies).map(
    ([mood, percentage]) => ({
      value: Number(percentage * 100), // Convert to percentage
      label: mood,
      frontColor: MOOD_COLORS[mood as Mood],
    })
  );

  const period2Data = Object.entries(data.period2Stats.moodFrequencies).map(
    ([mood, percentage]) => ({
      value: Number(percentage * 100), // Convert to percentage
      label: mood,
      frontColor: MOOD_COLORS[mood as Mood],
    })
  );

  // period 1 spacing
  const numPointsPeriod1 = period1Data.length;
  // period 2 spacing
  const numPointsPeriod2 = period2Data.length;

  const {
    barWidth: barWidth1,
    spacing: spacingPeriod1,
    initialSpacing: initialSpacing1,
  } = getBarChartLayout(
    chartWidth,
    numPointsPeriod1,
    10 // or any small value you want for initial gap
  );
  const {
    barWidth: barWidth2,
    spacing: spacingPeriod2,
    initialSpacing: initialSpacing2,
  } = getBarChartLayout(chartWidth, numPointsPeriod2, 10);

  const insights = generateComparisonInsights(data);

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Period Comparison</Text>
      {period1Start && period1End && period2Start && period2End && (
        <Text style={styles.subtitle}>
          Period 1: {new Date(period1Start).toDateString()} →{" "}
          {new Date(period1End).toDateString()} {"  "}| Period 2:{" "}
          {new Date(period2Start).toDateString()} →{" "}
          {new Date(period2End).toDateString()}
        </Text>
      )}
      <Text style={styles.subtitle}>
        Comparing two time periods to identify changes
      </Text>

      <Text style={styles.periodTitle}>Period 1</Text>

      {/* Period 1 summary card */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{data.period1Stats.entryCount}</Text>
          <Text style={styles.kpiLabel}>Entries</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>
            {data.period1Stats.averageIntensity.toFixed(1)}
          </Text>
          <Text style={styles.kpiLabel}>Avg Rating</Text>
        </View>
      </View>

      {/* Period 1 Stats and Chart */}
      <View style={styles.periodSection}>
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Mood Distribution (%)</Text>
          <BarChart
            data={period1Data}
            hideRules
            xAxisLabelTextStyle={styles.axisText}
            yAxisTextStyle={styles.axisText}
            noOfSections={5}
            maxValue={Math.max(...period1Data.map((d) => d.value)) + 5}
            barWidth={barWidth1}
            spacing={spacingPeriod1}
            width={chartWidth}
            initialSpacing={initialSpacing1}
          />
        </View>
      </View>

      <Text style={styles.periodTitle}>Period 2</Text>

      {/* Period 2 summary card */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{data.period2Stats.entryCount}</Text>
          <Text style={styles.kpiLabel}>Entries</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>
            {data.period2Stats.averageIntensity.toFixed(1)}
          </Text>
          <Text style={styles.kpiLabel}>Avg Rating</Text>
        </View>
      </View>

      {/* Period 2 Stats and Chart */}
      <View style={styles.periodSection}>
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Mood Distribution (%)</Text>
          <BarChart
            data={period2Data}
            hideRules
            xAxisLabelTextStyle={styles.axisText}
            yAxisTextStyle={styles.axisText}
            noOfSections={5}
            maxValue={Math.max(...period2Data.map((d) => d.value)) + 5}
            barWidth={barWidth2}
            spacing={spacingPeriod2}
            width={chartWidth}
            initialSpacing={initialSpacing2}
          />
        </View>
      </View>

      {/* Changes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Changes</Text>
        <View style={styles.changesContainer}>
          <View style={styles.changeRow}>
            <Text style={styles.changeLabel}>Entries:</Text>
            <Text
              style={[
                styles.changeValue,
                {
                  color:
                    data.differences.entryCountDifference >= 0
                      ? "#059669"
                      : "#dc2626",
                },
              ]}
            >
              {data.differences.entryCountDifference >= 0 ? "+" : ""}
              {data.differences.entryCountDifference}
            </Text>
          </View>
          <View style={styles.changeRow}>
            <Text style={styles.changeLabel}>Intensity:</Text>
            <Text
              style={[
                styles.changeValue,
                {
                  color:
                    data.differences.averageIntensityDifference >= 0
                      ? "#059669"
                      : "#dc2626",
                },
              ]}
            >
              {data.differences.averageIntensityDifference >= 0 ? "+" : ""}
              {data.differences.averageIntensityDifference.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>

      {/* Mood Changes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood Changes</Text>
        <View style={styles.moodChangesContainer}>
          {data.differences.moodChangeSummary.map((change, index) => {
            // e.g. "CONTENT increased by 8%" or "IRRITATED stayed the same"
            const match = change.match(
              /^(\w+)\s+(increased|decreased|stayed the same)(?:\s+by\s+([0-9]+)%)*$/i
            );
            const moodName = (
              match?.[1] ||
              change.split(" ")[0] ||
              ""
            ).toUpperCase() as Mood;
            const direction = (match?.[2] || "").toLowerCase();
            const percentStr = match?.[3] || "";

            const isIncrease = direction === "increased";
            const isDecrease = direction === "decreased";
            const isSame = direction === "stayed the same";

            // If percent missing in summary, try to compute from differences map
            const diffFraction = (data.differences.moodFrequencyDifference[
              moodName
            ] ?? 0) as number;
            const percent = percentStr
              ? Number(percentStr)
              : Math.round(Math.abs(diffFraction) * 1000) / 10;

            const moodColor = MOOD_COLORS[moodName] || "#9ca3af";
            const deltaColor = isIncrease
              ? "#059669"
              : isDecrease
              ? "#dc2626"
              : "#6b7280";
            const arrow = isIncrease ? "▲" : isDecrease ? "▼" : "–";

            return (
              <View key={index} style={styles.changeRow}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: moodColor,
                    borderRadius: 2,
                    marginRight: 8,
                  }}
                />
                <Text style={styles.changeMood}>{moodName}</Text>
                <Text style={[styles.changeDelta, { color: deltaColor }]}>
                  {arrow}
                  {!isSame && percent
                    ? ` ${isIncrease ? "+" : "-"}${percent}%`
                    : ""}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
        <View style={styles.insightsContainer}>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  content: { padding: 12 },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { color: "#666", marginBottom: 16 },
  periodSection: {
    marginBottom: 20,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
  },
  periodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  periodStats: {
    alignItems: "flex-end",
  },
  periodStat: {
    fontSize: 12,
    color: "#6b7280",
  },
  chartContainer: {
    alignItems: "flex-start",
  },
  section: { marginTop: 8, marginBottom: 18 },
  sectionTitle: { fontWeight: "600", marginBottom: 8 },
  axisText: { color: "#555" },
  changesContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  changeLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  changeValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  moodChangesContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
  },
  moodChangeItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    color: "#3b82f6",
    marginRight: 8,
    fontWeight: "bold",
  },
  moodChangeText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  insightsContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
  },
  insightItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  insightText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  changeMood: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    marginRight: 8,
  },
  changeDelta: {
    fontSize: 14,
    fontWeight: "600",
  },
  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  kpiLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  statPrimary: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  statSecondary: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
});
