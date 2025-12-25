#!/usr/bin/env node

// Create Admin User Script
// Run with: node create-admin.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load environment variables from .env if it exists
let SUPABASE_URL = 'https://bdtrxzvoyfhtjbrbaaby.supabase.co';
let SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdHJ4enZveWZodGpicmJhYWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODg5NDMsImV4cCI6MjA4MTM2NDk0M30.q7NzivVH-SCwpLm3rRV5WBKZ8l5piS1GZcEJYXS-cp8';

try {
    const envContent = readFileSync('.env', 'utf8');
    const envLines = envContent.split('\n');
    for (const line of envLines) {
        if (line.startsWith('EXPO_PUBLIC_SUPABASE_URL=')) {
            SUPABASE_URL = line.split('=')[1];
        }
        if (line.startsWith('EXPO_PUBLIC_SUPABASE_ANON_KEY=')) {
            SUPABASE_ANON_KEY = line.split('=')[1];
        }
    }
} catch (error) {
    console.log('⚠️  No .env file found, using default Supabase config');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const createAdminUser = async (adminEmail, adminPassword, adminName) => {
    try {
        console.log('Creating admin user...');

        // Register the admin user with email confirmation disabled for development
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: adminEmail,
            password: adminPassword,
            options: {
                data: {
                    full_name: adminName,
                },
                // Disable email confirmation for development
                emailRedirectTo: undefined,
            },
        });

        if (authError) throw authError;

        // Since this script runs without authentication, we need to use manual SQL
        console.log('Admin user created! Before running the SQL, please:');
        console.log('1. Check your Supabase Auth dashboard to confirm the user exists');
        console.log('2. If needed, confirm the email first');
        console.log('3. Then run this SQL in Supabase SQL Editor:');
        console.log(`
-- Create/update the user profile
INSERT INTO public.users (id, full_name, role)
VALUES ('${authData.user.id}', '${adminName}', 'admin')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

-- Assign admin role
INSERT INTO public.user_roles (user_id, role_id)
SELECT '${authData.user.id}', r.id
FROM public.roles r
WHERE r.role = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;
        `);

        console.log('Admin user created successfully:', authData.user.email);
        console.log('User ID:', authData.user.id);
        console.log('Please check your email to confirm the account.');
        return authData.user;
    } catch (error) {
        console.error('Error creating admin user:', error);
        throw error;
    }
};

console.log('🚀 Creating admin user for Delivery App...\n');

// Admin credentials - CHANGE THESE BEFORE RUNNING!
const adminEmail = 'vitokvachadze@gmail.com'; // Use a different email
const adminPassword = '11111111'; // Use a strong password
const adminName = 'God Mode';

console.log('📧 Email:', adminEmail);
console.log('👤 Name:', adminName);
console.log('⚠️  Password: [HIDDEN] - Make sure to change this!\n');

createAdminUser(adminEmail, adminPassword, adminName)
    .then((user) => {
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', user.email);
        console.log('🆔 User ID:', user.id);
        console.log('\n📝 Next steps:');
        console.log('1. Check your email to confirm the admin account');
        console.log('2. Log in to the app with admin credentials');
        console.log('3. Access admin features');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Failed to create admin user:', error.message);
        console.log('\n💡 If RPC fails, run this SQL manually in Supabase SQL Editor:');
        console.log(`
// Replace USER_ID_HERE with the actual user ID from auth.users
INSERT INTO public.user_roles (user_id, role_id)
SELECT 'USER_ID_HERE', r.id
FROM public.roles r
WHERE r.role = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

UPDATE public.users
SET role = 'admin'
WHERE id = 'USER_ID_HERE';
        `);
        process.exit(1);
    });