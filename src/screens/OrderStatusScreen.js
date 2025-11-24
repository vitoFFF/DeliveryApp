import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from 'react-native-paper';
import { theme } from '../utils/theme';

const STATUS_STEPS = [
    { label: 'Order Placed', progress: 0.2 },
    { label: 'Preparing', progress: 0.5 },
    { label: 'Out for Delivery', progress: 0.8 },
    { label: 'Delivered', progress: 1.0 },
];

// Sample orders for demo
const SAMPLE_ORDERS = [
    { id: '12345', restaurant: 'Pizza Palace', status: 2, total: '$24.99' },
    { id: '12344', restaurant: 'Burger King', status: 3, total: '$18.50' },
    { id: '12343', restaurant: 'Sushi Express', status: 3, total: '$32.00' },
];

const OrderCard = ({ order, onPress }) => {
    const currentStatus = STATUS_STEPS[order.status];
    const isDelivered = order.status === STATUS_STEPS.length - 1;

    return (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <Text style={styles.orderTotal}>{order.total}</Text>
            </View>
            <Text style={styles.restaurantName}>{order.restaurant}</Text>
            <View style={styles.statusContainer}>
                <Text style={[
                    styles.statusText,
                    isDelivered && styles.deliveredText
                ]}>
                    {currentStatus.label}
                </Text>
                <ProgressBar
                    progress={currentStatus.progress}
                    color={isDelivered ? '#10B981' : theme.colors.primary}
                    style={styles.progressBar}
                />
            </View>
        </TouchableOpacity>
    );
};

export const OrderStatusScreen = ({ route, navigation }) => {
    const orderId = route?.params?.orderId;

    // If specific order ID, show detailed view
    if (orderId) {
        return <OrderDetailView orderId={orderId} navigation={navigation} />;
    }

    // Otherwise show orders list
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Your Orders</Text>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {SAMPLE_ORDERS.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onPress={() => navigation.navigate('Orders', { orderId: order.id })}
                        />
                    ))}

                    {SAMPLE_ORDERS.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>📦</Text>
                            <Text style={styles.emptyText}>No orders yet</Text>
                            <Text style={styles.emptySubtext}>Start ordering to see your history here</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

// Detailed view for specific order
const OrderDetailView = ({ orderId, navigation }) => {
    const [statusIndex, setStatusIndex] = useState(0);

    useEffect(() => {
        // Simulate real-time updates
        const interval = setInterval(() => {
            setStatusIndex((prev) => {
                if (prev < STATUS_STEPS.length - 1) {
                    return prev + 1;
                }
                clearInterval(interval);
                return prev;
            });
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const currentStatus = STATUS_STEPS[statusIndex];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Order #{orderId}</Text>

                <View style={styles.statusContainer}>
                    <Text style={styles.statusTextLarge}>{currentStatus.label}</Text>
                    <ProgressBar
                        progress={currentStatus.progress}
                        color={theme.colors.primary}
                        style={styles.progressBar}
                    />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Your food is on the way!</Text>
                    <Text style={styles.infoSubtext}>Estimated delivery: 15-20 mins</Text>
                </View>

                {statusIndex === STATUS_STEPS.length - 1 && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('HomeTab')}
                    >
                        <Text style={styles.buttonText}>Back to Home</Text>
                    </TouchableOpacity>
                )}
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
        paddingTop: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        paddingHorizontal: 16,
        marginBottom: 20,
        letterSpacing: -0.5,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 100, // Space for tab bar
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    restaurantName: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    statusContainer: {
        marginTop: 8,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.primary,
        marginBottom: 8,
    },
    deliveredText: {
        color: '#10B981',
    },
    statusTextLarge: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: 16,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
    },
    infoContainer: {
        alignItems: 'center',
        padding: 24,
        marginTop: 20,
    },
    infoText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    infoSubtext: {
        fontSize: 14,
        color: '#6B7280',
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6B7280',
    },
});
