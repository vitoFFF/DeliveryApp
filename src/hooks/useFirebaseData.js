import { useState, useEffect } from 'react';
import { database } from '../config/firebaseConfig';
import { ref, onValue, off } from 'firebase/database';

/**
 * Custom hook to fetch data from Firebase Realtime Database
 * @returns {Object} { categories, venues, products, loading, error }
 */
export const useFirebaseData = () => {
    const [categories, setCategories] = useState([]);
    const [venues, setVenues] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // References to Firebase database paths
        const categoriesRef = ref(database, 'deliveryApp/categories');
        const venuesRef = ref(database, 'deliveryApp/venues');
        const productsRef = ref(database, 'deliveryApp/products');

        let categoriesLoaded = false;
        let venuesLoaded = false;
        let productsLoaded = false;

        const checkAllLoaded = () => {
            if (categoriesLoaded && venuesLoaded && productsLoaded) {
                setLoading(false);
            }
        };

        // Listen to categories
        const unsubscribeCategories = onValue(categoriesRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Convert object to array
                    const categoriesArray = Object.values(data);
                    setCategories(categoriesArray);
                } else {
                    setCategories([]);
                }
                categoriesLoaded = true;
                checkAllLoaded();
            },
            (error) => {
                console.error('Error fetching categories:', error);
                setError(error.message);
                categoriesLoaded = true;
                checkAllLoaded();
            }
        );

        // Listen to venues
        const unsubscribeVenues = onValue(venuesRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Convert object to array
                    const venuesArray = Object.values(data);
                    setVenues(venuesArray);
                } else {
                    setVenues([]);
                }
                venuesLoaded = true;
                checkAllLoaded();
            },
            (error) => {
                console.error('Error fetching venues:', error);
                setError(error.message);
                venuesLoaded = true;
                checkAllLoaded();
            }
        );

        // Listen to products
        const unsubscribeProducts = onValue(productsRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Convert object to array
                    const productsArray = Object.values(data);
                    setProducts(productsArray);
                } else {
                    setProducts([]);
                }
                productsLoaded = true;
                checkAllLoaded();
            },
            (error) => {
                console.error('Error fetching products:', error);
                setError(error.message);
                productsLoaded = true;
                checkAllLoaded();
            }
        );

        // Cleanup listeners on unmount
        return () => {
            unsubscribeCategories();
            unsubscribeVenues();
            unsubscribeProducts();
        };
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

        const productsRef = ref(database, 'deliveryApp/products');

        const unsubscribe = onValue(productsRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Filter products for this venue
                    const venueProducts = Object.values(data).filter(
                        product => product.restaurantId === venueId
                    );
                    setProducts(venueProducts);
                } else {
                    setProducts([]);
                }
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching venue products:', error);
                setError(error.message);
                setLoading(false);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [venueId]);

    return {
        products,
        loading,
        error
    };
};
