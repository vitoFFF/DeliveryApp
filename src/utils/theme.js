import { DefaultTheme } from 'react-native-paper';

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#FF6347', // Tomato red for delivery app
        primaryLight: '#FF7F66',
        primaryDark: '#E5502E',
        accent: '#FFD700',
        accentLight: '#FFE44D',
        background: '#F5F5F5',
        backgroundDark: '#E8E8E8',
        text: '#333333',
        textSecondary: '#757575',
        textLight: '#999999',
        surface: '#FFFFFF',
        border: '#E0E0E0',
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336',
        // Gradient colors
        gradientStart: '#FF6347',
        gradientEnd: '#FFD700',
        // Glassmorphism
        glass: 'rgba(255, 255, 255, 0.9)',
        glassBorder: 'rgba(255, 255, 255, 0.3)',
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        xs: 4,
        s: 8,
        m: 12,
        l: 16,
        xl: 24,
        full: 9999,
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
        },
    },
};
