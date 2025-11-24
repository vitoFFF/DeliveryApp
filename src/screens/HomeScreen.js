import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Image, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { RestaurantList } from '../components/RestaurantList';
import { HorizontalList } from '../components/HorizontalList';
import { SkeletonCard, SkeletonHorizontalCard, SkeletonCategory } from '../components/SkeletonLoader';
import { FilterChips } from '../components/FilterChips';
import { SpecialOffersHero } from '../components/SpecialOffersHero';
import { WeatherSection } from '../components/WeatherSection';
import { CollectionsGrid } from '../components/CollectionsGrid';
import { VerticalList } from '../components/VerticalList';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { theme } from '../utils/theme';

// Helper to get random items from an array
const getRandomItems = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedFilter, setSelectedFilter] = useState(null);
    const { categories, venues, products, loading, error } = useFirebaseData();

    const filters = ['Rating 4.5+', 'Under 30 min', 'Price < $10', 'Dietary'];

    const handleRestaurantPress = (restaurant) => {
        navigation.navigate('RestaurantDetail', { restaurant });
    };

    // Prepare categories with "All" option
    const allCategories = useMemo(() => {
        return [{ id: 'all', name: 'All', icon: 'apps', emoji: '🌟' }, ...categories];
    }, [categories]);

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
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

        if (selectedCategory && selectedCategory !== 'All' && selectedCategory !== 'all') {
            filtered = filtered.filter((venue) => venue.categoryId === selectedCategory);
        }

        return filtered;
    }, [searchQuery, selectedCategory, venues]);


    // Data for new sections
    // TODO: Implement real logic for these sections
    const mealsUnderX = useMemo(() => {
        if (!products || products.length === 0) return [];
        // Mock logic: just take some random products
        return getRandomItems(products, 6).map(p => ({ ...p, price: 9.99 })); // Force price for demo
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
            style={styles.horizontalCard}
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

    const renderProductCard = ({ item }) => {
        if (!item) return null;
        return (
            <TouchableOpacity style={styles.drinkCard}>
                <Image source={{ uri: item.image }} style={styles.drinkImage} />
                <View style={styles.drinkInfo}>
                    <Text style={styles.drinkName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.drinkPrice}>${item.price.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
                <View style={styles.container}>
                    <Header />
                    <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Skeleton Categories */}
                        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {[1, 2, 3, 4].map((i) => (
                                    <SkeletonCategory key={i} />
                                ))}
                            </ScrollView>
                        </View>

                        {/* Skeleton Horizontal Cards */}
                        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {[1, 2, 3].map((i) => (
                                    <SkeletonHorizontalCard key={i} />
                                ))}
                            </ScrollView>
                        </View>

                        {/* Skeleton Restaurant Cards */}
                        <View style={{ paddingHorizontal: 16 }}>
                            {[1, 2, 3].map((i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
                <View style={[styles.container, styles.centerContent]}>
                    <Text style={styles.errorText}>Failed to load data.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
            <View style={styles.container}>
                <Header />
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
                <FilterChips
                    filters={filters}
                    selectedFilter={selectedFilter}
                    onSelect={setSelectedFilter}
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <CategoryCarousel
                        categories={allCategories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                    />

                    {(selectedCategory === 'All' || selectedCategory === 'all') && !searchQuery ? (
                        <>
                            {/* 1. Special Offers (Hero Section) */}
                            <SpecialOffersHero onOfferPress={(offer) => console.log('Offer pressed:', offer)} />

                            {/* 2. Meals Under $10 */}
                            <HorizontalList
                                title="📉 Meals Under $10"
                                data={mealsUnderX}
                                renderItem={renderProductCard}
                            />

                            {/* 3. Based on Weather */}
                            <WeatherSection onFoodPress={(food) => console.log('Weather food pressed:', food)} />

                            {/* 4. Picked for You */}
                            <HorizontalList
                                title="✨ Picked for You"
                                data={pickedForYou}
                                renderItem={renderRestaurantCard}
                            />

                            {/* 5. Collections */}
                            <CollectionsGrid onCollectionPress={(collection) => console.log('Collection pressed:', collection)} />

                            {/* 6. Popular Now (Vertical List) */}
                            <VerticalList
                                title="👇 Popular Now"
                                data={popularNow}
                                onItemPress={handleRestaurantPress}
                            />
                        </>
                    ) : (
                        // Show standard list when searching or filtering by category
                        <RestaurantList
                            restaurants={filteredVenues}
                            onRestaurantPress={handleRestaurantPress}
                            markFirstAsFeatured={!searchQuery && selectedCategory === 'All'}
                        />
                    )}
                </ScrollView>
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
    scrollContent: {
        paddingBottom: theme.spacing.xl * 2, // More breathing room at bottom
        gap: 24, // Consistent vertical spacing between sections (Gestalt: Proximity)
    },
    horizontalCard: {
        width: 280,
        marginRight: theme.spacing.m,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        ...theme.shadows.small,
        overflow: 'hidden',
        marginBottom: theme.spacing.s, // For shadow
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
    loadingText: {
        marginTop: theme.spacing.m,
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
});

