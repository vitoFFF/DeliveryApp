import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Text, ProgressBar, Button } from 'react-native-paper';
import { theme } from '../utils/theme';

const STATUS_STEPS = [
    { label: 'Order Placed', progress: 0.2 },
    { label: 'Preparing', progress: 0.5 },
    { label: 'Out for Delivery', progress: 0.8 },
    { label: 'Delivered', progress: 1.0 },
];

export const OrderStatusScreen = ({ route, navigation }) => {
    const { orderId } = route.params;
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
        <View style={styles.container}>
            <Title style={styles.title}>Order #{orderId}</Title>

            <View style={styles.statusContainer}>
                <Title style={styles.statusText}>{currentStatus.label}</Title>
                <ProgressBar progress={currentStatus.progress} color={theme.colors.primary} style={styles.progressBar} />
            </View>

            <View style={styles.infoContainer}>
                <Text>Your food is on the way!</Text>
                <Text>Estimated delivery: 15-20 mins</Text>
            </View>

            {statusIndex === STATUS_STEPS.length - 1 && (
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('HomeTab')}
                    style={styles.button}
                >
                    Back to Home
                </Button>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.l,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    statusContainer: {
        marginBottom: theme.spacing.xl,
    },
    statusText: {
        textAlign: 'center',
        marginBottom: theme.spacing.m,
        color: theme.colors.primary,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    button: {
        marginTop: theme.spacing.m,
    },
});
