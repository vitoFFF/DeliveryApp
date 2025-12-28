import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View } from 'react-native';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { AdminNavigator } from './AdminNavigator';
import { MainNavigator } from './MainNavigator';
import DriverNavigator from './DriverNavigator';
import SupportScreen from '../screens/SupportScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrderStatusScreen } from '../screens/OrderStatusScreen';
import { checkOnboarding } from '../store/appSlice';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { isAuthenticated, isLoading, role } = useSelector((state) => state.auth);
    const { hasSeenOnboarding, isOnboardingLoading } = useSelector((state) => state.app);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkOnboarding());
    }, [dispatch]);

    if (isLoading || isOnboardingLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const renderNavigator = () => {
        switch (role) {
            case 'admin':
                return (
                    <Stack.Screen
                        name="AdminPanel"
                        component={AdminNavigator}
                        options={{ headerShown: false }}
                    />
                );
            case 'driver':
                return (
                    <Stack.Screen
                        name="DriverPanel"
                        component={DriverNavigator}
                        options={{ headerShown: false }}
                    />
                );
            default:
                return (
                    <>
                        <Stack.Screen
                            name="Main"
                            component={MainNavigator}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Checkout"
                            component={CheckoutScreen}
                            options={{ title: 'Checkout' }}
                        />
                        <Stack.Screen
                            name="OrderStatus"
                            component={OrderStatusScreen}
                            options={{ title: 'Order Status', headerLeft: null }}
                        />
                        <Stack.Screen
                            name="Support"
                            component={SupportScreen}
                            options={{ title: 'Support' }}
                        />
                    </>
                );
        }
    };

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ animation: 'fade' }}>
                {!hasSeenOnboarding ? (
                    <Stack.Screen
                        name="Onboarding"
                        component={OnboardingScreen}
                        options={{ headerShown: false }}
                    />
                ) : !isAuthenticated ? (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    renderNavigator()
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
