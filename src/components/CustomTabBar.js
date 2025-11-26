import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');

// Custom tab bar shape with configurable cutout parameters
const TabBarShape = () => {
    const tabWidth = width - 20;
    const center = tabWidth / 2;

    // ===== CUTOUT PARAMETERS - Easy to configure =====
    const cutoutWidth = 74;            // Slightly wider for breathing room
    const cutoutDepth = 52;             // How deep the arc goes down
    const cutoutCornerRadius = 22;       // Smoothness entering the cutout
    const topCornerRadius = 40;         // Top corners of tab bar
    const bottomCornerRadius = 40;      // Bottom corners of tab bar

    // Button specs (matches bigIconContainer)
    const buttonDiameter = 60;
    const buttonRadius = buttonDiameter / 2; // 30px

    // Magic constant for perfect circle with cubic Bezier
    const k = 0.5522847498; // (4/3) * tan(π/8)
    const controlDistance = k * buttonRadius;

    // Calculate cutout arc points
    const leftX = center - cutoutWidth / 2;
    const rightX = center + cutoutWidth / 2;

    // SVG Path with smooth cutout entry
    const d = `
        M 0 ${topCornerRadius}
        Q 0 0 ${topCornerRadius} 0
        L ${leftX - cutoutCornerRadius} 0
        Q ${leftX} 0 ${leftX} ${cutoutCornerRadius}
        C ${leftX} ${controlDistance + cutoutCornerRadius}, ${center - controlDistance} ${cutoutDepth}, ${center} ${cutoutDepth}
        C ${center + controlDistance} ${cutoutDepth}, ${rightX} ${controlDistance + cutoutCornerRadius}, ${rightX} ${cutoutCornerRadius}
        Q ${rightX} 0 ${rightX + cutoutCornerRadius} 0
        L ${tabWidth - topCornerRadius} 0
        Q ${tabWidth} 0 ${tabWidth} ${topCornerRadius}
        L ${tabWidth} ${80 - bottomCornerRadius}
        Q ${tabWidth} 80 ${tabWidth - bottomCornerRadius} 80
        L ${bottomCornerRadius} 80
        Q 0 80 0 ${80 - bottomCornerRadius}
        Z
    `;

    return (
        <Svg width={tabWidth} height={80} viewBox={`0 0 ${tabWidth} 80`} style={StyleSheet.absoluteFill}>
            {/* Main tab bar shape - LIGHT THEME WITH BORDER */}
            <Path
                d={d}
                fill="white"
                stroke="#E5E7EB" // Light gray border for definition
                strokeWidth="1.5"
            />
        </Svg>
    );
};

export const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.container}>
            <TabBarShape />
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
                            routeName={route.name}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const TabBarButton = ({ onPress, onLongPress, isFocused, options, routeName }) => {
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);
    const isBigButton = options.isBigButton || false;

    React.useEffect(() => {
        if (isFocused) {
            translateY.value = withSpring(isBigButton ? -8 : -8, { damping: 12 });
            scale.value = withSpring(isBigButton ? 1.08 : 1.1);
        } else {
            translateY.value = withSpring(0);
            scale.value = withSpring(1);
        }
    }, [isFocused, isBigButton]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }, { scale: scale.value }],
        };
    });

    return (
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={styles.tabButton} activeOpacity={0.7}>
            <Animated.View style={[styles.innerButton, animatedStyle]}>
                <View style={[
                    styles.iconContainer,
                    isBigButton && styles.bigIconContainer,
                    isBigButton && options.tabBarButtonColor && {
                        backgroundColor: options.tabBarButtonColor,
                        shadowColor: options.tabBarButtonColor
                    },
                    isFocused && (isBigButton ? styles.activeBigIconContainer : styles.activeIconContainer)
                ]}>
                    {options.tabBarIcon &&
                        options.tabBarIcon({
                            color: isFocused ? (isBigButton ? '#FFFFFF' : theme.colors.primary) : '#9CA3AF',
                            size: isBigButton ? 32 : 24,
                            focused: isFocused,
                        })}
                </View>
                {isFocused && !isBigButton && <Animated.View style={styles.activeDot} />}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 24,
        left: 10,
        right: 10,
        height: 80,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,      // Increased opacity for visibility
                shadowRadius: 24,         // Larger radius for "float"
            },
            android: {
                elevation: 12,
            },
        }),
    },
    tabBarContainer: {
        flexDirection: 'row',
        height: 80,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 8,
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
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // BIG CART BUTTON
    bigIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary,
        marginTop: -45,
        borderWidth: 4,
        borderColor: '#FFFFFF', // White border to match tab bar
        // Enhanced layered shadow
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    activeIconContainer: {
        backgroundColor: '#F3F4F6', // Light gray background for active
        borderRadius: 20,
    },
    activeBigIconContainer: {
        transform: [{ scale: 1.05 }],
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 15,
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
