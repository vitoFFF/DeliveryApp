import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Image, Text, TouchableOpacity, LayoutChangeEvent, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { CategoryResultsView } from '../components/CategoryResultsView';
import { HorizontalList } from '../components/HorizontalList';
import { SkeletonCard, SkeletonHorizontalCard, SkeletonCategory } from '../components/SkeletonLoader';
import { FilterChips } from '../components/FilterChips';
import { SpecialOffersHero } from '../components/SpecialOffersHero';
import { WeatherSection } from '../components/WeatherSection';
import { CollectionsGrid } from '../components/CollectionsGrid';
import { VerticalList } from '../components/VerticalList';
import { NearbyServices } from '../components/NearbyServices';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { theme } from '../utils/theme';
import { Button } from 'react-native-paper';

// Helper to get random items from an array
const getRandomItems = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export const HomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const { categories, venues, products, loading, error } = useFirebaseData();
    const { width: screenWidth } = useWindowDimensions();
    const dispatch = useDispatch();

    // Responsive dimensions
    const cardWidth = Math.min(screenWidth * 0.75, 350); // 75% quite standard, max 350 for tablets
    const drinkCardWidth = Math.min(screenWidth * 0.45, 200); // Smaller cards

    // Animation Values
    const scrollY = useSharedValue(0);
    const [headerHeight, setHeaderHeight] = useState(60); // Default guess
    const [stickyHeight, setStickyHeight] = useState(120); // Search + Filter guess

    // Reset category when home tab is pressed
    useFocusEffect(
        React.useCallback(() => {
            setSelectedCategory(null);
        }, [])
    );

    const filters = [t('filters.rating'), t('filters.time'), t('filters.price'), t('filters.dietary')];

    const handleRestaurantPress = (restaurant) => {
        navigation.navigate('RestaurantDetail', { restaurant });
    };

    const handleSeeAllCategories = () => {
        navigation.navigate('AllCategories', { categories });
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleClearCategory = () => {
        setSelectedCategory(null);
    };

    const filteredVenues = useMemo(() => {
        let filtered = venues;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (venue) =>
                    venue.name.toLowerCase().includes(query) ||
                    (venue.categories && venue.categories.some((cat) => cat.toLowerCase().includes(query)))
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter((venue) => venue.categoryId === selectedCategory);
        }

        return filtered;
    }, [searchQuery, selectedCategory, venues]);


    // Data for new sections
    const mealsUnderX = useMemo(() => {
        if (!products || products.length === 0) return [];
        return getRandomItems(products, 6).map(p => ({ ...p, price: 9.99 }));
    }, [products]);

    const pickedForYou = useMemo(() => {
        if (!venues || venues.length === 0) return [];
        return getRandomItems(venues, 5);
    }, [venues]);

    const popularNow = useMemo(() => {
        if (!venues || venues.length === 0) return [];
        return getRandomItems(venues, 5);
    }, [venues]);


    const renderRestaurantCard = ({ item }) => (
        <TouchableOpacity
            style={[styles.horizontalCard, { width: cardWidth }]}
            onPress={() => handleRestaurantPress(item)}
        >
            <Image source={{ uri: item.image }} style={styles.horizontalImage} />
            {item.discount && (
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{item.discount}</Text>
                </View>
            )}
            <View style={styles.horizontalInfo}>
                <Text style={styles.horizontalName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.horizontalMeta}>
                    {item.rating} ★ • {item.deliveryTime}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const handleAddToCart = (product) => {
        dispatch(addToCart({ menuItem: product, restaurantId: product.restaurantId }));
    };

    const renderProductCard = ({ item }) => {
        if (!item) return null;
        return (
            <View style={[styles.drinkCard, { width: drinkCardWidth }]}>
                <Image source={{ uri: item.image }} style={styles.drinkImage} />
                <View style={styles.drinkInfo}>
                    <Text style={styles.drinkName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.drinkPrice}>${item.price.toFixed(2)}</Text>
                </View>
                <Button
                    mode="contained"
                    compact
                    style={styles.addBtn}
                    onPress={() => handleAddToCart(item)}
                >
                    Add
                </Button>
            </View>
        );
    };

    // Scroll Handler
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollY.value,
                        [0, headerHeight],
                        [0, -headerHeight],
                        Extrapolate.CLAMP
                    ),
                },
            ],
        };
    });

    // Measurement handlers
    const onHeaderLayout = (e) => {
        setHeaderHeight(e.nativeEvent.layout.height);
    };

    const onStickyLayout = (e) => {
        setStickyHeight(e.nativeEvent.layout.height);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
                {/* Replicate structure even in loading for consistency, or just simplified loader */}
                <View style={styles.container}>
                    <Header />
                    <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
                    <View style={{ paddingHorizontal: 16 }}>
                        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.container, styles.centerContent]}>
                    <Text style={styles.errorText}>{t('common.failed_to_load')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
            <View style={styles.container}>

                {/* Collapsible Header Container */}
                <Animated.View
                    style={[
                        styles.fixedHeaderContainer,
                        headerAnimatedStyle,
                        { zIndex: 100 } // Ensure it stays on top
                    ]}
                >
                    {/* Glassmorphism Background */}
                    <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />

                    <View onLayout={onHeaderLayout} style={styles.collapsiblePart}>
                        <Header />
                    </View>
                    <View onLayout={onStickyLayout} style={styles.stickyPart}>
                        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
                        <FilterChips
                            filters={filters}
                            selectedFilter={selectedFilter}
                            onSelect={setSelectedFilter}
                        />
                    </View>
                </Animated.View>

                {/* Main Scroll Content */}
                <Animated.ScrollView
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingTop: headerHeight + stickyHeight + 16 } // Add padding for absolute header
                    ]}
                >
                    <CategoryCarousel
                        categories={categories.slice(0, 6)}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                        onSeeMore={handleSeeAllCategories}
                    />

                    {!selectedCategory && !searchQuery ? (
                        <>
                            <SpecialOffersHero onOfferPress={(offer) => console.log('Offer pressed:', offer)} />

                            <NearbyServices />

                            <HorizontalList
                                title={t('home.meals_under')}
                                data={mealsUnderX}
                                renderItem={renderProductCard}
                            />

                            <WeatherSection onFoodPress={(food) => console.log('Weather food pressed:', food)} />

                            <HorizontalList
                                title={t('home.picked_for_you')}
                                data={pickedForYou}
                                renderItem={renderRestaurantCard}
                            />

                            <CollectionsGrid onCollectionPress={(collection) => console.log('Collection pressed:', collection)} />

                            <VerticalList
                                title={t('home.popular_now')}
                                data={popularNow}
                                onItemPress={handleRestaurantPress}
                            />
                        </>
                    ) : (
                        <CategoryResultsView
                            category={categories.find(cat => cat.id === selectedCategory)}
                            restaurants={filteredVenues}
                            onClearFilter={handleClearCategory}
                            onRestaurantPress={handleRestaurantPress}
                        />
                    )}
                </Animated.ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
    },
    fixedHeaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent', // Make transparent for BlurView
    },
    collapsiblePart: {
        // Wrapper for header
        zIndex: 1,
    },
    stickyPart: {
        // Wrapper for search + filters
        backgroundColor: 'transparent', // Transparent to let BlurView show
        paddingBottom: 8,
        shadowColor: "#000", // Optional: Add a subtle shadow when stuck
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    scrollContent: {
        paddingBottom: theme.spacing.xl * 2,
        gap: 24,
    },
    horizontalCard: {
        width: 280,
        marginRight: theme.spacing.m,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        ...theme.shadows.small,
        overflow: 'hidden',
        marginBottom: theme.spacing.s,
    },
    horizontalImage: {
        width: '100%',
        height: 150,
    },
    horizontalInfo: {
        padding: theme.spacing.m,
    },
    horizontalName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    horizontalMeta: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    discountBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    discountText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    drinkCard: {
        width: 160,
        marginRight: theme.spacing.m,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        ...theme.shadows.small,
        padding: theme.spacing.s,
        marginBottom: theme.spacing.s,
    },
    drinkImage: {
        width: '100%',
        height: 120,
        borderRadius: theme.borderRadius.s,
        marginBottom: theme.spacing.s,
    },
    drinkInfo: {
        alignItems: 'center',
    },
    drinkName: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    drinkPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: theme.colors.error,
    },
    addBtn: {
        marginTop: 8,
    },
});

