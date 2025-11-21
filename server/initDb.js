const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Import mock data (we need to adjust the import since mockData is in src/data)
// Since we are running this with node, we can't use ES6 import directly without type module or babel
// So we will manually copy the data structure here for simplicity and robustness of the seed script
// or we could require it if we convert mockData to CommonJS. 
// For this task, I'll inline the data to avoid module issues, as it's a one-time seed.

const categories = [
    { id: '2', name: 'Pizza', icon: 'pizza-slice', emoji: '🍕' },
    { id: '3', name: 'Sushi', icon: 'fish', emoji: '🍣' },
    { id: '5', name: 'Dessert', icon: 'ice-cream', emoji: '🍦' },
    { id: 'drinks_combined', name: 'Drinks & Tea', icon: 'glass-water', emoji: '🍹' },
    { id: '8', name: 'Supermarkets', icon: 'cart-shopping', emoji: '🛒' },
    { id: '11', name: 'Restaurants', icon: 'utensils', emoji: '🍽️' },
];

const restaurants = [
    {
        id: '1',
        name: 'Burger King',
        rating: 4.5,
        deliveryTime: '25-35 min',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
        categories: ['American'],
        priceRange: '$$',
    },
    {
        id: '2',
        name: 'Sushi Master',
        rating: 4.8,
        deliveryTime: '40-50 min',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
        categories: ['Sushi', 'Japanese'],
        priceRange: '$$$',
    },
    {
        id: '3',
        name: 'Pizza Hut',
        rating: 4.2,
        deliveryTime: '30-40 min',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80',
        categories: ['Pizza', 'Italian'],
        priceRange: '$$',
    },
    {
        id: '4',
        name: 'Green Bowl',
        rating: 4.6,
        deliveryTime: '20-30 min',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        categories: ['Healthy', 'Salad'],
        priceRange: '$$',
    },
    {
        id: '5',
        name: 'Pirosmani',
        rating: 4.7,
        deliveryTime: '30-45 min',
        image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&q=80',
        categories: ['Restaurants', 'Georgian'],
        priceRange: '$$',
    },
    {
        id: '6',
        name: 'Tonusi',
        rating: 4.5,
        deliveryTime: '25-40 min',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
        categories: ['Restaurants', 'BBQ'],
        priceRange: '$$',
    },
    {
        id: '8',
        name: 'Ethno Guria',
        rating: 4.9,
        deliveryTime: '40-55 min',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        categories: ['Restaurants', 'Georgian'],
        priceRange: '$$$',
    },
    {
        id: '9',
        name: 'Kalakuri',
        rating: 4.6,
        deliveryTime: '30-45 min',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
        categories: ['Restaurants', 'Georgian'],
        priceRange: '$$',
    },
    {
        id: '11',
        name: 'Taba Tea House',
        rating: 4.9,
        deliveryTime: '15-25 min',
        image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/6d/be/a1/caption.jpg?w=900&h=-1&s=1',
        categories: ['Drinks & Tea'],
        priceRange: '$$',
        website: 'https://tabatea.ge/',
    },
    {
        id: '12',
        name: 'Alcorium',
        rating: 4.8,
        deliveryTime: '20-35 min',
        image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
        categories: ['Drinks & Tea'],
        priceRange: '$$$',
    },
    {
        id: '13',
        name: 'Wine House',
        rating: 4.6,
        deliveryTime: '25-40 min',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
        categories: ['Drinks & Tea'],
        priceRange: '$$',
    },
    {
        id: '15',
        name: 'Nikora',
        rating: 4.5,
        deliveryTime: '20-35 min',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
        categories: ['Supermarkets', 'Groceries'],
        priceRange: '$',
    },
    {
        id: '16',
        name: 'Libre',
        rating: 4.3,
        deliveryTime: '25-40 min',
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80',
        categories: ['Supermarkets', 'Groceries'],
        priceRange: '$',
    },
    {
        id: '17',
        name: 'Daily',
        rating: 4.4,
        deliveryTime: '20-35 min',
        image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&q=80',
        categories: ['Supermarkets', 'Groceries'],
        priceRange: '$',
    },
    {
        id: '18',
        name: 'Magniti',
        rating: 4.2,
        deliveryTime: '25-40 min',
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80',
        categories: ['Supermarkets', 'Groceries'],
        priceRange: '$',
    },
    {
        id: '21',
        name: 'Terrace Pub',
        rating: 4.5,
        deliveryTime: '20-40 min',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
        categories: ['Dessert', 'Drinks & Tea'],
        priceRange: '$$',
        website: 'https://www.facebook.com/profile.php?id=61553474553001',
    },
    {
        id: '22',
        name: 'Coffee In',
        rating: 4.6,
        deliveryTime: '15-30 min',
        image: 'https://madloba.info/media/images/Coffee_In_Ozurgeti.max-1920x1080.format-webp.mwtmk.webp',
        categories: ['Dessert', 'Coffee'],
        priceRange: '$',
        website: 'https://www.facebook.com/CoffeeInOzurgeti/',
    },
];

const menuItems = [
    { id: 'bk1', restaurantId: '1', name: 'Whopper Meal', description: 'Flame-grilled beef patty...', price: 9.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
    { id: 'bk2', restaurantId: '1', name: 'Chicken Royale', description: 'Crispy chicken breast...', price: 7.49, image: 'https://images.unsplash.com/photo-1615557960916-5f4791effe9d?w=500' },
    { id: 'sm1', restaurantId: '2', name: 'Philadelphia Roll', description: 'Salmon, cream cheese...', price: 12.50, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd43ca?w=500' },
    { id: 'sm2', restaurantId: '2', name: 'Spicy Tuna Roll', description: 'Fresh tuna, spicy mayo...', price: 10.99, image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500' },
    { id: 'ph1', restaurantId: '3', name: 'Pepperoni Feast', description: 'Double pepperoni...', price: 14.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500' },
    { id: 'gb1', restaurantId: '4', name: 'Quinoa Power Bowl', description: 'Quinoa, avocado...', price: 11.50, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500' },
    { id: 'pr1', restaurantId: '5', name: 'Khinkali (5 pcs)', description: 'Traditional Georgian dumplings...', price: 8.00, image: 'https://images.unsplash.com/photo-1643320337638-928320f7007e?w=500' },
    { id: 'pr2', restaurantId: '5', name: 'Adjaruli Khachapuri', description: 'Cheese-filled bread boat...', price: 10.50, image: 'https://images.unsplash.com/photo-1631302367872-08e6a9bdd643?w=500' },
    { id: 'tt1', restaurantId: '11', name: 'Gurian Black Tea', description: 'Premium loose leaf black tea...', price: 15.00, image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=500' },
    { id: 'tt2', restaurantId: '11', name: 'Wild Berry Infusion', description: 'A blend of wild berries...', price: 12.00, image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500' },
    { id: 'al1', restaurantId: '12', name: 'Saperavi 2019', description: 'Dry red wine...', price: 25.00, image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=500' },
    { id: 'al2', restaurantId: '12', name: 'Rkatsiteli Amber', description: 'Traditional amber wine...', price: 22.00, image: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=500' },
    { id: 'nk1', restaurantId: '15', name: 'Fresh Milk (1L)', description: 'Pasteurized whole milk.', price: 1.50, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500' },
    { id: 'nk2', restaurantId: '15', name: 'Georgian Bread (Shotis Puri)', description: 'Freshly baked traditional bread.', price: 0.80, image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500' },
    { id: 'fm1', restaurantId: '19', name: 'Fresh Tomatoes (1kg)', description: 'Locally grown, organic tomatoes.', price: 2.00, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500' },
    { id: 'fm2', restaurantId: '19', name: 'Homemade Cheese (Imeruli)', description: 'Fresh cow milk cheese...', price: 6.50, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500' },
];

const dbPath = path.resolve(__dirname, 'delivery.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Create Categories Table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT,
        icon TEXT,
        emoji TEXT
    )`);

    // Create Venues Table
    db.run(`CREATE TABLE IF NOT EXISTS venues (
        id TEXT PRIMARY KEY,
        name TEXT,
        rating REAL,
        deliveryTime TEXT,
        image TEXT,
        categories TEXT,
        priceRange TEXT,
        website TEXT
    )`);

    // Create Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        venueId TEXT,
        name TEXT,
        description TEXT,
        price REAL,
        image TEXT,
        FOREIGN KEY(venueId) REFERENCES venues(id)
    )`);

    // Seed Data
    const insertCategory = db.prepare('INSERT OR REPLACE INTO categories (id, name, icon, emoji) VALUES (?, ?, ?, ?)');
    categories.forEach(cat => {
        insertCategory.run(cat.id, cat.name, cat.icon, cat.emoji);
    });
    insertCategory.finalize();

    const insertVenue = db.prepare('INSERT OR REPLACE INTO venues (id, name, rating, deliveryTime, image, categories, priceRange, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    restaurants.forEach(venue => {
        insertVenue.run(venue.id, venue.name, venue.rating, venue.deliveryTime, venue.image, JSON.stringify(venue.categories), venue.priceRange, venue.website || null);
    });
    insertVenue.finalize();

    const insertProduct = db.prepare('INSERT OR REPLACE INTO products (id, venueId, name, description, price, image) VALUES (?, ?, ?, ?, ?, ?)');
    menuItems.forEach(item => {
        insertProduct.run(item.id, item.restaurantId, item.name, item.description, item.price, item.image);
    });
    insertProduct.finalize();

    console.log('Database initialized and seeded successfully.');
});

db.close();
