import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [], // { menuItem, quantity, restaurantId }
        restaurantId: null, // Can only order from one restaurant at a time
    },
    reducers: {
        addToCart: (state, action) => {
            const { menuItem, restaurantId } = action.payload;

            // If adding from a different restaurant, clear cart
            if (state.restaurantId && state.restaurantId !== restaurantId) {
                state.items = [];
                state.restaurantId = restaurantId;
            } else {
                state.restaurantId = restaurantId;
            }

            const existingItem = state.items.find((i) => i.menuItem.id === menuItem.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ menuItem, quantity: 1 });
            }
        },
        removeFromCart: (state, action) => {
            const { menuItemId } = action.payload;
            const existingItem = state.items.find((i) => i.menuItem.id === menuItemId);
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                } else {
                    state.items = state.items.filter((i) => i.menuItem.id !== menuItemId);
                }
            }
            if (state.items.length === 0) {
                state.restaurantId = null;
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.restaurantId = null;
        },
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
    state.cart.items.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
export const selectCartCount = (state) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0);
