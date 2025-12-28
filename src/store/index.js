import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import appReducer from './appSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        app: appReducer,
    },
});
