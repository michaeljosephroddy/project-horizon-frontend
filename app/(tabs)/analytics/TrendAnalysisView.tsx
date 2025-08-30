import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { MOOD_COLORS } from "../../../constants/MoodColors";

type Mood = keyof typeof MOOD_COLORS;

type WeeklyTrend = {
  weekStart: string; // YYYY-MM-DD
  averageRating: number;
  moodFrequency: Partial<Record<Mood, number>>;
};

export type TrendAnalysisResponse = {
  startDate: string;
  endDate: string;
  averageRatingTrend: string;
  trend: WeeklyTrend[];
};

function formatWeekLabel(isoDate: string) {
  const d = new Date(isoDate + "T00:00:00");
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}/${day}`;
}

function generateTrendInsights(data: TrendAnalysisResponse): string[] {
  const insights: string[] = [];

  try {
    // Overall trend insight
    const trend = data.averageRatingTrend?.toLowerCase();
    if (trend) {
      insights.push(`Your mood trend is ${trend} over this period.`);
    }

    // Most frequent mood insight
    const moodTotals: Record<Mood, number> = Object.fromEntries(
      Object.keys(MOOD_COLORS).map((mood) => [mood as Mood, 0])
    ) as Record<Mood, number>;
    let totalMoodCount = 0;
    for (const week of data.trend || []) {
      for (const [mood, count] of Object.entries(week.moodFrequency || {})) {
        moodTotals[mood as Mood] =
          (moodTotals[mood as Mood] || 0) + Number(count || 0);
        totalMoodCount += Number(count || 0);
      }
    }
    const moodPercentages: Record<Mood, number> = Object.fromEntries(
      Object.keys(MOOD_COLORS).map((mood) => [mood as Mood, 0])
    ) as Record<Mood, number>;
    for (const mood of Object.keys(moodTotals) as Mood[]) {
      moodPercentages[mood] = totalMoodCount
        ? Math.round((moodTotals[mood] / totalMoodCount) * 100)
        : 0;
    }
    const topMood = Object.entries(moodPercentages).sort(
      (a, b) => b[1] - a[1]
    )[0];
    if (topMood) {
      insights.push(
        `${topMood[0]} was your most frequent mood (${topMood[1]}%).`
      );
    }

    // Rating range insight
    const ratings =
      data.trend?.map((w) => w.averageRating).filter((r) => r != null) || [];
    if (ratings.length > 0) {
      const min = Math.min(...ratings);
      const max = Math.max(...ratings);
      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      insights.push(
        `Your weekly ratings ranged from ${min.toFixed(1)} to ${max.toFixed(
          1
        )} (avg: ${avg.toFixed(1)}/10).`
      );
    }

    // Notable changes insight
    if (data.trend && data.trend.length >= 2) {
      const firstWeek = data.trend[0];
      const lastWeek = data.trend[data.trend.length - 1];
      const change = lastWeek.averageRating - firstWeek.averageRating;
      if (Math.abs(change) > 0.5) {
        const direction = change > 0 ? "improved" : "declined";
        insights.push(
          `Your mood ${direction} by ${Math.abs(change).toFixed(
            1
          )} points from the first to last week.`
        );
      }
    }
  } catch (error) {
    insights.push("Analyzing your mood patterns...");
  }

  return insights.slice(0, 4); // Limit to 4 insights
}

export default function TrendAnalysisView({
  data,
}: {
  data: TrendAnalysisResponse;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = Math.max(screenWidth - 32, 280); // 32 for padding, min width fallback

  // Prepare line chart data
  const trendOrdered = [...data.trend].sort(
    (a, b) => new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime()
  );

  const numPoints = trendOrdered.length;
  const spacing = numPoints > 0 ? chartWidth / numPoints : chartWidth / 2;

  const lineData = trendOrdered.map((w) => ({
    value: Number(w.averageRating?.toFixed?.(2) ?? w.averageRating),
    label: formatWeekLabel(w.weekStart),
  }));

  // Determine the union of moods present across weeks so stacks are consistent
  const allMoods = Array.from(
    new Set(trendOrdered.flatMap((w) => Object.keys(w.moodFrequency || {})))
  ) as Mood[];

  const labels = trendOrdered.map((w) => formatWeekLabel(w.weekStart));
  const moodLineDataSet = allMoods.map((mood) => ({
    label: mood,
    color: MOOD_COLORS[mood],
    data: trendOrdered.map((w) => ({
      value: Number(w.moodFrequency?.[mood] ?? 0),
      label: formatWeekLabel(w.weekStart),
    })),
  }));
  const maxFreq = Math.max(
    1,
    ...trendOrdered.flatMap((w) =>
      Object.values(w.moodFrequency || {}).map((n) => Number(n))
    )
  );
  const yAxisLabels = Array.from(
    { length: Math.max(5, Math.ceil(maxFreq)) + 1 },
    (_, i) => String(i)
  );

  // Prepare grouped bar chart data for each week
  const groupedBarData = labels.map((label, weekIdx) => ({
    label,
    bars: allMoods.map((mood) => ({
      value: Number(
        moodLineDataSet.find((m) => m.label === mood)?.data[weekIdx]?.value ?? 0
      ),
      frontColor: MOOD_COLORS[mood],
    })),
  }));

  const insights = generateTrendInsights(data);

  // Calculate mood percentages for legend
  const moodTotals: Record<Mood, number> = Object.fromEntries(
    Object.keys(MOOD_COLORS).map((mood) => [mood as Mood, 0])
  ) as Record<Mood, number>;

  let totalMoodCount = 0;
  for (const week of trendOrdered) {
    for (const [mood, count] of Object.entries(week.moodFrequency || {})) {
      moodTotals[mood as Mood] =
        (moodTotals[mood as Mood] || 0) + Number(count || 0);
      totalMoodCount += Number(count || 0);
    }
  }

  const moodPercentages: Record<Mood, number> = Object.fromEntries(
    Object.keys(MOOD_COLORS).map((mood) => [
      mood as Mood,
      totalMoodCount
        ? Number(((moodTotals[mood as Mood] / totalMoodCount) * 100).toFixed(1))
        : 0,
    ])
  ) as Record<Mood, number>;

  return (
    <View style={[styles.wrapper, styles.content]}>
      <Text style={styles.title}>Trend Analysis</Text>
      <Text style={styles.subtitle}>
        {new Date(data.startDate).toDateString()} →{" "}
        {new Date(data.endDate).toDateString()}
      </Text>
      <Text style={styles.badge}>
        Average rating trend: {data.averageRatingTrend}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Average Rating</Text>
        <LineChart
          data={lineData}
          thickness={3}
          color="#4A90E2"
          hideRules
          hideDataPoints={false}
          areaChart
          startFillColor="rgba(74,144,226,0.25)"
          endFillColor="rgba(74,144,226,0.05)"
          curved
          spacing={spacing} // <-- responsive spacing
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          noOfSections={5}
          yAxisLabelTexts={["0", "2", "4", "6", "8", "10"]}
          maxValue={10}
          width={chartWidth}
          initialSpacing={20}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood Tag Frequency Over Time</Text>
        {allMoods.length === 0 ? (
          <Text style={styles.muted}>No mood data</Text>
        ) : (
          <>
            <LineChart
              dataSet={moodLineDataSet as any}
              xAxisLabelTexts={labels}
              hideDataPoints={false}
              dataPointsRadius={3}
              thickness={2}
              spacing={spacing} // <-- now fills chart width
              noOfSections={5}
              maxValue={Math.max(5, Number(maxFreq))}
              yAxisLabelTexts={yAxisLabels}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              hideRules
              width={chartWidth}
              initialSpacing={20}
            />

            <View style={styles.legendRow}>
              {allMoods.map((mood) => (
                <View key={mood} style={styles.legendItem}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: MOOD_COLORS[mood],
                      borderRadius: 2,
                      marginRight: 6,
                    }}
                  />
                  <Text style={styles.legendText}>
                    {mood} {moodPercentages[mood]}%
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  content: { padding: 0 },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { color: "#666", marginBottom: 8 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF5FF",
    color: "#2563eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 16,
  },
  section: { marginTop: 8, marginBottom: 18 },
  sectionTitle: { fontWeight: "600", marginBottom: 8 },
  axisText: { color: "#555" },
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
  muted: { color: "#777" },
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
});
