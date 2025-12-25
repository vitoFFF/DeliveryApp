import { supabase } from '../config/supabaseConfig';
import { categories, venues, products } from '../data/mockData';

export const createAdminUser = async (adminEmail, adminPassword, adminName) => {
    try {
        console.log('Creating admin user...');

        // Register the admin user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: adminEmail,
            password: adminPassword,
            options: {
                data: {
                    full_name: adminName,
                },
            },
        });

        if (authError) throw authError;

        // Wait a moment for the trigger to create the user profile
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create a service client for admin operations (if you have service role key)
        // For now, we'll try the RPC function, and if that fails, provide manual SQL

        try {
            // Try using the database function
            const { error: roleError } = await supabase.rpc('assign_role_to_user', {
                p_user_id: authData.user.id,
                p_role: 'admin'
            });

            if (roleError) throw roleError;

            console.log('Admin role assigned successfully using RPC function');
        } catch (rpcError) {
            console.log('RPC function failed, you may need to run this SQL manually in Supabase:');
            console.log(`
INSERT INTO public.user_roles (user_id, role_id)
SELECT '${authData.user.id}', r.id
FROM public.roles r
WHERE r.role = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

UPDATE public.users
SET role = 'admin'
WHERE id = '${authData.user.id}';
            `);
        }

        console.log('Admin user created successfully:', authData.user.email);
        console.log('User ID:', authData.user.id);
        console.log('Please check your email to confirm the account.');
        return authData.user;
    } catch (error) {
        console.error('Error creating admin user:', error);
        throw error;
    }
};

export const seedSupabase = async () => {
    try {
        console.log('Starting migration to Supabase...');

        // Debug: Check Auth State
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current User ID:', user ? user.id : 'No User (Anonymous)');

        if (!user) {
            throw new Error('User not logged in. Please Log Out and Log In again to refresh session.');
        }

        // 1. Seed Categories
        console.log('Seeding Categories...');
        const { error: catError } = await supabase
            .from('categories')
            .upsert(
                categories.map(c => ({
                    id: c.id,
                    name: c.name,
                    icon: c.icon,
                    emoji: c.emoji
                })),
                { onConflict: 'id' }
            );

        if (catError) throw new Error(`Category Error: ${catError.message}`);

        // 2. Seed Venues
        console.log('Seeding Venues...');
        const { error: venError } = await supabase
            .from('venues')
            .upsert(
                venues.map(v => ({
                    id: v.id,
                    category_id: v.categoryId,
                    name: v.name,
                    rating: v.rating,
                    delivery_time: v.deliveryTime,
                    image: v.image,
                    price_range: v.priceRange,
                    categories: v.categories
                })),
                { onConflict: 'id' }
            );

        if (venError) throw new Error(`Venue Error: ${venError.message}`);

        // 3. Seed Products
        console.log('Seeding Products...');
        const { error: prodError } = await supabase
            .from('products')
            .upsert(
                products.map(p => ({
                    id: p.id,
                    restaurant_id: p.restaurantId, // mapped from restaurantId
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    image: p.image
                })),
                { onConflict: 'id' }
            );

        if (prodError) throw new Error(`Product Error: ${prodError.message}`);

        console.log('Migration Completed Successfully!');
        return true;

    } catch (error) {
        console.error('Migration Failed:', error);
        return false;
    }
};
