import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await SecureStore.setItemAsync('userToken', user.accessToken);
            // Return a serializable user object
            return { uid: user.uid, email: user.email, displayName: user.displayName };
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
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
        // In a real app, validate token or fetch user profile
        // For now, we assume the token is valid if it exists
        return { isAuthenticated: true };
    }
    return { isAuthenticated: false };
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
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
            })
            // Check Auth
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload.isAuthenticated;
                // User profile would be fetched separately or on login
            });
    },
});

export default authSlice.reducer;
