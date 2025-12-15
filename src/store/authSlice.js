import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabaseConfig';

// Helper to check admin status
const isUserAdmin = (email) => {
    if (!email) return false;
    const normalizedEmail = email.toLowerCase();
    return [
        'vitokvachadze@gmail.com',
        'admin@deliveryapp.com',
        'boss@gmail.com'
    ].includes(normalizedEmail);
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            const user = data.user;
            // Persist token manually to maintain compatibility with existing logic
            await SecureStore.setItemAsync('userToken', data.session.access_token);

            const userObj = { uid: user.id, email: user.email, displayName: user.user_metadata?.full_name || user.email };
            await AsyncStorage.setItem('user', JSON.stringify(userObj));
            return userObj;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ email, password, name }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (error) throw error;

            const user = data.user;

            // If email confirmation is enabled, session might be null immediately
            if (data.session) {
                await SecureStore.setItemAsync('userToken', data.session.access_token);
            }

            // Return a serializable user object
            return { uid: user.id, email: user.email, displayName: name };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await supabase.auth.signOut();
    await SecureStore.deleteItemAsync('userToken');
    await AsyncStorage.removeItem('user');
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
    // Check Supabase session first
    const { data: { session } } = await supabase.auth.getSession();

    if (session && session.user) {
        // Refresh our local storage to match valid session
        await SecureStore.setItemAsync('userToken', session.access_token);
        const userObj = {
            uid: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name
        };
        await AsyncStorage.setItem('user', JSON.stringify(userObj));
        return { isAuthenticated: true, user: userObj };
    }

    // Fallback to local storage check if network fails or session missing but token exists (rare with Supabase)
    const token = await SecureStore.getItemAsync('userToken');
    const userStr = await AsyncStorage.getItem('user');

    if (token && userStr) {
        // We could verify the token here with supabase.auth.getUser(token) but start with simple check
        const user = JSON.parse(userStr);
        return { isAuthenticated: true, user };
    }

    return { isAuthenticated: false };
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.isAdmin = isUserAdmin(action.payload.email);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.isAdmin = isUserAdmin(action.payload.email);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isAdmin = false;
            })
            // Check Auth
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload.isAuthenticated;
                if (action.payload.isAuthenticated && action.payload.user) {
                    state.user = action.payload.user;
                    state.isAdmin = isUserAdmin(action.payload.user.email);
                }
            });
    },
});

export default authSlice.reducer;
