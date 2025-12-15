import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View } from 'react-native';
import { LoginScreen } from '../screens/LoginScreen';
import { AdminNavigator } from './AdminNavigator';
import { RegisterScreen } from '../screens/RegisterScreen';
import { MainNavigator } from './MainNavigator';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrderStatusScreen } from '../screens/OrderStatusScreen';
import { checkAuth } from '../store/authSlice';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
    const { isAuthenticated, isLoading, isAdmin } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {!isAuthenticated ? (
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
                ) : isAdmin ? (
                    <Stack.Screen
                        name="AdminPanel"
                        component={AdminNavigator}
                        options={{ headerShown: false }}
                    />
                ) : (
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
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer >
    );
};
