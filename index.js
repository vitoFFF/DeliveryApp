import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the native splash screen from hiding immediately at the entry point
SplashScreen.preventAutoHideAsync().catch(() => {
    /* reloading the app might trigger some errors */
});

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
