import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Animated, Easing } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { theme } from '../utils/theme';
import { CreditCard, CheckCircle } from 'lucide-react-native';

export const PaymentSimulationOverlay = ({ visible, onComplete }) => {
    const [status, setStatus] = useState('processing');
    const scaleAnim = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            setStatus('processing');
            // Simulate processing time
            const timer = setTimeout(() => {
                setStatus('success');
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7
                }).start();

                // Finalize after success animation
                setTimeout(onComplete, 2000);
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            scaleAnim.setValue(0);
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    {status === 'processing' ? (
                        <>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <CreditCard size={48} color={theme.colors.primary} style={styles.icon} />
                            <Text style={styles.text}>Simulating Card Payment...</Text>
                            <Text style={styles.subtext}>This is a free test transaction</Text>
                        </>
                    ) : (
                        <Animated.View style={[styles.successContainer, { transform: [{ scale: scaleAnim }] }]}>
                            <CheckCircle size={64} color="#4CAF50" />
                            <Text style={styles.successText}>Payment Successful!</Text>
                            <Text style={styles.subtext}>Order confirmed</Text>
                        </Animated.View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        elevation: 10,
    },
    icon: {
        marginVertical: 20,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.colors.text,
    },
    subtext: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: 10,
        textAlign: 'center',
    },
    successContainer: {
        alignItems: 'center',
    },
    successText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 20,
    }
});
