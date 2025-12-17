import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../utils/theme';
import { Star, Clock, DollarSign, Leaf } from 'lucide-react-native';

export const FilterChips = ({ filters, selectedFilter, onSelect }) => {
    const getIcon = (label, isSelected) => {
        const color = isSelected ? '#FFFFFF' : theme.colors.textSecondary;
        const size = 18;

        if (label.includes('Rating')) return <Star size={size} color={color} fill={isSelected ? '#FFFFFF' : 'transparent'} />;
        if (label.includes('min')) return <Clock size={size} color={color} />;
        if (label.includes('Price')) return <DollarSign size={size} color={color} />;
        if (label.includes('Dietary') || label.includes('Vegan')) return <Leaf size={size} color={color} />;
        return null;
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {filters.map((filter) => {
                    const isSelected = selectedFilter === filter;

                    // Conditionally render Gradient or View based on selection
                    const Container = isSelected ? LinearGradient : View;
                    const containerProps = isSelected
                        ? { colors: [theme.colors.primary, theme.colors.primaryLight], start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, style: [styles.chip, styles.chipSelected] }
                        : { style: [styles.chip, styles.chipUnselected] };

                    return (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => onSelect(filter === selectedFilter ? null : filter)}
                            activeOpacity={0.8}
                            style={styles.touchable}
                        >
                            <Container {...containerProps}>
                                {getIcon(filter, isSelected)}
                                <Text style={[
                                    styles.chipText,
                                    isSelected && styles.chipTextSelected
                                ]}>
                                    {filter}
                                </Text>
                            </Container>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24, // Increased spacing from content below
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 4, // Allow space for shadow
        gap: 12, // Modern spacing
    },
    touchable: {
        borderRadius: 30, // Matches chip border radius
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12, // Taller pill
        borderRadius: 30,
        gap: 8,
    },
    chipUnselected: {
        backgroundColor: '#FFFFFF', // Clean white
        // Very subtle modern shadow instead of border
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 2.50,
        elevation: 1,
    },
    chipSelected: {
        // Gradient handled in props
        shadowColor: theme.colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary, // Softer text color for unselected
        letterSpacing: 0.3,
    },
    chipTextSelected: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
});
