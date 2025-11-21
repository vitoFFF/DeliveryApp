import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Title, Text, Button, List, Divider, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice';
import { theme } from '../utils/theme';

export const CartScreen = ({ navigation }) => {
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const dispatch = useDispatch();

    const renderItem = ({ item }) => (
        <List.Item
            title={item.menuItem.name}
            description={`$${item.menuItem.price} x ${item.quantity}`}
            left={(props) => <List.Icon {...props} icon="food" />}
            right={(props) => (
                <IconButton
                    {...props}
                    icon="delete"
                    onPress={() => dispatch(removeFromCart({ menuItemId: item.menuItem.id }))}
                />
            )}
        />
    );

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Title>Your Cart is Empty</Title>
                <Button mode="contained" onPress={() => navigation.navigate('HomeTab')} style={styles.button}>
                    Browse Restaurants
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Your Cart</Title>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.menuItem.id}
                ItemSeparatorComponent={Divider}
                contentContainerStyle={styles.list}
            />
            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Title>Total:</Title>
                    <Title>${total.toFixed(2)}</Title>
                </View>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Checkout')}
                    style={styles.checkoutButton}
                >
                    Proceed to Checkout
                </Button>
                <Button onPress={() => dispatch(clearCart())} style={styles.clearButton} color="red">
                    Clear Cart
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        padding: theme.spacing.m,
        textAlign: 'center',
    },
    list: {
        flexGrow: 1,
    },
    footer: {
        padding: theme.spacing.m,
        backgroundColor: theme.colors.surface,
        elevation: 8,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.m,
    },
    checkoutButton: {
        paddingVertical: 6,
    },
    clearButton: {
        marginTop: theme.spacing.s,
    },
    button: {
        marginTop: theme.spacing.m,
    },
});
