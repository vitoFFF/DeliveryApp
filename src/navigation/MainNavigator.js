import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, User } from 'lucide-react-native';
import { Text, Image } from 'react-native';
import { ProfileScreen } from '../screens/ProfileScreen';
import FavouriteScreen from '../screens/FavouriteScreen';
import { CartScreen } from '../screens/CartScreen';
import { AINavigator } from './AINavigator';
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
                        return <Image source={require('../../assets/favorite.png')} style={{ width: 30, height: 30 | "" }} />;

                        // return <Text style={{ fontSize: size }}>💔</Text>;
                    } else if (route.name === 'AIHub') {
                        return <Image source={require('../../assets/infinity.png')} style={{ width: size, height: size }} />;
                    } else if (route.name === 'Cart') {
                        return <Text style={{ fontSize: 26 }}>🛒</Text>;
                    } else if (route.name === 'Account') {
                        // return <User size={size} color={color} />;
                        return <Image source={require('../../assets/user.png')} style={{ width: 30, height: 30 }} />;
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
                name="AIHub"
                component={AINavigator}
                options={{
                    tabBarLabel: 'AI Hub',
                    isBigButton: true, // Custom prop for big middle button
                    tabBarButtonColor: '#dcd7d2a9', // Indigo (modern AI theme)
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
                name="Account"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Account',
                }}
            />
        </Tab.Navigator>
    );
};
