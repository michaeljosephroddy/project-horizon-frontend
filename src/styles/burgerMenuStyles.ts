import { StyleSheet } from 'react-native';

export const burgerMenuStyles = StyleSheet.create({
    burgerButton: {
        padding: 8,
    },
    modalOverlay: {
        flex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    menuContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 280,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    menuItems: {
        paddingVertical: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    menuItemIcon: {
        marginRight: 16,
    },
    menuItemText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
});
