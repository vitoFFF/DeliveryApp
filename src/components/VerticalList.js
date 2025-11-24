import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../utils/theme';

export const VerticalList = ({ title, data, renderItem, onItemPress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.list}>
                {data.map((item, index) => (
                    <View key={item.id || index} style={styles.itemContainer}>
                        {renderItem ? (
                            renderItem({ item, index })
                        ) : (
                            // Default render if no custom renderItem provided
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => onItemPress && onItemPress(item)}
                            >
                                <Image source={{ uri: item.image }} style={styles.image} />
                                <View style={styles.info}>
                                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                                    <View style={styles.metaRow}>
                                        <Text style={styles.rating}>★ {item.rating}</Text>
                                        <Text style={styles.dot}>•</Text>
                                        <Text style={styles.time}>{item.deliveryTime}</Text>
                                    </View>
                                    <Text style={styles.categories} numberOfLines={1}>
                                        {item.categories?.join(' • ')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
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
    list: {
        paddingHorizontal: 16,
        gap: 16,
    },
    itemContainer: {
        marginBottom: 0,
    },
    // Default card styles
    card: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 12,
        ...theme.shadows.small,
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    rating: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    dot: {
        marginHorizontal: 6,
        color: theme.colors.textSecondary,
    },
    time: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    categories: {
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
});
