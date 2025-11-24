import 'react-native-gesture-handler';
import './src/i18n'; // Initialize i18n
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { store } from './src/store';
import { theme } from './src/utils/theme';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </PaperProvider>
    </Provider>
  );
}
