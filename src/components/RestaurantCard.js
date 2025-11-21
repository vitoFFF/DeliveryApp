import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, Clock } from 'lucide-react-native';
import { theme } from '../utils/theme';

export const RestaurantCard = ({ restaurant, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <Image source={{ uri: restaurant.image }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.name}>{restaurant.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Star size={14} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.rating}>{restaurant.rating}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.categories}>{restaurant.categories ? restaurant.categories.join(' • ') : ''}</Text>
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
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        marginBottom: theme.spacing.m,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    image: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    content: {
        padding: theme.spacing.m,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
    },
    rating: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.s,
    },
    categories: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    price: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 8,
    },
    deliveryTime: {
        marginLeft: 4,
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    deliveryFeeBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    deliveryFee: {
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: 'bold',
    }
});
