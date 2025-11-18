// styles/dashboardStyles.ts
import { StyleSheet } from 'react-native';

export const logModalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalHeaderTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    saveButton: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    saveButtonDisabled: {
        color: '#ccc',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    typeSelection: {
        padding: 20,
    },
    typeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    typeButtonSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    typeButtonText: {
        fontSize: 18,
        marginLeft: 16,
        color: '#333',
    },
    typeButtonTextSelected: {
        color: '#fff',
    },
    formContainer: {
        padding: 20,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    ratingContainer: {
        marginBottom: 10,
    },
    ratingLabel: {
        fontSize: 16,
        marginBottom: 12,
        color: '#666',
    },
    ratingButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    ratingButton: {
        width: '18%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 8,
    },
    ratingButtonSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    ratingButtonText: {
        fontSize: 16,
        color: '#333',
    },
    ratingButtonTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    moodEmoji: {
        fontSize: 48,
        textAlign: 'center',
        marginTop: 16,
    },
    // Add mood tags section styles
    moodTagsSection: {
        marginTop: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#666',
    },
    numberInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    qualityButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    qualityButton: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        marginHorizontal: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    qualityButtonSelected: {
        backgroundColor: '#9C27B0',
        borderColor: '#9C27B0',
    },
    qualityIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    qualityText: {
        fontSize: 12,
        color: '#666',
    },
    qualityTextSelected: {
        color: '#fff',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    medicationInfo: {
        alignItems: 'center',
        marginVertical: 20,
    },
    medicationText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
        textAlign: 'center',
    },
});
