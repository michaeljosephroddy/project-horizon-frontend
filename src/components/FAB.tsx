// components/FAB.tsx
import React, { useRef, useEffect } from 'react';
import {
    TouchableOpacity,
    Animated,
} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { fabStyles } from '../styles/fabStyles';

interface FABProps {
    onPress: () => void;
}

export const FAB: React.FC<FABProps> = ({ onPress }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entry animation
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 3,
            useNativeDriver: true,
        }).start();
    }, []);

    const handlePress = () => {
        // Rotate animation on press
        Animated.sequence([
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();

        onPress();
    };

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
    });

    return (
        <Animated.View
            style={[
                fabStyles.container,
                {
                    transform: [
                        { scale: scaleAnim },
                        { rotate: spin }
                    ]
                }
            ]}
        >
            <TouchableOpacity
                style={fabStyles.button}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="plus" size={28} color="#fff" />
            </TouchableOpacity>
        </Animated.View>
    );
};
