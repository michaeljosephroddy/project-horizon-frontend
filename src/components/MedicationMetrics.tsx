import React from 'react';
import { Text, View } from 'react-native';
import { componentStyles } from '../styles/componentStyles';
import { MedicationMetrics as MedicationMetricsType } from '../types/analytics';

interface MedicationMetricsProps {
    data: MedicationMetricsType;
}

export const MedicationMetrics: React.FC<MedicationMetricsProps> = ({ data }) => {
    const getAdherenceBadge = (rate: number) => {
        let color = '#4CAF50';
        if (rate < 80) {
            color = '#f44336';
        }
        else if (rate < 95) {
            color = '#FF9800';
        }

        return (
            <View style={[componentStyles.badge, { backgroundColor: color + '20' }]}>
                <Text style={[componentStyles.badgeText, { color }]}>
                    {rate}%
                </Text>
            </View>
        );
    };

    return (
        <View style={componentStyles.card}>
            <Text style={componentStyles.cardTitle}>Medication Metrics</Text>

            <View style={componentStyles.row}>
                <Text style={componentStyles.label}>Adherence Rate:</Text>
                {getAdherenceBadge(data.adherenceRate)}
            </View>

            <Text style={componentStyles.sectionTitle}>Medications</Text>

            {data.medicationStats.map((med) => (
                <View key={med.medicationId} style={componentStyles.medicationItem}>
                    <Text style={componentStyles.medicationName}>{med.name}</Text>

                    <View style={componentStyles.row}>
                        <Text style={componentStyles.label}>Total Doses:</Text>
                        <Text style={componentStyles.value}>{med.totalDoses}</Text>
                    </View>

                    <View style={componentStyles.row}>
                        <Text style={componentStyles.label}>Days Active:</Text>
                        <Text style={componentStyles.value}>{med.daysActive}</Text>
                    </View>

                    <View style={componentStyles.row}>
                        <Text style={componentStyles.label}>Avg Doses/Day:</Text>
                        <Text style={componentStyles.value}>{med.avgDosesPerDay.toFixed(1)}</Text>
                    </View>

                    <View style={componentStyles.row}>
                        <Text style={componentStyles.label}>Timing:</Text>
                        <Text style={componentStyles.value}>{med.timingDescription}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};
