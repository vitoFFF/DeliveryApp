import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { theme } from '../utils/theme';

export const SearchBar = ({ value, onChangeText, placeholder = 'Search for food, restaurants...' }) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: isFocused ? 1 : 0,
            useNativeDriver: false,
            tension: 50,
            friction: 7,
        }).start();
    }, [isFocused]);

    const borderColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.border, theme.colors.primary],
    });

    const handleClear = () => {
        onChangeText('');
    };

    return (
        <Animated.View style={[styles.container, { borderColor }]}>
            <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textLight}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <X size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.glass,
        borderRadius: theme.borderRadius.m,
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.s,
        marginHorizontal: theme.spacing.m,
        marginTop: theme.spacing.s,
        marginBottom: theme.spacing.m,
        borderWidth: 2,
        ...theme.shadows.small,
    },
    searchIcon: {
        marginRight: theme.spacing.s,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text,
        padding: 0,
    },
    clearButton: {
        padding: theme.spacing.xs,
        marginLeft: theme.spacing.s,
    },
});
