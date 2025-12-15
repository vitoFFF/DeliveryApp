import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await SecureStore.setItemAsync('userToken', user.accessToken);
            const userObj = { uid: user.uid, email: user.email, displayName: user.displayName };
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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profile with name
            await updateProfile(user, {
                displayName: name
            });

            await SecureStore.setItemAsync('userToken', user.accessToken);

            // Return a serializable user object with the updated display name
            return { uid: user.uid, email: user.email, displayName: name };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await SecureStore.deleteItemAsync('userToken');
    await AsyncStorage.removeItem('user');
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
    const token = await SecureStore.getItemAsync('userToken');
    const userStr = await AsyncStorage.getItem('user');
    if (token && userStr) {
        const user = JSON.parse(userStr);
        return { isAuthenticated: true, user };
    }
    return { isAuthenticated: false };
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
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
                // Simple check for admin email - in production use Custom Claims or Database
                const email = action.payload.email.toLowerCase();
                state.isAdmin = email === 'admin@deliveryapp.com' || email === 'boss@gmail.com';
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
                    const email = action.payload.user.email.toLowerCase();
                    state.isAdmin = email === 'admin@deliveryapp.com' || email === 'boss@gmail.com';
                }
            });
    },
});

export default authSlice.reducer;
