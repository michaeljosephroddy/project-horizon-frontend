import AsyncStorage from '@react-native-async-storage/async-storage';

export const authStorage = {
    getToken: async () => {
        return AsyncStorage.getItem('authToken');
    },
    getUser: async () => {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    setCredentials: async (token: string, user: any) => {
        await AsyncStorage.multiSet([
            ['authToken', token],
            ['user', JSON.stringify(user)],
        ]);
    },
    clear: async () => {
        await AsyncStorage.multiRemove(['authToken', 'user']);
    },
};
