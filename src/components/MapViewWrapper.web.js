import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WebFallback = ({ style, children }) => (
    <View style={[styles.fallback, style]}>
        <Text style={styles.fallbackText}>Maps are not available on web preview</Text>
        <View style={StyleSheet.absoluteFill}>
            {children}
        </View>
    </View>
);

const styles = StyleSheet.create({
    fallback: {
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    fallbackText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        padding: 20,
        zIndex: 10,
    }
});

export default WebFallback;
export const Marker = View;
export const Polyline = View;
export const Callout = View;
export const PROVIDER_GOOGLE = 'google';
