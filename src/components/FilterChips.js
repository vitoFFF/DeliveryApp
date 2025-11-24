import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme } from '../utils/theme';
import { Star, Clock, DollarSign, Leaf } from 'lucide-react-native';

export const FilterChips = ({ filters, selectedFilter, onSelect }) => {
    const getIcon = (label, isSelected) => {
        const color = isSelected ? '#FFFFFF' : theme.colors.textSecondary;
        const size = 16;

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
                    return (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.chip,
                                isSelected && styles.chipSelected
                            ]}
                            onPress={() => onSelect(filter === selectedFilter ? null : filter)}
                            activeOpacity={0.7}
                        >
                            {getIcon(filter, isSelected)}
                            <Text style={[
                                styles.chipText,
                                isSelected && styles.chipTextSelected
                            ]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 6,
        ...theme.shadows.small,
    },
    chipSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    chipTextSelected: {
        color: '#FFFFFF',
    },
});
