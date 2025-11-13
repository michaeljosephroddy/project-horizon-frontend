import React from 'react';
import { Text, View } from 'react-native';
import { componentStyles } from '../styles/componentStyles';
import { SleepMetrics as SleepMetricsType } from '../types/analytics';

interface SleepMetricsProps {
  data: SleepMetricsType;
}

export const SleepMetrics: React.FC<SleepMetricsProps> = ({ data }) => {
  const getStabilityBadge = (stability: string) => {
    let color = '#4CAF50';
    if (stability === 'moderate') color = '#FF9800';
    if (stability === 'unstable') color = '#f44336';

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
      <Text style={componentStyles.cardTitle}>Sleep Metrics</Text>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Avg Sleep Hours:</Text>
        <Text style={componentStyles.value}>{data.avgSleepHours.toFixed(1)}h</Text>
      </View>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Moving Average:</Text>
        <Text style={componentStyles.value}>{data.movingAvg.toFixed(1)}h</Text>
      </View>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Trend:</Text>
        <Text style={componentStyles.value}>{data.sleepTrend}</Text>
      </View>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Stability:</Text>
        {getStabilityBadge(data.stability)}
      </View>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Std Deviation:</Text>
        <Text style={componentStyles.value}>{data.stdDeviation.toFixed(2)}</Text>
      </View>

      <View style={componentStyles.divider} />

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Best Sleep Day:</Text>
        <Text style={[componentStyles.value, { color: '#4CAF50' }]}>
          {data.bestSleepDay}
        </Text>
      </View>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Worst Sleep Day:</Text>
        <Text style={[componentStyles.value, { color: '#f44336' }]}>
          {data.worstSleepDay}
        </Text>
      </View>

      <View style={componentStyles.row}>
        <Text style={componentStyles.label}>Top Quality Tag:</Text>
        <Text style={componentStyles.value}>
          {data.topSleepQualityTag.tagName} ({data.topSleepQualityTag.percentage.toFixed(1)}%)
        </Text>
      </View>
    </View>
  );
};