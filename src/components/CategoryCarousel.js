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
            style={[
                styles.categoryItemWrapper,
                {
                    opacity: fadeAnim,
                    transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim }
                    ],
                }
            ]}
        >
            <TouchableOpacity
                style={styles.categoryCard}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.7}
            >
                <View style={[
                    styles.circleContainer,
                    isSelected && styles.circleContainerActive
                ]}>
                    <Text style={styles.emoji}>{category.emoji}</Text>
                </View>
                <Text style={[
                    styles.categoryName,
                    isSelected && styles.categoryNameActive
                ]} numberOfLines={2}>
                    {category.name}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

export const CategoryCarousel = ({ categories, selectedCategory, onSelectCategory, onSeeMore }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Categories</Text>
                {onSeeMore && (
                    <TouchableOpacity onPress={onSeeMore} style={styles.seeMoreButton}>
                        <Text style={styles.seeMoreText}>See More</Text>
                    </TouchableOpacity>
                )}
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

            {/* Creative Dashed Line Separator */}
            <View style={styles.separatorContainer}>
                <View style={styles.dashedLine} />
                <View style={styles.centerDot} />
                <View style={styles.dashedLine} />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.m,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
        letterSpacing: -0.3,
    },
    seeMoreButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    seeMoreText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.m,
        paddingBottom: 8,
    },
    categoryItemWrapper: {
        marginRight: 16,
        alignItems: 'center',
    },
    categoryCard: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        marginBottom: 8,
        ...theme.shadows.small,
    },
    circleContainerActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    emoji: {
        fontSize: 32,
    },
    categoryName: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text,
        textAlign: 'center',
        maxWidth: 70,
    },
    categoryNameActive: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    // Dashed Line Separator Styles
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 12,
        paddingHorizontal: theme.spacing.m,
    },
    dashedLine: {
        flex: 1,
        height: 1,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 1,
    },
    centerDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.primary,
        marginHorizontal: 12,
    },
});


