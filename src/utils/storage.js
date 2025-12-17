import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

/**
 * Platform-agnostic storage utility.
 * Uses ExpoSecureStore on native platforms and AsyncStorage on web.
 */
export const storage = {
    /**
     * Store a value.
     * @param {string} key 
     * @param {string} value 
     */
    setItemAsync: async (key, value) => {
        if (isWeb) {
            return await AsyncStorage.setItem(key, value);
        } else {
            return await SecureStore.setItemAsync(key, value);
        }
    },

    /**
     * Retrieve a value.
     * @param {string} key 
     * @returns {Promise<string|null>}
     */
    getItemAsync: async (key) => {
        if (isWeb) {
            return await AsyncStorage.getItem(key);
        } else {
            return await SecureStore.getItemAsync(key);
        }
    },

    /**
     * Delete a value.
     * @param {string} key 
     */
    deleteItemAsync: async (key) => {
        if (isWeb) {
            return await AsyncStorage.removeItem(key);
        } else {
            return await SecureStore.deleteItemAsync(key);
        }
    }
};
