import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Platform, Dimensions } from 'react-native';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');

export const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.container}>
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
        </View>
    );
};

const TabBarButton = ({ onPress, onLongPress, isFocused, options }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateAnim = useRef(new Animated.Value(0)).current;
    const circleScaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: isFocused ? 1 : 1,
                useNativeDriver: true,
                friction: 8,
            }),
            Animated.spring(translateAnim, {
                toValue: isFocused ? -5 : 0,
                useNativeDriver: true,
                friction: 8,
            }),
            Animated.spring(circleScaleAnim, {
                toValue: isFocused ? 1 : 0,
                useNativeDriver: true,
                friction: 6,
                tension: 80,
            }),
        ]).start();
    }, [isFocused]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: isFocused ? 1 : 1,
            useNativeDriver: true,
        }).start();
    };

    const iconColor = isFocused ? theme.colors.surface : theme.colors.textSecondary;

    return (
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.tabButton}
            activeOpacity={1}
        >
            <Animated.View style={[styles.innerButton, { transform: [{ scale: scaleAnim }, { translateY: translateAnim }] }]}>
                {/* Active Circle Background */}
                <Animated.View
                    style={[
                        styles.activeCircle,
                        {
                            transform: [{ scale: circleScaleAnim }],
                            opacity: circleScaleAnim,
                        },
                    ]}
                />

                {/* Icon */}
                <View style={styles.iconContainer}>
                    {options.tabBarIcon &&
                        options.tabBarIcon({
                            color: iconColor,
                            size: 24,
                            focused: isFocused,
                        })}
                </View>

                {/* Label - Optional: You can hide this for a cleaner look or keep it */}
                {/* <Animated.Text
                    style={[
                        styles.label,
                        {
                            color: isFocused ? theme.colors.primary : theme.colors.textSecondary,
                            opacity: isFocused ? 1 : 0.7,
                            transform: [{ scale: isFocused ? 1 : 0.8 }]
                        }
                    ]}
                >
                    {options.tabBarLabel}
                </Animated.Text> */}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBarContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 35,
        height: 70,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
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
        width: 50,
        height: 50,
    },
    activeCircle: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainer: {
        zIndex: 1,
    },
    label: {
        fontSize: 10,
        marginTop: 4,
        fontWeight: '600',
    },
});
