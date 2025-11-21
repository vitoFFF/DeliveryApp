// Debug script to inspect Firebase data structure
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

// Import Firebase config - update the path if needed
const firebaseConfig = require('./src/config/firebaseConfig');

// Initialize Firebase
const app = initializeApp(firebaseConfig.default || firebaseConfig);
const database = getDatabase(app);

async function inspectData() {
    try {
        console.log('=== Fetching Categories ===');
        const categoriesRef = ref(database, 'deliveryApp/categories');
        const categoriesSnapshot = await get(categoriesRef);
        const categories = categoriesSnapshot.val();

        if (categories) {
            console.log('\nCategories in database:');
            Object.entries(categories).forEach(([key, category]) => {
                console.log(`- ID: ${category.id}, Name: ${category.name}`);
            });
        } else {
            console.log('No categories found');
        }

        console.log('\n=== Fetching Venues ===');
        const venuesRef = ref(database, 'deliveryApp/venues');
        const venuesSnapshot = await get(venuesRef);
        const venues = venuesSnapshot.val();

        if (venues) {
            console.log('\nFirst 3 venues with their categories:');
            Object.entries(venues).slice(0, 3).forEach(([key, venue]) => {
                console.log(`\nVenue: ${venue.name}`);
                console.log(`  Categories field type: ${typeof venue.categories}`);
                console.log(`  Categories value:`, venue.categories);
                if (Array.isArray(venue.categories)) {
                    console.log(`  Is Array: true`);
                    console.log(`  Categories:`, venue.categories.join(', '));
                }
            });
        } else {
            console.log('No venues found');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error inspecting data:', error);
        process.exit(1);
    }
}

inspectData();
