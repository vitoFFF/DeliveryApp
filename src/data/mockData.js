export const categories = [
    { id: 'cat_restaurant', name: 'Restaurant', icon: 'utensils', emoji: '🍽️' },
    { id: 'cat_supermarket', name: 'Supermarket', icon: 'cart-shopping', emoji: '🛒' },
    { id: 'cat_pharmacy', name: 'Pharmacy', icon: 'prescription-bottle-medical', emoji: '💊' },
    { id: 'cat_electronics', name: 'Electronics', icon: 'laptop', emoji: '💻' },
    { id: 'cat_bakery', name: 'Bakery', icon: 'bread-slice', emoji: '🥐' },
    { id: 'cat_petshop', name: 'Pet Shop', icon: 'paw', emoji: '🐾' },
];

export const venues = [
    // Restaurants
    {
        id: 'ven_mcdonalds',
        categoryId: 'cat_restaurant',
        name: "McDonald's",
        rating: 4.5,
        deliveryTime: '25-35 min',
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&q=80', // Burger/Fast food
        categories: ['Fast Food', 'Burgers'],
        priceRange: '$$',
    },
    {
        id: 'ven_kfc',
        categoryId: 'cat_restaurant',
        name: 'KFC',
        rating: 4.3,
        deliveryTime: '30-40 min',
        image: 'https://images.unsplash.com/photo-1513639776629-9269d0d905dd?w=800&q=80', // Fried chicken
        categories: ['Fast Food', 'Chicken'],
        priceRange: '$$',
    },
    {
        id: 'ven_burgerking',
        categoryId: 'cat_restaurant',
        name: 'Burger King',
        rating: 4.4,
        deliveryTime: '25-35 min',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80', // Burger
        categories: ['Fast Food', 'Burgers'],
        priceRange: '$$',
    },

    // Supermarkets
    {
        id: 'ven_carrefour',
        categoryId: 'cat_supermarket',
        name: 'Carrefour',
        rating: 4.6,
        deliveryTime: '30-50 min',
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80', // Supermarket aisle
        categories: ['Groceries', 'Fresh'],
        priceRange: '$$',
    },
    {
        id: 'ven_spar',
        categoryId: 'cat_supermarket',
        name: 'Spar',
        rating: 4.2,
        deliveryTime: '20-40 min',
        image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80', // Grocery store
        categories: ['Groceries', 'Bakery'],
        priceRange: '$$',
    },
    {
        id: 'ven_localmarket',
        categoryId: 'cat_supermarket',
        name: 'Local Market',
        rating: 4.8,
        deliveryTime: '15-30 min',
        image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80', // Fresh produce
        categories: ['Organic', 'Vegetables'],
        priceRange: '$',
    },

    // Pharmacies
    {
        id: 'ven_psp',
        categoryId: 'cat_pharmacy',
        name: 'PSP',
        rating: 4.7,
        deliveryTime: '20-30 min',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80', // Pharmacy
        categories: ['Medicine', 'Personal Care'],
        priceRange: '$$',
    },
    {
        id: 'ven_aversi',
        categoryId: 'cat_pharmacy',
        name: 'Aversi',
        rating: 4.6,
        deliveryTime: '20-30 min',
        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80', // Pharmacy shelves
        categories: ['Medicine', 'Baby Care'],
        priceRange: '$$',
    },
    {
        id: 'ven_gpc',
        categoryId: 'cat_pharmacy',
        name: 'GPC',
        rating: 4.5,
        deliveryTime: '25-35 min',
        image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80', // Pharmacy counter
        categories: ['Medicine', 'Beauty'],
        priceRange: '$$',
    },

    // Electronics
    {
        id: 'ven_zoommer',
        categoryId: 'cat_electronics',
        name: 'Zoommer',
        rating: 4.8,
        deliveryTime: '40-60 min',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80', // Electronics store
        categories: ['Gadgets', 'Phones'],
        priceRange: '$$$',
    },
    {
        id: 'ven_alta',
        categoryId: 'cat_electronics',
        name: 'Alta',
        rating: 4.7,
        deliveryTime: '45-60 min',
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80', // Computer store
        categories: ['Appliances', 'Computers'],
        priceRange: '$$$',
    },

    // Bakery
    {
        id: 'ven_entree',
        categoryId: 'cat_bakery',
        name: 'Entree',
        rating: 4.9,
        deliveryTime: '20-35 min',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', // Bakery
        categories: ['Pastries', 'Bread'],
        priceRange: '$$',
    },

    // Pet Shop
    {
        id: 'ven_zoomart',
        categoryId: 'cat_petshop',
        name: 'Zoomart',
        rating: 4.8,
        deliveryTime: '30-45 min',
        image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80', // Pet shop
        categories: ['Pet Food', 'Toys'],
        priceRange: '$$',
    },
];

export const products = [
    // McDonald's
    {
        id: 'prod_bigmac',
        restaurantId: 'ven_mcdonalds',
        name: 'Big Mac',
        description: 'Two 100% beef patties, a slice of cheese, lettuce, onion and pickles.',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    },
    {
        id: 'prod_fries',
        restaurantId: 'ven_mcdonalds',
        name: 'French Fries',
        description: 'Golden, crispy and salty.',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd75ec?w=500',
    },
    {
        id: 'prod_mcchicken',
        restaurantId: 'ven_mcdonalds',
        name: 'McChicken',
        description: 'Crispy chicken sandwich with lettuce and mayo.',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1615557960916-5f4791effe9d?w=500',
    },

    // Burger King
    {
        id: 'prod_whopper',
        restaurantId: 'ven_burgerking',
        name: 'Whopper',
        description: 'Flame-grilled beef patty with juicy tomatoes, fresh lettuce, creamy mayo, ketchup, crunchy pickles, and sliced white onions.',
        price: 6.49,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500',
    },
    {
        id: 'prod_bk_fries',
        restaurantId: 'ven_burgerking',
        name: 'BK Fries',
        description: 'Premium cut, golden brown and crunchy.',
        price: 2.49,
        image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd75ec?w=500',
    },

    // Carrefour
    {
        id: 'prod_milk',
        restaurantId: 'ven_carrefour',
        name: 'Fresh Milk (1L)',
        description: 'Pasteurized whole milk.',
        price: 1.50,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500',
    },
    {
        id: 'prod_bread',
        restaurantId: 'ven_carrefour',
        name: 'Baguette',
        description: 'Freshly baked french bread.',
        price: 1.00,
        image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500',
    },
    {
        id: 'prod_eggs',
        restaurantId: 'ven_carrefour',
        name: 'Eggs (10pcs)',
        description: 'Free-range chicken eggs.',
        price: 3.50,
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500',
    },

    // Aversi
    {
        id: 'prod_vitamins',
        restaurantId: 'ven_aversi',
        name: 'Multivitamins',
        description: 'Daily supplement for immune support.',
        price: 15.00,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
    },
    {
        id: 'prod_paracetamol',
        restaurantId: 'ven_aversi',
        name: 'Paracetamol',
        description: 'Pain reliever and fever reducer.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500',
    },
    {
        id: 'prod_toothpaste',
        restaurantId: 'ven_aversi',
        name: 'Whitening Toothpaste',
        description: 'For a brighter smile.',
        price: 4.00,
        image: 'https://images.unsplash.com/photo-1559586616-361e18714958?w=500',
    },

    // Zoommer
    {
        id: 'prod_iphone',
        restaurantId: 'ven_zoommer',
        name: 'iPhone 15',
        description: 'Latest Apple smartphone.',
        price: 999.00,
        image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500',
    },
    {
        id: 'prod_airpods',
        restaurantId: 'ven_zoommer',
        name: 'AirPods Pro',
        description: 'Wireless noise-cancelling headphones.',
        price: 249.00,
        image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500',
    },

    // Entree
    {
        id: 'prod_croissant',
        restaurantId: 'ven_entree',
        name: 'Butter Croissant',
        description: 'Flaky and buttery french pastry.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500',
    },
];

export const users = [
    {
        id: '1',
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
        biometricEnabled: false,
    },
];

// Backward compatibility exports (if needed)
export const restaurants = venues;
export const menuItems = products;

export const specialOffers = [
    { ...venues[0], discount: '20% OFF' }, // McDonald's
    { ...venues[3], discount: 'Free Delivery' }, // Carrefour
    { ...venues[6], discount: '15% OFF' }, // PSP
];

export const popularNow = [
    venues[0], // McDonald's
    venues[3], // Carrefour
    venues[9], // Zoommer
];

export const popularDrinks = [
    products.find(i => i.id === 'prod_milk'),
    products.find(i => i.id === 'prod_bigmac'), // Just filling spots
    products.find(i => i.id === 'prod_vitamins'),
];




