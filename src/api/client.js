import { users, restaurants, menuItems } from '../data/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    login: async (email, password) => {
        await delay(1000);
        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
            return { success: true, user };
        }
        throw new Error('Invalid credentials');
    },

    getRestaurants: async () => {
        await delay(800);
        return restaurants;
    },

    getMenu: async (restaurantId) => {
        await delay(500);
        return menuItems.filter((item) => item.restaurantId === restaurantId);
    },

    placeOrder: async (order) => {
        await delay(1500);
        return { success: true, orderId: Math.random().toString(36).substr(2, 9) };
    },
};
