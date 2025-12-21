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
                        ? {
                            colors: ['#F97316', '#FB923C', '#FDBA74'],
                            start: { x: 0, y: 0 },
                            end: { x: 1, y: 1 },
                            style: [styles.chip, styles.chipSelected]
                        }
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
        marginBottom: 8,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 10,
    },
    touchable: {
        borderRadius: 24,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 11,
        borderRadius: 24,
        gap: 7,
        borderWidth: 1.5,
    },
    chipUnselected: {
        backgroundColor: '#FAFBFC',
        borderColor: '#E8EAED',
        shadowColor: "#1F2937",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    chipSelected: {
        borderColor: 'transparent',
        shadowColor: theme.colors.primary,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
        transform: [{ scale: 1.02 }],
    },
    chipText: {
        fontSize: 13.5,
        fontWeight: '600',
        color: '#4B5563',
        letterSpacing: 0.2,
    },
    chipTextSelected: {
        color: '#FFFFFF',
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});
