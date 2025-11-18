import { StyleSheet } from 'react-native';

export const componentStyles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        marginTop: 16,
        marginBottom: 8,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    medicationItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 6,
        padding: 12,
        marginBottom: 12,
    },
    medicationName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 12,
    },
});
