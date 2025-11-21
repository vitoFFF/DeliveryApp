import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');

export const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.container}>
            <BlurView intensity={80} tint="light" style={styles.blurContainer}>
                <View style={styles.tabBarContainer}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: 'tabLongPress',
                                target: route.key,
                            });
                        };

                        return (
                            <TabBarButton
                                key={route.key}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                isFocused={isFocused}
                                options={options}
                            />
                        );
                    })}
                </View>
            </BlurView>
        </View>
    );
};

const TabBarButton = ({ onPress, onLongPress, isFocused, options }) => {
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);

    React.useEffect(() => {
        if (isFocused) {
            translateY.value = withSpring(-8, { damping: 12 });
            scale.value = withSpring(1.1);
        } else {
            translateY.value = withSpring(0);
            scale.value = withSpring(1);
        }
    }, [isFocused]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }, { scale: scale.value }],
        };
    });

    const iconColor = isFocused ? theme.colors.primary : theme.colors.textSecondary;

    return (
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
            activeOpacity={0.7}
        >
            <Animated.View style={[styles.innerButton, animatedStyle]}>
                {/* Icon */}
                <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                    {options.tabBarIcon &&
                        options.tabBarIcon({
                            color: isFocused ? theme.colors.surface : theme.colors.textSecondary,
                            size: 24,
                            focused: isFocused,
                        })}
                </View>

                {/* Optional Indicator Dot */}
                {isFocused && <Animated.View style={styles.activeDot} />}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        borderRadius: 30,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    blurContainer: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    tabBarContainer: {
        flexDirection: 'row',
        height: 85,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',// Semi-transparent for glass effect
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    innerButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 72,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIconContainer: {
        backgroundColor: theme.colors.primary,
        borderRadius: 72,  // Match iconContainer for consistent rounded shape
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    activeDot: {
        position: 'absolute',
        bottom: -12,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.primary,
    }
});
