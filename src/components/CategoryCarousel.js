import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { theme } from '../utils/theme';

const CategoryItem = ({ category, isSelected, onPress, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(30);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 50,
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
    }, [index, fadeAnim, slideAnim]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.92,
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
            >
                {categories.map((category, index) => {
                    const isSelected = selectedCategory === category.id || (category.id === 'all' && selectedCategory === 'All');
                    return (
                        <CategoryItem
                            key={category.id}
                            category={category}
                            isSelected={isSelected}
                            onPress={() => onSelectCategory(category.id)}
                            index={index}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    header: {
        paddingHorizontal: theme.spacing.m,
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
        letterSpacing: -0.3,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.m,
    },
    categoryCard: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: theme.borderRadius.l,
        minWidth: 90,
        marginRight: 10,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        ...theme.shadows.small,
    },
    categoryCardActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.full,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconContainerActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    emoji: {
        fontSize: 24,
    },
    categoryName: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.text,
        textAlign: 'center',
    },
    categoryNameActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
});

