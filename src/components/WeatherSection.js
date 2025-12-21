import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { theme } from '../utils/theme';
import { getWeatherData } from '../api/weatherService';

// Mock food suggestions for the weather
// TODO: Replace with AI-driven recommendations based on weather
const WEATHER_FOODS = [
    {
        id: '1',
        name: 'Spicy Ramen',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
        time: '25 min',
    },
    {
        id: '2',
        name: 'Hot Chocolate',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',
        time: '15 min',
    },
    {
        id: '3',
        name: 'Tomato Soup',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
        time: '30 min',
    },
    {
        id: '4',
        name: 'Pho Bo',
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80',
        time: '35 min',
    },
];

export const WeatherSection = ({ onFoodPress }) => {
    const [weather, setWeather] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            setIsLoading(true);
            const data = await getWeatherData();
            setWeather(data);
            setIsLoading(false);
        };

        fetchWeather();
    }, []);

    // Show loading state
    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={[styles.weatherInfo, styles.loadingContainer]}>
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Getting weather...</Text>
                    </View>
                </View>
            </View>
        );
    }

    // Show weather data (or fallback if error)
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.weatherInfo}>
                    <Text style={styles.weatherIcon}>{weather?.icon || '🌡️'}</Text>
                    <View>
                        <Text style={styles.conditionText}>
                            {weather?.condition || 'Weather'} • {weather?.temp || '--°C'}
                        </Text>
                        <Text style={styles.messageText}>{weather?.message || 'Food For Any Weather'}</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            >
                {WEATHER_FOODS.map((food) => (
                    <TouchableOpacity
                        key={food.id}
                        style={styles.card}
                        onPress={() => onFoodPress && onFoodPress(food)}
                    >
                        <Image source={{ uri: food.image }} style={styles.image} />
                        <View style={styles.cardOverlay}>
                            <Text style={styles.foodName}>{food.name}</Text>
                            <Text style={styles.foodTime}>{food.time}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    weatherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: 12,
        borderRadius: 16,
        ...theme.shadows.small,
    },
    loadingContainer: {
        justifyContent: 'center',
        gap: 8,
    },
    loadingText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    weatherIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    conditionText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    messageText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    listContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    card: {
        width: 140,
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
        ...theme.shadows.small,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    foodName: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2,
    },
    foodTime: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
});
