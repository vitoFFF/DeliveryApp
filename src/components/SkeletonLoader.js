import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme } from '../utils/theme';

export const SkeletonLoader = ({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style
}) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-300, 300],
    });

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 0.6, 0.3],
    });

    return (
        <View style={[styles.container, { width, height, borderRadius }, style]}>
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        opacity,
                        transform: [{ translateX }],
                    },
                ]}
            />
        </View>
    );
};

// Preset skeleton shapes
export const SkeletonCard = () => (
    <View style={styles.cardSkeleton}>
        <SkeletonLoader width="100%" height={180} borderRadius={16} style={{ marginBottom: 12 }} />
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <SkeletonLoader width="70%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
            <SkeletonLoader width="40%" height={16} borderRadius={4} style={{ marginBottom: 12 }} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <SkeletonLoader width={80} height={28} borderRadius={8} />
                <SkeletonLoader width={100} height={28} borderRadius={8} />
            </View>
        </View>
    </View>
);

export const SkeletonHorizontalCard = () => (
    <View style={styles.horizontalCardSkeleton}>
        <SkeletonLoader width="100%" height={150} borderRadius={12} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="80%" height={16} borderRadius={4} style={{ marginBottom: 4 }} />
        <SkeletonLoader width="60%" height={14} borderRadius={4} />
    </View>
);

export const SkeletonCategory = () => (
    <View style={styles.categorySkeleton}>
        <SkeletonLoader width={40} height={40} borderRadius={20} style={{ marginRight: 8 }} />
        <SkeletonLoader width={80} height={16} borderRadius={4} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E1E4E8',
        overflow: 'hidden',
    },
    shimmer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F6F8FA',
    },
    cardSkeleton: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    horizontalCardSkeleton: {
        width: 280,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: 12,
        marginRight: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    categorySkeleton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: 8,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 8,
        width: 150,
        height: 60,
    },
});
