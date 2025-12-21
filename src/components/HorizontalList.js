import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { theme } from '../utils/theme';

export const HorizontalList = ({ title, data, renderItem, style }) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                snapToInterval={280 + theme.spacing.m} // Card width + margin
                decelerationRate="fast"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8, // Reduced margin since we use gap in parent
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.m,
        marginBottom: 16, // More space between title and content
    },
    title: {
        fontSize: 22, // Larger for better hierarchy
        fontWeight: '800', // Bolder
        color: '#111827',
        letterSpacing: -0.5, // Tighter tracking for headlines
    },
    seeAll: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: theme.spacing.m,
    },
});
