import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { MOOD_COLORS } from "../../../constants/MoodColors";

type Mood = keyof typeof MOOD_COLORS;

export type PatternDetectionResponse = {
  summary: {
    entryCount: number;
    averageIntensity: number;
    moodFrequencies: Record<Mood, number>;
  };
  patterns: {
    moodStability: string;
    dominantMoods: string[];
    bestDayOfWeek: string;
    worstDayOfWeek: string;
    longestPositiveStreak: number;
    longestNegativeStreak: number;
    moodChangeSummary?: string[];
  };
};

function generatePatternInsights(data: PatternDetectionResponse): string[] {
  const insights: string[] = [];

  try {
    // Mood stability insight
    if (data.patterns?.moodStability) {
      const stability = data.patterns.moodStability.toLowerCase();
      insights.push(`Your mood stability is rated as ${stability}.`);
    }

    // Best/worst day insight
    if (data.patterns?.bestDayOfWeek && data.patterns?.worstDayOfWeek) {
      const bestDay = data.patterns.bestDayOfWeek.toLowerCase();
      const worstDay = data.patterns.worstDayOfWeek.toLowerCase();
      insights.push(
        `Your best moods occur on ${bestDay}s, while ${worstDay}s tend to be more challenging.`
      );
    }

    // Streak insight
    if (data.patterns?.longestPositiveStreak != null) {
      const positiveStreak = data.patterns.longestPositiveStreak;
      const negativeStreak = data.patterns.longestNegativeStreak || 0;
      if (positiveStreak > 0) {
        insights.push(
          `You've maintained positive moods for up to ${positiveStreak} consecutive days.`
        );
      }
      if (negativeStreak > 0) {
        insights.push(
          `Your longest difficult period was ${negativeStreak} day(s).`
        );
      }
    }

    // Dominant moods insight
    if (
      data.patterns?.dominantMoods &&
      data.patterns.dominantMoods.length > 0
    ) {
      const dominantMoods = data.patterns.dominantMoods.join(" and ");
      insights.push(`${dominantMoods} are your dominant mood patterns.`);
    }

    // Overall intensity insight
    if (data.summary?.averageIntensity != null) {
      const intensity = data.summary.averageIntensity;
      let intensityDescription = "moderate";
      if (intensity >= 7) intensityDescription = "high";
      else if (intensity <= 4) intensityDescription = "low";
      insights.push(
        `Your average mood intensity is ${intensityDescription} (${intensity.toFixed(
          1
        )}/10).`
      );
    }
  } catch (error) {
    insights.push("Analyzing your mood patterns...");
  }

  return insights.slice(0, 4); // Limit to 4 insights
}

function getPieChartLayout(chartWidth: number, donut: boolean = true) {
  const isWeb = chartWidth >= 768; // web breakpoint

  let baseRadius = chartWidth / 3; // same as your current mobile size

  if (isWeb) {
    baseRadius *= 0.3; // shrink only on web
  }

  const innerRadius = donut ? Math.floor(baseRadius / 2) : 0;

  return {
    radius: baseRadius,
    innerRadius,
    textSize: 12,
  };
}

export default function PatternDetectionView({
  data,
  startDate,
  endDate,
}: {
  data: PatternDetectionResponse;
  startDate?: string;
  endDate?: string;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = Math.max(screenWidth - 32, 280); // 32 for padding, min width fallback

  // ...existing code...

  const barData = Object.entries(data.summary.moodFrequencies).map(
    ([mood, percentage]) => ({
      value: Number(percentage),
      label: mood,
      frontColor: MOOD_COLORS[mood as Mood],
    })
  );

  const pieData = Object.entries(data.summary.moodFrequencies).map(
    ([mood, percentage]) => ({
      value: Number(percentage),
      color: MOOD_COLORS[mood as Mood],
      // text: `${mood}`, // optional label inside chart
    })
  );

  const pieDataTags = Object.entries(data.summary.moodFrequencies).map(
    ([mood, percentage]) => ({
      value: Number(percentage),
      color: MOOD_COLORS[mood as Mood],
      text: `${mood}`, // optional label inside chart
    })
  );

  const numPoints = barData.length;
  // const spacing =
  //   numPoints > 1 ? (chartWidth - 40) / (numPoints - 1) : chartWidth / 2;

  const { radius, innerRadius, textSize } = getPieChartLayout(
    chartWidth,
    numPoints,
    true
  );

  const insights = generatePatternInsights(data);

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pattern Detection</Text>
      {startDate && endDate && (
        <Text style={styles.subtitle}>
          {new Date(startDate).toDateString()} →{" "}
          {new Date(endDate).toDateString()}
        </Text>
      )}
      <Text style={styles.subtitle}>
        Based on {data.summary.entryCount} journal entries
      </Text>

      {/* KPIs */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{data.summary.entryCount}</Text>
          <Text style={styles.kpiLabel}>Entries</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>
            {data.summary.averageIntensity.toFixed(1)}
          </Text>
          <Text style={styles.kpiLabel}>Avg Rating</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{data.patterns.moodStability}</Text>
          <Text style={styles.kpiLabel}>Stability</Text>
        </View>
      </View>

      {/* Mood Distribution Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood Distribution (%)</Text>
        {/* <BarChart
          data={barData}
          hideRules
          xAxisLabelTextStyle={styles.axisText}
          yAxisTextStyle={styles.axisText}
          noOfSections={5}
          maxValue={Math.max(...barData.map((d) => d.value)) + 5}
          barWidth={barWidth}
          spacing={spacing}
          width={chartWidth}
          initialSpacing={initialSpacing}
        /> */}
        <PieChart
          data={pieData}
          donut // if you want a donut style
          radius={radius}
          innerRadius={innerRadius}
          showText
          textColor="#fff"
          textSize={textSize}
        />
      </View>
      <View style={styles.legendRow}>
        {pieDataTags.map((mood) => (
          <View key={mood.text} style={styles.legendItem}>
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: mood.color,
                borderRadius: 2,
                marginRight: 6,
              }}
            />
            <Text style={styles.legendText}>
              {mood.text} {mood.value}%
            </Text>
          </View>
        ))}
      </View>

      {/* Highlights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Highlights</Text>
        <View style={styles.highlightsContainer}>
          <View style={styles.highlightRow}>
            <Text style={styles.highlightLabel}>Best Day:</Text>
            <Text style={styles.highlightValue}>
              {data.patterns.bestDayOfWeek}
            </Text>
          </View>
          <View style={styles.highlightRow}>
            <Text style={styles.highlightLabel}>Worst Day:</Text>
            <Text style={styles.highlightValue}>
              {data.patterns.worstDayOfWeek}
            </Text>
          </View>
          <View style={styles.highlightRow}>
            <Text style={styles.highlightLabel}>Positive Streak:</Text>
            <Text style={styles.highlightValue}>
              {data.patterns.longestPositiveStreak} days
            </Text>
          </View>
          <View style={styles.highlightRow}>
            <Text style={styles.highlightLabel}>Negative Streak:</Text>
            <Text style={styles.highlightValue}>
              {data.patterns.longestNegativeStreak} days
            </Text>
          </View>
          <View style={styles.highlightRow}>
            <Text style={styles.highlightLabel}>Dominant Moods:</Text>
            <View style={styles.moodPills}>
              {data.patterns.dominantMoods.map((mood) => (
                <View
                  key={mood}
                  style={[
                    styles.moodPill,
                    { backgroundColor: MOOD_COLORS[mood as Mood] },
                  ]}
                >
                  <Text style={styles.moodPillText}>{mood}</Text>
                </View>
              ))}
            </View>
          </View>
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
  content: { padding: 0 },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { color: "#666", marginBottom: 16 },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 8,
  },
  legendText: { fontSize: 12, color: "#333" },
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
  section: { marginTop: 8, marginBottom: 18 },
  sectionTitle: { fontWeight: "600", marginBottom: 8 },
  axisText: { color: "#555" },
  highlightsContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
  },
  highlightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  highlightLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  highlightValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "600",
  },
  moodPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  moodPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodPillText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
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
  bullet: {
    fontSize: 14,
    color: "#3b82f6",
    marginRight: 8,
    fontWeight: "bold",
  },
  insightText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  moodChangesContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
  },
  moodChangeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  moodChangeText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
