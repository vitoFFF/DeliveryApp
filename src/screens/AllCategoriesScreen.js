import React, { useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { theme } from '../utils/theme';

const CategoryItem = ({ category, onPress, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(30);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 30,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                delay: index * 30,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, [index, fadeAnim, slideAnim]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.92,
            useNativeDriver: true,
            speed: 30,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 30,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.itemWrapper,
                {
                    opacity: fadeAnim,
                    transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim }
                    ],
                }
            ]}
        >
            <TouchableOpacity
                style={styles.categoryCard}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.7}
            >
                <View style={styles.circleContainer}>
                    <Text style={styles.emoji}>{category.emoji}</Text>
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                    {category.name}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

export const AllCategoriesScreen = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { categories } = route.params || { categories: [] };

    const handleCategoryPress = (categoryId) => {
        // Navigate back to home and select the category
        navigation.navigate('RestaurantList', { selectedCategory: categoryId });
    };

    const renderCategory = ({ item, index }) => (
        <CategoryItem
            category={item}
            onPress={() => handleCategoryPress(item.id)}
            index={index}
        />
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={styles.container}>
                <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.columnWrapper}
                />
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
    listContent: {
        padding: theme.spacing.m,
        paddingBottom: theme.spacing.xl,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    itemWrapper: {
        width: '31%',
        marginBottom: theme.spacing.l,
        alignItems: 'center',
    },
    categoryCard: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    circleContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        marginBottom: 8,
        ...theme.shadows.small,
    },
    emoji: {
        fontSize: 36,
    },
    categoryName: {
        fontSize: 11,
        fontWeight: '600',
        color: theme.colors.text,
        textAlign: 'center',
        paddingHorizontal: 2,
    },
});
