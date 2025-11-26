import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = width * 0.6; // 60% of screen width

// Placeholder data for special offers
// TODO: Replace with real data from backend/AI recommendations
const OFFERS = [
    {
        id: '1',
        title: '50% OFF Sushi Platter',
        subtitle: 'Limited time offer',
        image: 'https://plus.unsplash.com/premium_photo-1668146932065-d08643791942?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        color: '#FF6B6B',
    },
    {
        id: '2',
        title: 'Free Delivery on Pizza',
        subtitle: 'Order over $20',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
        color: '#4ECDC4',
    },
    {
        id: '3',
        title: 'Buy 1 Get 1 Free',
        subtitle: 'Selected Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        color: '#FFE66D',
    },
];

export const SpecialOffersHero = ({ onOfferPress }) => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{t('home.special_offers')}</Text>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={width - 32} // Width minus padding
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
            >
                {OFFERS.map((offer) => (
                    <TouchableOpacity
                        key={offer.id}
                        style={styles.card}
                        onPress={() => onOfferPress && onOfferPress(offer)}
                        activeOpacity={0.9}
                    >
                        <Image source={{ uri: offer.image }} style={styles.image} />
                        <View style={styles.overlay}>
                            <View style={[styles.badge, { backgroundColor: offer.color }]}>
                                <Text style={styles.badgeText}>PROMO</Text>
                            </View>
                            <Text style={styles.title}>{offer.title}</Text>
                            <Text style={styles.subtitle}>{offer.subtitle}</Text>
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
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    card: {
        width: width - 32, // Full width minus padding
        height: HERO_HEIGHT,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
        ...theme.shadows.medium,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingTop: 48,
        // Gradient-like overlay for text readability
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        marginBottom: 12,
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 16,
        fontWeight: '600',
    },
});
