import React from 'react';
import { Text, View } from 'react-native';
import { componentStyles } from '../styles/componentStyles';
import { MoodMetrics as MoodMetricsType } from '../types/analytics';

interface MoodMetricsProps {
  data: MoodMetricsType;
}

export const MoodMetrics: React.FC<MoodMetricsProps> = ({ data }) => {
  const getTrendColor = (trend: string) => {
    if (trend === 'increasing') return '#4CAF50';
    if (trend === 'decreasing') return '#f44336';
    return '#FF9800';
  };

  const getStabilityBadge = (stability: string) => {
    const color = stability === 'stable' ? '#4CAF50' : '#FF9800';
    return (
      <View style={[componentStyles.badge, { backgroundColor: color + '20' }]}>
        <Text style={[componentStyles.badgeText, { color }]}>
          {stability.toUpperCase()}
        </Text>
      </View>
    );
  };

  return (
    <View style={componentStyles.card}>
      <Text style={componentStyles.cardTitle}>Mood Metrics</Text>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Average Rating:</Text>
        <Text style={componentStyles.value}>{data.avgRating.toFixed(2)}</Text>
      </View>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Moving Average:</Text>
        <Text style={componentStyles.value}>{data.movingAvg.toFixed(2)}</Text>
      </View>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Trend:</Text>
        <Text style={[componentStyles.value, { color: getTrendColor(data.trend) }]}>
          {data.trend}
        </Text>
      </View>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Stability:</Text>
        {getStabilityBadge(data.stability)}
      </View>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Std Deviation:</Text>
        <Text style={componentStyles.value}>{data.stdDeviation.toFixed(2)}</Text>
      </View>

      <Text style={componentStyles.sectionTitle}>Top Tags</Text>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Overall:</Text>
        <Text style={componentStyles.value}>
          {data.topTagOverall.tagName} ({data.topTagOverall.percentage.toFixed(1)}%)
        </Text>
      </View>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Positive Days:</Text>
        <Text style={componentStyles.value}>
          {data.topTagPositiveDays.tagName} ({data.topTagPositiveDays.percentage.toFixed(1)}%)
        </Text>
      </View>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Negative Days:</Text>
        <Text style={componentStyles.value}>
          {data.topTagNegativeDays.tagName} ({data.topTagNegativeDays.percentage.toFixed(1)}%)
        </Text>
      </View>
    </View>
  );
};
