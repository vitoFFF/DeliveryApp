import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, User } from 'lucide-react-native';
import { Text } from 'react-native';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CartScreen } from '../screens/CartScreen';
import { FavouriteScreen } from '../screens/FavouriteScreen';
import { OrderStatusScreen } from '../screens/OrderStatusScreen';
import { HomeNavigator } from './HomeNavigator';
import { CustomTabBar } from '../components/CustomTabBar';
import { theme } from '../utils/theme';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    if (route.name === 'HomeTab') {
                        return <Home size={size} color={color} />;
                    } else if (route.name === 'Favourites') {
                        return <Text style={{ fontSize: size }}>❤️</Text>;
                    } else if (route.name === 'Cart') {
                        return <Text style={{ fontSize: size }}>🛒</Text>;
                    } else if (route.name === 'Orders') {
                        return <Text style={{ fontSize: size }}>🧾</Text>;
                    } else if (route.name === 'Account') {
                        return <User size={size} color={color} />;
                    }
                },
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeNavigator}
                options={{
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen
                name="Favourites"
                component={FavouriteScreen}
                options={{
                    tabBarLabel: 'Favorites',
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    tabBarLabel: 'Cart',
                    isBigButton: true, // Custom prop for big middle button
                }}
            />
            <Tab.Screen
                name="Orders"
                component={OrderStatusScreen}
                options={{
                    tabBarLabel: 'Orders',
                }}
            />
            <Tab.Screen
                name="Account"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Account',
                }}
            />
        </Tab.Navigator>
    );
};
