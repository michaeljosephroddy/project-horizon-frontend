// Utility to generate heuristic insights from analytics data without importing app components

// Minimal types to avoid circular dependencies
export type TrendAnalysisResponseLite = {
  averageRatingTrend?: string;
  trend?: Array<{
    averageRating?: number;
    moodFrequency?: Record<string, number> | null;
  }>;
};

export type PatternDetectionResponseLite = {
  patterns?: {
    moodStability?: string;
    bestDayOfWeek?: string;
    worstDayOfWeek?: string;
    longestPositiveStreak?: number;
  } | null;
};

export type PeriodComparisonResponseLite = {
  differences?: {
    averageIntensityDifference?: number;
    moodFrequencyDifference?: Record<string, number> | null;
  } | null;
};

function formatPctPoint(n: number) {
  const v = Math.round(n * 1000) / 10;
  return `${v.toFixed(1)}%`;
}

export function getHeuristicInsights(
  reportText: string,
  trend: TrendAnalysisResponseLite,
  pattern: PatternDetectionResponseLite,
  comparison: PeriodComparisonResponseLite
): string[] {
  const insights: string[] = [];

  // Trend insights
  try {
    const weeks = trend.trend || [];
    const firstWeek = weeks[0];
    const lastWeek = weeks[weeks.length - 1];
    if (firstWeek && lastWeek) {
      const start = Number(
        (firstWeek.averageRating as number)?.valueOf?.() ??
          firstWeek.averageRating
      );
      const end = Number(
        (lastWeek.averageRating as number)?.valueOf?.() ??
          lastWeek.averageRating
      );
      const dir = trend.averageRatingTrend ?? "stable";
      if (!Number.isNaN(start) && !Number.isNaN(end)) {
        insights.push(
          `Average rating moved from ${start} to ${end}; overall trend is ${dir}.`
        );
      }
    }
    // Most frequent mood overall during the period
    const moodTotals: Record<string, number> = {};
    for (const w of weeks) {
      for (const [m, c] of Object.entries(w.moodFrequency || {})) {
        moodTotals[m] = (moodTotals[m] || 0) + Number(c || 0);
      }
    }
    const topMood = Object.entries(moodTotals).sort((a, b) => b[1] - a[1])[0];
    if (topMood) {
      insights.push(
        `Most frequent mood across weeks: ${topMood[0]} (${topMood[1]} tags).`
      );
    }
  } catch {}

  // Pattern insights
  try {
    if (pattern.patterns?.moodStability) {
      insights.push(`Mood stability is ${pattern.patterns.moodStability}.`);
    }
    if (pattern.patterns?.bestDayOfWeek && pattern.patterns?.worstDayOfWeek) {
      insights.push(
        `Best day: ${pattern.patterns.bestDayOfWeek}, Worst day: ${pattern.patterns.worstDayOfWeek}.`
      );
    }
    if (pattern.patterns?.longestPositiveStreak != null) {
      insights.push(
        `Longest positive streak: ${pattern.patterns.longestPositiveStreak} day(s).`
      );
    }
  } catch {}

  // Comparison insights
  try {
    const d = comparison.differences;
    if (d?.averageIntensityDifference != null) {
      const delta = Number(d.averageIntensityDifference.toFixed(2));
      insights.push(
        `Average intensity changed by ${delta >= 0 ? "+" : ""}${delta}.`
      );
    }
    const diffs = Object.entries(d?.moodFrequencyDifference || {}).map(
      ([m, v]) => ({
        mood: m,
        delta: Number(v || 0),
      })
    );
    const topUp = diffs
      .filter((x) => x.delta > 0)
      .sort((a, b) => b.delta - a.delta)[0];
    const topDown = diffs
      .filter((x) => x.delta < 0)
      .sort((a, b) => a.delta - b.delta)[0];
    if (topUp)
      insights.push(
        `${topUp.mood} increased by ${formatPctPoint(topUp.delta)}.`
      );
    if (topDown)
      insights.push(
        `${topDown.mood} decreased by ${formatPctPoint(
          Math.abs(topDown.delta)
        )}.`
      );
  } catch {}

  // Fallback: if nothing generated, include first lines of report text
  if (insights.length === 0 && reportText) {
    const lines = reportText.split("\n").filter((l) => l.trim());
    insights.push(...lines.slice(0, 5));
  }

  return insights;
}
