import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { Search, X, Sparkles } from 'lucide-react-native';
import { theme } from '../utils/theme';

export const SearchBar = ({
    value,
    onChangeText,
    placeholder = 'Search for food, restaurants...',
    aiPlaceholder = 'Ask AI anything...',
    onAIModeChange
}) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [isAIMode, setIsAIMode] = React.useState(false);
    const aiGlowAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (isAIMode) {
            // Pulsing glow animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(aiGlowAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: false,
                    }),
                    Animated.timing(aiGlowAnim, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        } else {
            aiGlowAnim.setValue(0);
        }
    }, [isAIMode]);

    const toggleAIMode = () => {
        const newMode = !isAIMode;
        setIsAIMode(newMode);
        if (onAIModeChange) {
            onAIModeChange(newMode);
        }
    };

    const glowOpacity = aiGlowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
    });

    return (
        <View style={[
            styles.container,
            isFocused && styles.containerFocused,
            isAIMode && styles.containerAIMode
        ]}>
            <View style={styles.searchIconWrapper}>
                <Search
                    size={20}
                    color={isAIMode ? '#8B5CF6' : (isFocused ? theme.colors.primary : '#6B7280')}
                    strokeWidth={2.5}
                />
            </View>

            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={isAIMode ? aiPlaceholder : placeholder}
                placeholderTextColor={isAIMode ? '#A78BFA' : '#9CA3AF'}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectionColor={isAIMode ? '#8B5CF6' : theme.colors.primary}
            />

            {/* AI Mode Toggle Button */}
            <TouchableOpacity
                onPress={toggleAIMode}
                style={styles.aiToggleButton}
                activeOpacity={0.7}
            >
                {isAIMode && (
                    <Animated.View
                        style={[
                            styles.aiGlow,
                            { opacity: glowOpacity }
                        ]}
                    />
                )}
                <View style={[
                    styles.aiChip,
                    isAIMode && styles.aiChipActive
                ]}>
                    <Sparkles
                        size={22}
                        color={isAIMode ? '#FFFFFF' : '#8B5CF6'}
                        strokeWidth={2.5}
                        fill={isAIMode ? '#FFFFFF' : 'transparent'}
                    />
                    <Text style={[
                        styles.aiText,
                        isAIMode && styles.aiTextActive
                    ]}>
                        AI
                    </Text>
                </View>
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
    containerAIMode: {
        borderColor: '#8B5CF6',
        backgroundColor: '#FDFBFF',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
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
    aiToggleButton: {
        position: 'relative',
        marginLeft: 4,

    },
    aiGlow: {
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        borderRadius: 20,
        backgroundColor: '#8B5CF6',
        opacity: 0.3,
    },
    aiChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#F5F3FF',
        borderWidth: 1.5,
        borderColor: '#E9D5FF',
    },
    aiChipActive: {
        backgroundColor: '#8B5CF6',
        borderColor: '#7C3AED',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
    },
    aiText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8B5CF6',
        letterSpacing: 0.5,
    },
    aiTextActive: {
        color: '#FFFFFF',
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

