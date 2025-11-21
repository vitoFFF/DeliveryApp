import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { theme } from '../utils/theme';

export const SearchBar = ({ value, onChangeText, placeholder = 'Search for food, restaurants...' }) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <View style={[styles.container, isFocused && styles.containerFocused]}>
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
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectionColor={theme.colors.primary}
            />

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
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    containerFocused: {
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 3,
    },
    searchIconWrapper: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontWeight: '400',
        color: '#111827',
        padding: 0,
        letterSpacing: 0.2,
    },
    clearButton: {
        padding: 4,
    },
    clearIconBg: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
