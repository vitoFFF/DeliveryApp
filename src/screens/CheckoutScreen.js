import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Text, Button, TextInput, RadioButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartTotal, clearCart, selectCartItems } from '../store/cartSlice';
import { api } from '../api/client';
import { theme } from '../utils/theme';
import { PaymentSimulationOverlay } from '../components/PaymentSimulationOverlay';

export const CheckoutScreen = ({ navigation }) => {
    const total = useSelector(selectCartTotal);
    const cartItems = useSelector(selectCartItems);
    const dispatch = useDispatch();
    const [address, setAddress] = useState('123 Main St, City');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [showSimulation, setShowSimulation] = useState(false);

    const handlePlaceOrder = async () => {
        if (paymentMethod === 'card') {
            setShowSimulation(true);
        } else {
            submitOrder();
        }
    };

    const submitOrder = async () => {
        setLoading(true);
        try {
            const result = await api.placeOrder({
                items: cartItems,
                total,
                address,
                paymentMethod,
            });

            if (result.success) {
                dispatch(clearCart());
                Alert.alert('Success', 'Order placed successfully!', [
                    { text: 'OK', onPress: () => navigation.navigate('OrderStatus', { orderId: result.orderId }) }
                ]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to place order');
        } finally {
            setLoading(false);
            setShowSimulation(false);
        }
    };

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Checkout</Title>

            <View style={styles.section}>
                <Text style={styles.label}>Delivery Address</Text>
                <TextInput
                    value={address}
                    onChangeText={setAddress}
                    mode="outlined"
                    multiline
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Payment Method</Text>
                <RadioButton.Group onValueChange={setPaymentMethod} value={paymentMethod}>
                    <View style={styles.radioRow}>
                        <RadioButton value="card" />
                        <Text>Credit Card</Text>
                    </View>
                    <View style={styles.radioRow}>
                        <RadioButton value="cash" />
                        <Text>Cash on Delivery</Text>
                    </View>
                </RadioButton.Group>
            </View>

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Title>Total to Pay:</Title>
                    <Title>${total.toFixed(2)}</Title>
                </View>
                <Button
                    mode="contained"
                    onPress={handlePlaceOrder}
                    loading={loading}
                    style={styles.button}
                >
                    Place Order
                </Button>
            </View>

            <PaymentSimulationOverlay
                visible={showSimulation}
                onComplete={submitOrder}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.m,
        backgroundColor: theme.colors.background,
    },
    title: {
        marginBottom: theme.spacing.l,
        textAlign: 'center',
    },
    section: {
        marginBottom: theme.spacing.l,
    },
    label: {
        marginBottom: theme.spacing.s,
        fontWeight: 'bold',
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footer: {
        marginTop: 'auto',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.m,
    },
    button: {
        paddingVertical: 6,
    },
});
