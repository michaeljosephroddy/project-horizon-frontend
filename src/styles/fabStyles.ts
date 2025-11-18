// styles/dashboardStyles.ts
import { StyleSheet } from 'react-native';

export const fabStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 24,
        right: 24,
    },
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
});
