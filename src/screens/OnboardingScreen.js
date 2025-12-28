import React, { useState, useRef, useMemo } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    useWindowDimensions,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { setOnboardingSeen } from '../store/appSlice';
import { theme } from '../utils/theme';
import { StatusBar } from 'expo-status-bar';
import { Rocket, MapPin, Users, ChevronRight } from 'lucide-react-native';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const SLIDES = [
    {
        id: '1',
        title: 'Sonic Delivery',
        description: 'Experience lightning-fast delivery to your doorstep. We value your time as much as you do.',
        icon: Rocket,
        colors: ['#FF6347', '#FFBF00'],
    },
    {
        id: '2',
        title: 'Smart Tracking',
        description: 'Keep an eye on your order with real-time GPS tracking. Know exactly where your food is.',
        icon: MapPin,
        colors: ['#4CAF50', '#8BC34A'],
    },
    {
        id: '3',
        title: 'Join the Community',
        description: 'Unlock exclusive rewards and connect with the best local restaurants in your area.',
        icon: Users,
        colors: ['#2196F3', '#00BCD4'],
    },
];

const Slide = ({ slide, index, scrollX, width, height }) => {
    const insets = useSafeAreaInsets();
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0, 1, 0],
            Extrapolate.CLAMP
        );

        const translateY = interpolate(
            scrollX.value,
            inputRange,
            [100, 0, 100],
            Extrapolate.CLAMP
        );

        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.5, 1, 0.5],
            Extrapolate.CLAMP
        );

        return {
            opacity,
            transform: [{ translateY }, { scale }],
        };
    });

    const Icon = slide.icon;

    return (
        <View style={[styles.slide, { width }]}>
            <LinearGradient
                colors={slide.colors}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Animated.View style={[styles.contentContainer, animatedStyle, { paddingTop: insets.top }]}>
                    <View style={styles.iconContainer}>
                        <Icon size={120} color="#FFFFFF" strokeWidth={1.5} />
                    </View>
                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.description}>{slide.description}</Text>
                </Animated.View>
            </LinearGradient>
        </View>
    );
};

const Pagination = ({ scrollX, width }) => {
    return (
        <View style={styles.paginationContainer}>
            {SLIDES.map((_, index) => {
                const animatedDotStyle = useAnimatedStyle(() => {
                    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                    const dotWidth = interpolate(
                        scrollX.value,
                        inputRange,
                        [10, 30, 10],
                        Extrapolate.CLAMP
                    );
                    const opacity = interpolate(
                        scrollX.value,
                        inputRange,
                        [0.4, 1, 0.4],
                        Extrapolate.CLAMP
                    );
                    return {
                        width: dotWidth,
                        opacity,
                    };
                });

                return (
                    <Animated.View
                        key={index}
                        style={[styles.dot, animatedDotStyle]}
                    />
                );
            })}
        </View>
    );
};

export const OnboardingScreen = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const scrollX = useSharedValue(0);
    const dispatch = useDispatch();
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const onScroll = (event) => {
        scrollX.value = event.nativeEvent.contentOffset.x;
    };

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
            setCurrentIndex(currentIndex + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        dispatch(setOnboardingSeen());
    };

    const handleSkip = () => {
        handleComplete();
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <AnimatedFlatList
                ref={flatListRef}
                data={SLIDES}
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                renderItem={({ item, index }) => (
                    <Slide
                        slide={item}
                        index={index}
                        scrollX={scrollX}
                        width={width}
                    />
                )}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                keyExtractor={(item) => item.id}
            />

            <TouchableOpacity
                style={[styles.skipButton, { top: insets.top + 20 }]}
                onPress={handleSkip}
            >
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <View style={[styles.footer, { bottom: insets.bottom + 40 }]}>
                <Pagination scrollX={scrollX} width={width} />

                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <LinearGradient
                        colors={SLIDES[currentIndex].colors}
                        style={styles.nextButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                        <ChevronRight color="#FFFFFF" size={24} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 28,
        paddingHorizontal: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    paginationContainer: {
        flexDirection: 'row',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 5,
    },
    nextButton: {
        width: '100%',
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        ...theme.shadows.medium,
    },
    nextButtonGradient: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    skipButton: {
        position: 'absolute',
        top: 60,
        right: 30,
        zIndex: 10,
    },
    skipText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.8,
    },
});
