import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseConfig';
import { products as mockProducts } from '../data/mockData';

/**
 * Custom hook to fetch data from Supabase
 * @returns {Object} { categories, venues, products, loading, error }
 */
export const useFirebaseData = () => {
    const [categories, setCategories] = useState([]);
    const [venues, setVenues] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [catRes, venRes, prodRes] = await Promise.all([
                    supabase.from('categories').select('*').order('name'),
                    supabase.from('venues').select('*').order('name'),
                    supabase.from('products').select('*').order('name')
                ]);

                if (catRes.error) throw catRes.error;
                if (venRes.error) throw venRes.error;
                if (prodRes.error) throw prodRes.error;

                // Transform Venues: Ensure categories array is correct
                // Supabase might return it as a string if text[], but JS client handles array types usually.
                // However, our SQL defined it as TEXT[], so it should be fine.
                // Just in case, we map to ensure structure consistency if needed.
                const formattedVenues = venRes.data.map(v => ({
                    ...v,
                    categoryId: v.category_id, // Map snake_case to camelCase specific for app usage if needed
                    deliveryTime: v.delivery_time,
                    priceRange: v.price_range
                }));

                const formattedProducts = prodRes.data.map(p => ({
                    ...p,
                    restaurantId: p.restaurant_id // Map snake_case to camelCase
                }));

                setCategories(catRes.data);
                setVenues(formattedVenues);
                setProducts(formattedProducts);
            } catch (err) {
                console.error('Data Fetch Error:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        categories,
        venues,
        products,
        loading,
        error
    };
};

/**
 * Custom hook to get products for a specific venue
 * @param {string} venueId - The ID of the venue
 * @returns {Object} { products, loading, error }
 */
export const useVenueProducts = (venueId) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!venueId) {
            setProducts([]);
            setLoading(false);
            return;
        }

        // Simulate network delay
        const timer = setTimeout(() => {
            const venueProducts = mockProducts.filter(p => p.restaurantId === venueId);
            setProducts(venueProducts);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [venueId]);

    return {
        products,
        loading,
        error
    };
};
