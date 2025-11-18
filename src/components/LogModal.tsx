// components/LogModal.tsx
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { logModalStyles } from '../styles/logModalStyles';
import { logService } from '../services/logService';
import { MoodTagSelector } from './MoodTagSelector';

interface LogModalProps {
    visible: boolean;
    onClose: () => void;
    onLogCreated: () => void;
}

export const LogModal: React.FC<LogModalProps> = ({ visible, onClose, onLogCreated }) => {
    const { user } = useAuth();
    const [selectedType, setSelectedType] = useState<'mood' | 'sleep' | 'medication' | null>(null);
    const [loading, setLoading] = useState(false);

    // Mood state
    const [moodRating, setMoodRating] = useState(5);
    const [moodNote, setMoodNote] = useState('');
    const [selectedMoodTagIds, setSelectedMoodTagIds] = useState<number[]>([]);

    // Sleep state
    const [sleepHours, setSleepHours] = useState('8');
    const [sleepQuality, setSleepQuality] = useState(1); // 1=Poor, 2=Fair, 3=Good, 4=Excellent
    const [sleepNote, setSleepNote] = useState('');
    const [sleepDate] = useState(new Date().toISOString().split('T')[0]);

    // Medication state
    const [medicationNote, setMedicationNote] = useState('');
    const [medicationTime] = useState(new Date().toISOString());

    const handleMoodTagToggle = (tagId: number) => {
        setSelectedMoodTagIds((prev) => {
            if (prev.includes(tagId)) {
                return prev.filter((id) => id !== tagId);
            } else {
                return [...prev, tagId];
            }
        });
    };

    const resetForm = () => {
        setSelectedType(null);
        setMoodRating(5);
        setMoodNote('');
        setSelectedMoodTagIds([]);
        setSleepHours('8');
        setSleepQuality(3);
        setSleepNote('');
        setMedicationNote('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        if (!selectedType) { 
            return; 
        }

        setLoading(true);

        try {
            const userId = user?.userId!;

            switch (selectedType) {
                case 'mood':
                    await logService.createMoodLog({
                        userId: userId,
                        moodRating: moodRating,
                        note: moodNote,
                        moodTagIds: selectedMoodTagIds,
                    });
                    Alert.alert('Success', 'Mood log saved successfully!');
                    break;

                case 'sleep':
                    await logService.createSleepLog({
                        userId: userId,
                        hoursSlept: parseFloat(sleepHours),
                        sleepQualityTagIds: sleepQuality,
                        note: sleepNote,
                        sleepDate: sleepDate,
                    });
                    Alert.alert('Success', 'Sleep log saved successfully!');
                    break;

                case 'medication':
                    await logService.createMedicationLog({
                        userId: userId,
                        takenAt: medicationTime,
                        note: medicationNote,
                    });
                    Alert.alert('Success', 'Medication log saved successfully!');
                    break;
            }

            onLogCreated();
            handleClose();
        } catch (error) {
            Alert.alert('Error', 'Failed to save log. Please try again.');
            console.error('Log submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderTypeSelection = () => (
        <View style={logModalStyles.typeSelection}>
            <Text style={logModalStyles.modalTitle}>What would you like to log?</Text>

            <TouchableOpacity
                style={[logModalStyles.typeButton, selectedType === 'mood' && logModalStyles.typeButtonSelected]}
                onPress={() => setSelectedType('mood')}
            >
                <MaterialCommunityIcons name="emoticon-happy-outline" size={32} color={selectedType === 'mood' ? '#fff' : '#007AFF'} />
                <Text style={[logModalStyles.typeButtonText, selectedType === 'mood' && logModalStyles.typeButtonTextSelected]}>
                    Mood
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[logModalStyles.typeButton, selectedType === 'sleep' && logModalStyles.typeButtonSelected]}
                onPress={() => setSelectedType('sleep')}
            >
                <MaterialCommunityIcons name="sleep" size={32} color={selectedType === 'sleep' ? '#fff' : '#9C27B0'} />
                <Text style={[logModalStyles.typeButtonText, selectedType === 'sleep' && logModalStyles.typeButtonTextSelected]}>
                    Sleep
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[logModalStyles.typeButton, selectedType === 'medication' && logModalStyles.typeButtonSelected]}
                onPress={() => setSelectedType('medication')}
            >
                <MaterialCommunityIcons name="pill" size={32} color={selectedType === 'medication' ? '#fff' : '#4CAF50'} />
                <Text style={[logModalStyles.typeButtonText, selectedType === 'medication' && logModalStyles.typeButtonTextSelected]}>
                    Medication
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderMoodForm = () => (
        <View style={logModalStyles.formContainer}>
            <Text style={logModalStyles.formTitle}>How are you feeling?</Text>

            <View style={logModalStyles.ratingContainer}>
                <Text style={logModalStyles.ratingLabel}>Mood Rating: {moodRating}/10</Text>
                <View style={logModalStyles.ratingButtons}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <TouchableOpacity
                            key={num}
                            style={[
                                logModalStyles.ratingButton,
                                moodRating === num && logModalStyles.ratingButtonSelected,
                            ]}
                            onPress={() => setMoodRating(num)}
                        >
                            <Text style={[
                                logModalStyles.ratingButtonText,
                                moodRating === num && logModalStyles.ratingButtonTextSelected,
                            ]}>
                                {num}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Mood Tags Section */}
            <View style={logModalStyles.moodTagsSection}>
                <Text style={logModalStyles.sectionTitle}>
                    Select mood tags {selectedMoodTagIds.length > 0 && `(${selectedMoodTagIds.length} selected)`}
                </Text>
                <MoodTagSelector
                    selectedTagIds={selectedMoodTagIds}
                    onTagToggle={handleMoodTagToggle}
                />
            </View>

            <TextInput
                style={logModalStyles.textInput}
                placeholder="Add a note (optional)"
                value={moodNote}
                onChangeText={setMoodNote}
                multiline
                numberOfLines={3}
            />
        </View>
    );

    const renderSleepForm = () => (
        <View style={logModalStyles.formContainer}>
            <Text style={logModalStyles.formTitle}>How did you sleep?</Text>

            <View style={logModalStyles.inputGroup}>
                <Text style={logModalStyles.inputLabel}>Hours Slept</Text>
                <TextInput
                    style={logModalStyles.numberInput}
                    placeholder="8.0"
                    value={sleepHours}
                    onChangeText={setSleepHours}
                    keyboardType="numeric"
                />
            </View>

            <View style={logModalStyles.inputGroup}>
                <Text style={logModalStyles.inputLabel}>Sleep Quality</Text>
                <View style={logModalStyles.qualityButtons}>
                    {[
                        { id: 1, label: 'Poor', icon: '😴' },
                        { id: 2, label: 'Fair', icon: '😐' },
                        { id: 3, label: 'Good', icon: '😊' },
                        { id: 4, label: 'Excellent', icon: '🤩' },
                    ].map((quality) => (
                        <TouchableOpacity
                            key={quality.id}
                            style={[
                                logModalStyles.qualityButton,
                                sleepQuality === quality.id && logModalStyles.qualityButtonSelected,
                            ]}
                            onPress={() => setSleepQuality(quality.id)}
                        >
                            <Text style={logModalStyles.qualityIcon}>{quality.icon}</Text>
                            <Text style={[
                                logModalStyles.qualityText,
                                sleepQuality === quality.id && logModalStyles.qualityTextSelected,
                            ]}>
                                {quality.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TextInput
                style={logModalStyles.textInput}
                placeholder="Add notes (optional)"
                value={sleepNote}
                onChangeText={setSleepNote}
                multiline
                numberOfLines={3}
            />
        </View>
    );

    const renderMedicationForm = () => (
        <View style={logModalStyles.formContainer}>
            <Text style={logModalStyles.formTitle}>Medication Intake</Text>

            <View style={logModalStyles.medicationInfo}>
                <MaterialCommunityIcons name="check-circle" size={48} color="#4CAF50" />
                <Text style={logModalStyles.medicationText}>
                    Recording medication taken at {new Date().toLocaleTimeString()}
                </Text>
            </View>

            <TextInput
                style={logModalStyles.textInput}
                placeholder="Add notes (optional) - e.g., side effects, dosage changes"
                value={medicationNote}
                onChangeText={setMedicationNote}
                multiline
                numberOfLines={3}
            />
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={logModalStyles.modalOverlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={logModalStyles.modalContent}>
                    <View style={logModalStyles.modalHeader}>
                        <TouchableOpacity onPress={handleClose}>
                            <MaterialCommunityIcons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={logModalStyles.modalHeaderTitle}>Add Log</Text>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={!selectedType || loading}
                        >
                            <Text style={[
                                logModalStyles.saveButton,
                                (!selectedType || loading) && logModalStyles.saveButtonDisabled,
                            ]}>
                                {loading ? 'Saving...' : 'Save'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {!selectedType && renderTypeSelection()}
                        {selectedType === 'mood' && renderMoodForm()}
                        {selectedType === 'sleep' && renderSleepForm()}
                        {selectedType === 'medication' && renderMedicationForm()}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
