import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ShoppingBag, User } from 'lucide-react-native';
import { Text } from 'react-native';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CartScreen } from '../screens/CartScreen';
import { FavouriteScreen } from '../screens/FavouriteScreen';
import { AIChatScreen } from '../screens/AIChatScreen';
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
                    } else if (route.name === 'Favourite') {
                        return <Text style={{ fontSize: size }}>🧡</Text>;
                    } else if (route.name === 'AIChat') {
                        return <Text style={{ fontSize: size }}>🔴</Text>;
                    } else if (route.name === 'Cart') {
                        return <Text style={{ fontSize: size }}>🛒</Text>;
                    } else if (route.name === 'Profile') {
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
                name="Favourite"
                component={FavouriteScreen}
                options={{
                    tabBarLabel: 'Favourite',
                }}
            />
            <Tab.Screen
                name="AIChat"
                component={AIChatScreen}
                options={{
                    tabBarLabel: 'AI Chat',
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    tabBarLabel: 'Cart',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                }}
            />
        </Tab.Navigator>
    );
};
