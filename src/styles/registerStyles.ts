import { StyleSheet } from 'react-native';

export const registerStyles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: '700', marginBottom: 24, color: '#333', textAlign: 'center' },
    input: {
        borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12,
    },
    button: {
        backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12,
    },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    link: { marginTop: 16, color: '#007AFF', textAlign: 'center' },
});
