import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { RestaurantCard } from './RestaurantCard';
import { theme } from '../utils/theme';

export const CategoryResultsView = ({
    category,
    restaurants,
    onClearFilter,
    onRestaurantPress
}) => {
    if (!category) return null;

    return (
        <View style={styles.container}>
            {/* Category Header */}
            <View style={styles.header}>
                <View style={styles.categoryInfo}>
                    <View style={styles.categoryIconContainer}>
                        <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    </View>
                    <View style={styles.categoryTextContainer}>
                        <Text style={styles.categoryName}>{category.name}</Text>
                        <Text style={styles.resultsCount}>
                            {restaurants.length} {restaurants.length === 1 ? 'place' : 'places'} found
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={onClearFilter}
                    activeOpacity={0.7}
                >
                    <X size={20} color={theme.colors.text} />
                    <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
            </View>

            {/* Results */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {restaurants.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateEmoji}>🔍</Text>
                        <Text style={styles.emptyStateTitle}>No places found</Text>
                        <Text style={styles.emptyStateText}>
                            We couldn't find any restaurants in this category
                        </Text>
                        <TouchableOpacity
                            style={styles.browseAllButton}
                            onPress={onClearFilter}
                        >
                            <Text style={styles.browseAllButtonText}>Browse All Categories</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.grid}>
                        {restaurants.map((restaurant, index) => (
                            <View key={restaurant.id} style={styles.gridItem}>
                                <RestaurantCard
                                    restaurant={restaurant}
                                    onPress={() => onRestaurantPress(restaurant)}
                                    isFeatured={index === 0}
                                />
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.m,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        marginHorizontal: theme.spacing.m,
        marginBottom: theme.spacing.m,
        ...theme.shadows.small,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m,
    },
    categoryEmoji: {
        fontSize: 24,
    },
    categoryTextContainer: {
        flex: 1,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 2,
    },
    resultsCount: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: theme.borderRadius.m,
        gap: 4,
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    scrollContent: {
        paddingBottom: theme.spacing.xl * 2,
    },
    grid: {
        paddingHorizontal: theme.spacing.m,
    },
    gridItem: {
        marginBottom: theme.spacing.m,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xxl * 2,
        paddingHorizontal: theme.spacing.l,
    },
    emptyStateEmoji: {
        fontSize: 80,
        marginBottom: theme.spacing.m,
    },
    emptyStateTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    emptyStateText: {
        fontSize: 15,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.l,
        lineHeight: 22,
    },
    browseAllButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.l,
        paddingVertical: 12,
        borderRadius: theme.borderRadius.m,
        ...theme.shadows.small,
    },
    browseAllButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
