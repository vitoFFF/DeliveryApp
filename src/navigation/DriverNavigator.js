import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverDashboardScreen from '../screens/admin/DriverDashboardScreen';

const Stack = createNativeStackNavigator();

const DriverNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="DriverDashboard"
                component={DriverDashboardScreen}
                options={{ title: 'Driver Dashboard' }}
            />
        </Stack.Navigator>
    );
};

export default DriverNavigator;