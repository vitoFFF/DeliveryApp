import { ref, set } from 'firebase/database';
import { database } from '../config/firebaseConfig';
import { categories, venues, products } from '../data/mockData';

export const seedDatabase = async () => {
    try {
        console.log('Starting database seed...');

        // Transform arrays to properly keyed objects
        // This ensures Firebase stores data with string keys (cat_restaurant, ven_mcdonalds, etc.)
        // instead of numeric keys (0, 1, 2...)
        const categoriesObject = categories.reduce((acc, cat) => ({
            ...acc,
            [cat.id]: cat
        }), {});

        const venuesObject = venues.reduce((acc, venue) => ({
            ...acc,
            [venue.id]: venue
        }), {});

        const productsObject = products.reduce((acc, prod) => ({
            ...acc,
            [prod.id]: prod
        }), {});

        // Seed Categories
        const categoriesRef = ref(database, 'deliveryApp/categories');
        await set(categoriesRef, categoriesObject);
        console.log('Categories seeded successfully');

        // Seed Venues
        const venuesRef = ref(database, 'deliveryApp/venues');
        await set(venuesRef, venuesObject);
        console.log('Venues seeded successfully');

        // Seed Products
        const productsRef = ref(database, 'deliveryApp/products');
        await set(productsRef, productsObject);
        console.log('Products seeded successfully');

        console.log('Database seeding completed!');
        return true;
    } catch (error) {
        console.error('Error seeding database:', error);
        return false;
    }
};
