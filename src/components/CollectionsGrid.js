import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

// Mock collections data
const COLLECTIONS = [
    {
        id: '1',
        title: 'Healthy',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        color: '#4ECDC4',
    },
    {
        id: '2',
        title: 'Date Night',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
        color: '#FF6B6B',
    },
    {
        id: '3',
        title: 'Comfort Food',
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
        color: '#FFE66D',
    },
    {
        id: '4',
        title: 'Desserts',
        image: 'https://images.unsplash.com/photo-1563729768-7491131ba718?https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=800&q=80',
        color: '#1A535C',
    },
];

export const CollectionsGrid = ({ onCollectionPress }) => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('home.collections')}</Text>
            </View>
            <View style={styles.grid}>
                {COLLECTIONS.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        onPress={() => onCollectionPress && onCollectionPress(item)}
                    >
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.overlay}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
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
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 16,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_WIDTH, // Square cards
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
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
});
