import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { theme } from '../utils/theme';

export const CategoryCarousel = ({ categories, selectedCategory, onSelectCategory }) => {
    // Group categories into pairs for 2-row layout
    const chunkedCategories = React.useMemo(() => {
        const chunks = [];
        for (let i = 0; i < categories.length; i += 2) {
            chunks.push(categories.slice(i, i + 2));
        }
        return chunks;
    }, [categories]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Browse by Category</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={160} // Card width + margin
            >
                {chunkedCategories.map((chunk, chunkIndex) => (
                    <View key={chunkIndex} style={styles.column}>
                        {chunk.map((category) => {
                            const isSelected = selectedCategory === category.id || (category.id === 'all' && selectedCategory === 'All');
                            return (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        styles.categoryCard,
                                        isSelected && styles.categoryCardActive,
                                    ]}
                                    onPress={() => onSelectCategory(category.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[
                                        styles.iconContainer,
                                        isSelected && styles.iconContainerActive
                                    ]}>
                                        <Text style={styles.emoji}>{category.emoji}</Text>
                                    </View>
                                    <Text style={[
                                        styles.categoryName,
                                        isSelected && styles.categoryNameActive
                                    ]}>
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.l,
    },
    header: {
        paddingHorizontal: theme.spacing.m,
        marginBottom: theme.spacing.m,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.s,
    },
    column: {
        marginRight: theme.spacing.s,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.s,
        borderRadius: theme.borderRadius.l,
        marginBottom: theme.spacing.s,
        width: 150,
        height: 60,
        ...theme.shadows.small,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    categoryCardActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        ...theme.shadows.medium,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.s,
    },
    iconContainerActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    emoji: {
        fontSize: 20,
    },
    categoryName: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        flex: 1,
    },
    categoryNameActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
