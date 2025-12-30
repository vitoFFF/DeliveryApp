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
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                setIsOffline(false);

                const [catRes, venRes, prodRes] = await Promise.all([
                    supabase.from('categories').select('*').order('name'),
                    supabase.from('venues').select('*').order('name'),
                    supabase.from('products').select('*').order('name')
                ]);

                if (catRes.error) throw catRes.error;
                if (venRes.error) throw venRes.error;
                if (prodRes.error) throw prodRes.error;

                const formattedVenues = venRes.data.map(v => ({
                    ...v,
                    categoryId: v.category_id,
                    deliveryTime: v.delivery_time,
                    priceRange: v.price_range
                }));

                const formattedProducts = prodRes.data.map(p => ({
                    ...p,
                    restaurantId: p.restaurant_id
                }));

                setCategories(catRes.data);
                setVenues(formattedVenues);
                setProducts(formattedProducts);
            } catch (err) {
                console.warn('Network request failed, falling back to mock data:', err.message);

                // Fallback to mock data
                // Note: mockProducts is already imported as products in this file
                // We need to import the rest of mock data
                const { categories: mockCategories, venues: mockVenues, products: mockProductsData } = require('../data/mockData');

                setCategories(mockCategories);
                setVenues(mockVenues);
                setProducts(mockProductsData);
                setIsOffline(true);
                // Clear error since we've fallen back successfully
                setError(null);
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
        error,
        isOffline
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
