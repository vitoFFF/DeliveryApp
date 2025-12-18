import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../utils/theme';

export const SearchBar = ({
    value,
    onChangeText,
    placeholder,
    onFilterPress
}) => {
    const { t } = useTranslation();
    const [isFocused, setIsFocused] = React.useState(false);

    const defaultPlaceholder = placeholder || t('search.search_placeholder');

    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.92,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    return (
        <View style={[
            styles.container,
            isFocused && styles.containerFocused,
        ]}>
            <View style={styles.searchIconWrapper}>
                <Search
                    size={20}
                    color={isFocused ? theme.colors.primary : '#6B7280'}
                    strokeWidth={2.5}
                />
            </View>

            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={defaultPlaceholder}
                placeholderTextColor={'#9CA3AF'}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectionColor={theme.colors.primary}
            />

            <TouchableOpacity
                onPress={onFilterPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.filterButton}
                activeOpacity={1}
            >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <View style={styles.filterChip}>
                        <SlidersHorizontal
                            size={18}
                            color={theme.colors.primary}
                            strokeWidth={2.5}
                        />
                    </View>
                </Animated.View>
            </TouchableOpacity>

            {value.length > 0 && (
                <TouchableOpacity
                    onPress={() => onChangeText('')}
                    style={styles.clearButton}
                    activeOpacity={0.7}
                >
                    <View style={styles.clearIconBg}>
                        <X size={14} color="#6B7280" strokeWidth={2.5} />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20, // Increased for friendlier shape (Gestalt)
        paddingHorizontal: 16,
        paddingVertical: 8, // Reduced from 12 for smaller footprint
        marginHorizontal: 16,
        marginTop: 12, // More breathing room
        marginBottom: 20,
        gap: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6', // Softer border
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // Deeper shadow for depth
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    containerFocused: {
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
        transform: [{ scale: 1.01 }], // Subtle pop on focus
    },
    containerAIMode: {
        borderColor: theme.colors.primary,
        backgroundColor: '#FFF9F8',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    searchIconWrapper: {
        width: 24, // Larger visual anchor
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 16, // Larger text for readability
        fontWeight: '500',
        color: '#1F2937', // Darker text for contrast
        padding: 0,
        letterSpacing: 0.3,
        height: '100%', // Ensure full height hit area
    },
    filterButton: {
        position: 'relative',
        marginLeft: 4,
        padding: 4,
    },
    filterChip: {
        width: 36, // Reduced from 44
        height: 36, // Reduced from 44
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10, // Slightly smaller radius to match smaller size
        backgroundColor: '#FFF0ED',
        borderWidth: 1.5,
        borderColor: '#FFD1C7',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '800',
        color: theme.colors.primaryDark,
        letterSpacing: 0.6,
    },
    clearButton: {
        padding: 8,
        marginRight: -4,
    },
    clearIconBg: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

