// components/BurgerMenu.tsx
import React, { useState } from 'react';
import { burgerMenuStyles } from '../styles/burgerMenuStyles';
import {
    View,
    TouchableOpacity,
    Modal,
    Text,
    Easing,
    StyleSheet,
    Pressable,
    Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MenuItem {
    id: string;
    label: string;
    icon: string;
    onPress: () => void;
}

interface BurgerMenuProps {
    menuItems: MenuItem[];
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ menuItems }) => {
    const [visible, setVisible] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const openMenu = () => {
        setVisible(true);
        // Reset animation to 0 before starting
        animation.setValue(0);
        Animated.timing(animation, {
            toValue: 1,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    };

    const closeMenu = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 280,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
        }).start(() => setVisible(false));
    };

    const handleItemPress = (onPress: () => void) => {
        closeMenu();
        // Small delay to let the menu close before navigating
        setTimeout(onPress, 250);
    };

    const menuTranslate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const backdropOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
    });

    return (
        <>
            {/* Burger Icon Button */}
            <TouchableOpacity
                onPress={openMenu}
                style={burgerMenuStyles.burgerButton}
                activeOpacity={0.7}
            >
                <MaterialCommunityIcons name="menu" size={28} color="#007AFF" />
            </TouchableOpacity>

            {/* Menu Modal */}
            <Modal
                visible={visible}
                transparent
                animationType="none"
                onRequestClose={closeMenu}
            >
                {/* Backdrop */}
                <Pressable style={burgerMenuStyles.modalOverlay} onPress={closeMenu}>
                    <Animated.View
                        style={[
                            burgerMenuStyles.backdrop,
                            { opacity: backdropOpacity }
                        ]}
                    />
                </Pressable>

                {/* Menu Content */}
                <Animated.View
                    style={[
                        burgerMenuStyles.menuContainer,
                        {
                            transform: [{ translateX: menuTranslate }]
                        }
                    ]}
                >
                    {/* Menu Header */}
                    <View style={burgerMenuStyles.menuHeader}>
                        <Text style={burgerMenuStyles.menuTitle}>Menu</Text>
                        <TouchableOpacity onPress={closeMenu} style={burgerMenuStyles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* Menu Items */}
                    <View style={burgerMenuStyles.menuItems}>
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={burgerMenuStyles.menuItem}
                                onPress={() => handleItemPress(item.onPress)}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons
                                    name={item.icon as any}
                                    size={24}
                                    color="#007AFF"
                                    style={burgerMenuStyles.menuItemIcon}
                                />
                                <Text style={burgerMenuStyles.menuItemText}>{item.label}</Text>
                                <MaterialCommunityIcons
                                    name="chevron-right"
                                    size={20}
                                    color="#ccc"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>
            </Modal>
        </>
    );
};
