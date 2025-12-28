import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkOnboarding = createAsyncThunk(
    'app/checkOnboarding',
    async () => {
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        return value === 'true';
    }
);

export const setOnboardingSeen = createAsyncThunk(
    'app/setOnboardingSeen',
    async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        return true;
    }
);

const appSlice = createSlice({
    name: 'app',
    initialState: {
        hasSeenOnboarding: false,
        isOnboardingLoading: true,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkOnboarding.pending, (state) => {
                state.isOnboardingLoading = true;
            })
            .addCase(checkOnboarding.fulfilled, (state, action) => {
                state.hasSeenOnboarding = action.payload;
                state.isOnboardingLoading = false;
            })
            .addCase(setOnboardingSeen.fulfilled, (state) => {
                state.hasSeenOnboarding = true;
            });
    },
});

export default appSlice.reducer;
