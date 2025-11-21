import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { RestaurantDetailScreen } from '../screens/RestaurantDetailScreen';

const Stack = createNativeStackNavigator();

export const HomeNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="RestaurantList"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RestaurantDetail"
                component={RestaurantDetailScreen}
                options={{ title: 'Menu' }}
            />
        </Stack.Navigator>
    );
};
