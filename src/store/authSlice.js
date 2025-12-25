import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storage } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabaseConfig';

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

            // Fetch user role from public.users table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id);

            if (userError) {
                console.error('Error fetching user role:', userError);
            }

            const role = (userData && userData.length > 0) ? userData[0].role : 'user';

            await storage.setItemAsync('userToken', data.session.access_token);

            const userObj = {
                uid: user.id,
                email: user.email,
                displayName: user.user_metadata?.full_name || user.email,
                role: role
            };
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

            if (data.session) {
                await storage.setItemAsync('userToken', data.session.access_token);
            }

            // Note: User profile should be created by database trigger
            // If trigger fails, the profile might not exist, but auth succeeded

            return { uid: user.id, email: user.email, displayName: name, role: 'user' };
        } catch (error) {
            // Handle user already exists error
            if (error.message.includes('already exists') || error.message.includes('User already registered')) {
                return rejectWithValue('User with this email already exists.');
            }
            return rejectWithValue(error.message);
        }
    }
);


export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await supabase.auth.signOut();
    await storage.deleteItemAsync('userToken');
    await AsyncStorage.removeItem('user');
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session && session.user) {
        await storage.setItemAsync('userToken', session.access_token);
        
        // Fetch user role from public.users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id);
        
        if (userError) {
             console.error('Error fetching user role:', userError);
        }

        const role = (userData && userData.length > 0) ? userData[0].role : 'user';

        const userObj = {
            uid: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name,
            role: role
        };
        await AsyncStorage.setItem('user', JSON.stringify(userObj));
        return { isAuthenticated: true, user: userObj };
    }

    const token = await storage.getItemAsync('userToken');
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
        isAuthenticated: false,
        role: null,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.role = action.payload.role;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.role = action.payload.role;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload.isAuthenticated;
                if (action.payload.isAuthenticated && action.payload.user) {
                    state.user = action.payload.user;
                    state.role = action.payload.user.role;
                } else {
                    state.user = null;
                    state.role = null;
                }
            });
    },
});

export default authSlice.reducer;
