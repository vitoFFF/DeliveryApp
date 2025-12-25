import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminCategoriesScreen } from '../screens/admin/AdminCategoriesScreen';
import { AdminVenuesScreen } from '../screens/admin/AdminVenuesScreen';
import { AdminProductsScreen } from '../screens/admin/AdminProductsScreen';
import { AdminDriversScreen } from '../screens/admin/AdminDriversScreen';
import { AdminAddDriverScreen } from '../screens/admin/AdminAddDriverScreen';
import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator();

export const AdminNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboardScreen}
                options={{ title: 'Admin Console' }}
            />
            <Stack.Screen
                name="AdminCategories"
                component={AdminCategoriesScreen}
                options={{ title: 'Manage Categories' }}
            />
            <Stack.Screen
                name="AdminVenues"
                component={AdminVenuesScreen}
                options={{ title: 'Manage Venues' }}
            />
            <Stack.Screen
                name="AdminProducts"
                component={AdminProductsScreen}
                options={{ title: 'Manage Products' }}
            />
            <Stack.Screen
                name="AdminDrivers"
                component={AdminDriversScreen}
                options={{ title: 'Manage Drivers' }}
            />
            <Stack.Screen
                name="AdminAddDriver"
                component={AdminAddDriverScreen}
                options={{ title: 'Add Driver' }}
            />
        </Stack.Navigator>
    );
};
