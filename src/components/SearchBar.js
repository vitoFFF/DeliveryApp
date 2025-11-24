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

    const aiScaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(aiScaleAnim, {
            toValue: 0.92,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(aiScaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
        }).start();
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
                    color={isAIMode ? theme.colors.primary : (isFocused ? theme.colors.primary : '#6B7280')}
                    strokeWidth={2.5}
                />
            </View>

            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={isAIMode ? aiPlaceholder : placeholder}
                placeholderTextColor={isAIMode ? theme.colors.primaryLight : '#9CA3AF'}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectionColor={theme.colors.primary}
            />

            {/* AI Mode Toggle Button */}
            <TouchableOpacity
                onPress={toggleAIMode}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.aiToggleButton}
                activeOpacity={1} // Handled by scale animation
            >
                <Animated.View style={{ transform: [{ scale: aiScaleAnim }] }}>
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
                            color={isAIMode ? '#FFFFFF' : theme.colors.primary}
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
        paddingVertical: 12, // Slightly reduced to balance increased radius
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
    aiToggleButton: {
        position: 'relative',
        marginLeft: 4,
        padding: 4, // Increase touch target (Fitts's Law)
    },
    aiGlow: {
        position: 'absolute',
        top: -8, // Larger glow area
        left: -8,
        right: -8,
        bottom: -8,
        borderRadius: 24,
        backgroundColor: theme.colors.primary,
        opacity: 0.3,
    },
    aiChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 22,
        backgroundColor: '#FFF0ED',
        borderWidth: 1.5,
        borderColor: '#FFD1C7',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2,
    },
    aiChipActive: {
        backgroundColor: theme.colors.primaryDark,
        borderColor: '#D84315',
        shadowColor: theme.colors.primaryDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
        elevation: 8,
    },
    aiText: {
        fontSize: 13,
        fontWeight: '800',
        color: theme.colors.primaryDark,
        letterSpacing: 0.6,
        textShadowColor: 'rgba(229, 80, 46, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    aiTextActive: {
        color: '#FFFFFF',
    },
    clearButton: {
        padding: 8, // Larger touch target (Fitts's Law)
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

