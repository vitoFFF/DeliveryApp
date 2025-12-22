import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AIHubScreen } from '../screens/AIHubScreen';
import AIChatScreen from '../screens/AIChatScreen';

const Stack = createNativeStackNavigator();

export const AINavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AIHubHome"
                component={AIHubScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AIChat"
                component={AIChatScreen}
                options={{ title: 'AI Chat' }}
            />
        </Stack.Navigator>
    );
};
