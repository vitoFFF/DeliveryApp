
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions, Modal, Pressable, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolate, Extrapolate, Easing } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { BlurView } from 'expo-blur';
import { selectCartCount } from '../store/cartSlice';
import { theme } from '../utils/theme';
import { Text as RNText } from 'react-native';
import { Home, MessageSquare, LifeBuoy } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const TabBarShape = () => {
    const tabWidth = width - 20;
    const center = tabWidth / 2;
    const cutoutWidth = 74;
    const cutoutDepth = 52;
    const cutoutCornerRadius = 22;
    const topCornerRadius = 40;
    const bottomCornerRadius = 40;
    const buttonDiameter = 60;
    const buttonRadius = buttonDiameter / 2;
    const k = 0.5522847498;
    const controlDistance = k * buttonRadius;
    const leftX = center - cutoutWidth / 2;
    const rightX = center + cutoutWidth / 2;

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
            <Path
                d={d}
                fill="white"
                stroke="#E5E7EB"
                strokeWidth="1.5"
            />
        </Svg>
    );
};

export const CustomTabBar = ({ state, descriptors, navigation }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const rotation = useSharedValue(0);
    const menuProgress = useSharedValue(0);

    const toggleMenu = () => {
        const toValue = isMenuOpen ? 0 : 1;
        setMenuOpen(!isMenuOpen);
        rotation.value = withTiming(isMenuOpen ? 0 : 360, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
        menuProgress.value = withTiming(toValue, { duration: 300, easing: Easing.out(Easing.exp) });
    };

    const closeMenu = () => {
        setMenuOpen(false);
        rotation.value = withTiming(0, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
        menuProgress.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.exp) });
    };

    const navigateAndClose = (screen) => {
        if (screen === 'AIChat') {
            navigation.navigate('AIHub', { screen: 'AIChat' });
        } else {
            navigation.navigate(screen);
        }
        closeMenu();
    };

    const animatedRotation = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const menuItems = [
        { icon: <Home color="white" size={24} />, screen: 'AIHub', label: 'AI Hub' },
        { icon: <Image source={require('../../assets/robot.png')} style={{ width: 38, height: 38 }} resizeMode="contain" />, screen: 'AIChat', label: 'AI Chat' },
        { icon: <LifeBuoy color="white" size={24} />, screen: 'Support', label: 'Support' },
    ];

    return (
        <>
            <Modal
                transparent
                visible={isMenuOpen}
                onRequestClose={closeMenu}
            >
                <Pressable style={styles.modalBackdrop} onPress={closeMenu}>
                    <BlurView
                        style={StyleSheet.absoluteFill}
                        tint="dark"
                        intensity={80}
                    />
                    <View style={[StyleSheet.absoluteFill, styles.backdropTint]} />
                </Pressable>
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => {
                        const angle = -45 - (index * 45);
                        const animatedStyle = useAnimatedStyle(() => {
                            const radians = (angle * Math.PI) / 180;
                            const x = Math.cos(radians) * 100;
                            const y = Math.sin(radians) * 100;

                            return {
                                opacity: menuProgress.value,
                                transform: [
                                    { translateX: interpolate(menuProgress.value, [0, 1], [0, x], Extrapolate.CLAMP) },
                                    { translateY: interpolate(menuProgress.value, [0, 1], [0, y], Extrapolate.CLAMP) },
                                    { scale: interpolate(menuProgress.value, [0, 1], [0.5, 1], Extrapolate.CLAMP) }
                                ],
                            };
                        });
                        return (
                            <Animated.View key={item.screen} style={[styles.menuItem, animatedStyle]}>
                                <TouchableOpacity style={styles.menuButton} onPress={() => navigateAndClose(item.screen)}>
                                    {item.icon}
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>

            </Modal>

            <View style={styles.container}>
                <TabBarShape />
                <View style={styles.tabBarContainer}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        const onPress = () => {
                            if (options.isBigButton) {
                                toggleMenu();
                                return;
                            }

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
                                rotation={options.isBigButton ? animatedRotation : {}}
                            />
                        );
                    })}
                </View>
            </View>
        </>
    );
};

const TabBarButton = ({ onPress, onLongPress, isFocused, options, routeName, rotation }) => {
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);
    const isBigButton = options.isBigButton || false;
    const cartCount = useSelector(selectCartCount);
    const isCart = routeName === 'Cart';

    React.useEffect(() => {
        if (isFocused && !isBigButton) {
            translateY.value = withTiming(-8, { duration: 200 });
            scale.value = withTiming(1.1, { duration: 200 });
        } else if (!isBigButton) {
            translateY.value = withTiming(0, { duration: 200 });
            scale.value = withTiming(1, { duration: 200 });
        }
    }, [isFocused, isBigButton]);

    const animatedStyle = useAnimatedStyle(() => {
        if (isBigButton) return {};
        return {
            transform: [{ translateY: translateY.value }, { scale: scale.value }],
        };
    });

    return (
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={styles.tabButton} activeOpacity={0.7}>
            <Animated.View style={[styles.innerButton, animatedStyle]}>
                <Animated.View style={[
                    styles.iconContainer,
                    isBigButton && styles.bigIconContainer,
                    isBigButton && options.tabBarButtonColor && {
                        backgroundColor: options.tabBarButtonColor,
                        shadowColor: options.tabBarButtonColor
                    },
                    isFocused && !isBigButton && styles.activeIconContainer,
                    rotation
                ]}>
                    {options.tabBarIcon &&
                        options.tabBarIcon({
                            color: isFocused && !isBigButton ? theme.colors.primary : (isBigButton ? '#FFFFFF' : '#9CA3AF'),
                            size: isBigButton ? 32 : 24,
                            focused: isFocused,
                        })}

                    {isCart && cartCount > 0 && (
                        <View style={styles.badge}>
                            <RNText style={styles.badgeText}>{cartCount}</RNText>
                        </View>
                    )}
                </Animated.View>
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
                shadowOpacity: 0.15,
                shadowRadius: 24,
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
    bigIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary,
        marginTop: -45,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    activeIconContainer: {
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
    },
    activeDot: {
        position: 'absolute',
        bottom: -12,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.primary,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#FF3B30',
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // ---- MODAL & MENU ----
    modalBackdrop: {
        flex: 1,
    },
    backdropTint: {
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    menuContainer: {
        position: 'absolute',
        bottom: 55,
        left: width / 2,
    },
    menuItem: {
        position: 'absolute',
        left: -28,
        top: -28,
    },
    menuButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
});
