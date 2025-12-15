
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'https://bdtrxzvoyfhtjbrbaaby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdHJ4enZveWZodGpicmJhYWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODg5NDMsImV4cCI6MjA4MTM2NDk0M30.q7NzivVH-SCwpLm3rRV5WBKZ8l5piS1GZcEJYXS-cp8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
