import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { theme } from '../utils/theme';

const CategoryItem = ({ category, isSelected, onPress, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 50, // Staggered delay
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                delay: index * 50,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
            speed: 30,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 30,
        }).start();
    };

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                ],
            }}
        >
            <TouchableOpacity
                style={[
                    styles.categoryCard,
                    isSelected && styles.categoryCardActive,
                ]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
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
        </Animated.View>
    );
};

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
                        {chunk.map((category, itemIndex) => {
                            const isSelected = selectedCategory === category.id || (category.id === 'all' && selectedCategory === 'All');
                            const globalIndex = chunkIndex * 2 + itemIndex;
                            return (
                                <CategoryItem
                                    key={category.id}
                                    category={category}
                                    isSelected={isSelected}
                                    onPress={() => onSelectCategory(category.id)}
                                    index={globalIndex}
                                />
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
        marginBottom: 8, // Reduced since parent has gap
    },
    header: {
        paddingHorizontal: theme.spacing.m,
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
    },
    scrollContent: {
        paddingHorizontal: 12,
    },
    column: {
        marginRight: 8,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: 10,
        borderRadius: 16,
        marginBottom: 8,
        width: 150,
        height: 60,
        borderWidth: 2,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    categoryCardActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
        transform: [{ scale: 1.02 }],
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    iconContainerActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    emoji: {
        fontSize: 22,
    },
    categoryName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.text,
    },
    categoryNameActive: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
});
