import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types/user';

const USER_PROFILE_KEY = '@user_profile';

export const UserService = {
    async saveProfile(profile: UserProfile): Promise<void> {
        try {
            const jsonValue = JSON.stringify(profile);
            await AsyncStorage.setItem(USER_PROFILE_KEY, jsonValue);
        } catch (e) {
            console.error('Error saving user profile:', e);
        }
    },

    async getProfile(): Promise<UserProfile | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(USER_PROFILE_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Error getting user profile:', e);
            return null;
        }
    },

    async clearProfile(): Promise<void> {
        try {
            await AsyncStorage.removeItem(USER_PROFILE_KEY);
        } catch (e) {
            console.error('Error clearing user profile:', e);
        }
    }
};
