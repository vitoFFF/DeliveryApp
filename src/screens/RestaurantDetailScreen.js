import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Title, Text, Button, ActivityIndicator, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useVenueProducts } from '../hooks/useFirebaseData';
import { addToCart } from '../store/cartSlice';
import { theme } from '../utils/theme';

export const RestaurantDetailScreen = ({ route, navigation }) => {
    const { restaurant } = route.params;
    const { products: menu, loading, error } = useVenueProducts(restaurant.id);
    const dispatch = useDispatch();

    const handleAddToCart = (item) => {
        dispatch(addToCart({ menuItem: item, restaurantId: restaurant.id }));
    };

    const renderItem = ({ item }) => (
        <View style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.menuImage} />
            <View style={styles.menuInfo}>
                <Title style={styles.menuName}>{item.name}</Title>
                <Text numberOfLines={2} style={styles.menuDesc}>{item.description}</Text>
                <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <Button
                mode="contained"
                compact
                onPress={() => handleAddToCart(item)}
            >
                Add
            </Button>
        </View>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.centerState}>
                    <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
                    <Text style={styles.centerText}>Loading menu...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerState}>
                    <Text style={styles.errorText}>Failed to load menu.</Text>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={menu}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={Divider}
                ListEmptyComponent={
                    <View style={styles.centerState}>
                        <Text>No products found for this venue.</Text>
                    </View>
                }
            />
        );
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
            <View style={styles.headerInfo}>
                <Title>{restaurant.name}</Title>
                <Text>{(restaurant.categories || []).join(', ')} • {restaurant.rating} ★</Text>
            </View>
            <Divider />
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerImage: {
        width: '100%',
        height: 200,
    },
    headerInfo: {
        padding: theme.spacing.m,
        backgroundColor: theme.colors.surface,
    },
    list: {
        padding: theme.spacing.m,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.m,
    },
    menuImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: theme.spacing.m,
    },
    menuInfo: {
        flex: 1,
        marginRight: theme.spacing.s,
    },
    menuName: {
        fontSize: 16,
    },
    menuDesc: {
        fontSize: 12,
        color: '#666',
    },
    menuPrice: {
        marginTop: 4,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    centerState: {
        padding: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    centerText: {
        marginTop: theme.spacing.m,
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    errorText: {
        color: theme.colors.error,
        textAlign: 'center',
        marginBottom: theme.spacing.s,
    },
});