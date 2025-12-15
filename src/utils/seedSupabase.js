import { supabase } from '../config/supabaseConfig';
import { categories, venues, products } from '../data/mockData';

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
