import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { RestaurantCard } from './RestaurantCard';
import { theme } from '../utils/theme';

export const RestaurantList = ({ restaurants, onRestaurantPress, markFirstAsFeatured = false }) => {
    if (restaurants.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Popular Near You</Text>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateIcon}>🔍</Text>
                    <Text style={styles.emptyStateText}>No venues found</Text>
                    <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Popular Near You</Text>
            {restaurants.map((restaurant, index) => (
                <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onPress={() => onRestaurantPress(restaurant)}
                    isFeatured={markFirstAsFeatured && index === 0}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.m,
        paddingBottom: theme.spacing.xl,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
        marginBottom: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xxl,
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: theme.spacing.m,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
});
