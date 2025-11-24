import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Star, Clock } from 'lucide-react-native';
import { theme } from '../utils/theme';

export const RestaurantCard = ({ restaurant, onPress, isFeatured = false }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shadowAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.97,
                useNativeDriver: true,
                speed: 30,
                bounciness: 4,
            }),
            Animated.timing(shadowAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                speed: 30,
                bounciness: 4,
            }),
            Animated.timing(shadowAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const elevation = shadowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [3, 8],
    });

    const shadowOpacity = shadowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.1, 0.25],
    });

    return (
        <Animated.View
            style={[
                styles.cardWrapper,
                {
                    // Non-native animations (shadow/elevation)
                    elevation,
                    shadowOpacity,
                },
            ]}
        >
            <Animated.View
                style={{
                    // Native animations (transform)
                    transform: [{ scale: scaleAnim }],
                }}
            >
                <TouchableOpacity
                    style={[
                        styles.card,
                        isFeatured && styles.featuredCard
                    ]}
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={1}
                >
                    {isFeatured && (
                        <View style={styles.featuredBadge}>
                            <Text style={styles.featuredText}>⭐ FEATURED</Text>
                        </View>
                    )}
                    <Image source={{ uri: restaurant.image }} style={styles.image} />
                    <View style={styles.content}>
                        <View style={styles.headerRow}>
                            <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
                            <View style={styles.ratingContainer}>
                                <Star size={14} color="#FFD700" fill="#FFD700" />
                                <Text style={styles.rating}>{restaurant.rating}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.categories} numberOfLines={1}>
                                {restaurant.categories ? restaurant.categories.join(' • ') : ''}
                            </Text>
                            <Text style={styles.price}>{restaurant.priceRange}</Text>
                        </View>

                        <View style={styles.detailsRow}>
                            <View style={styles.badge}>
                                <Clock size={12} color={theme.colors.textSecondary} />
                                <Text style={styles.deliveryTime}>{restaurant.deliveryTime}</Text>
                            </View>
                            <View style={styles.deliveryFeeBadge}>
                                <Text style={styles.deliveryFee}>Free Delivery</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        // Shadow opacity is animated
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20, // Larger for premium feel
        overflow: 'hidden',
    },
    featuredCard: {
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    featuredBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        zIndex: 10,
        elevation: 5,
    },
    featuredText: {
        color: '#FFD700',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    image: {
        width: '100%',
        height: 200, // Increased from 180 for more impact
        resizeMode: 'cover',
    },
    content: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    name: {
        flex: 1,
        fontSize: 19, // Slightly larger
        fontWeight: '800', // Bolder
        color: '#111827',
        letterSpacing: -0.3,
        marginRight: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFE082',
    },
    rating: {
        marginLeft: 4,
        fontSize: 13,
        fontWeight: '700',
        color: '#F57C00',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    categories: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginRight: 8,
    },
    price: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    deliveryTime: {
        marginLeft: 4,
        fontSize: 12,
        color: theme.colors.text,
        fontWeight: '600',
    },
    deliveryFeeBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#6EE7B7',
    },
    deliveryFee: {
        fontSize: 12,
        color: '#047857',
        fontWeight: '700',
    }
});
