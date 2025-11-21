import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as LocalAuthentication from 'expo-local-authentication';
import { loginUser } from '../store/authSlice';
import { theme } from '../utils/theme';

export const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('password123');
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        checkBiometrics();
    }, []);

    const checkBiometrics = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (hasHardware && isEnrolled) {
            authenticateBiometric();
        }
    };

    const authenticateBiometric = async () => {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login with Biometrics',
        });
        if (result.success) {
            // In a real app, you'd retrieve credentials from SecureStore here
            // For now, we'll just auto-fill/login with mock data
            handleLogin();
        }
    };

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button
                title={isLoading ? "Logging in..." : "Login"}
                onPress={handleLogin}
                disabled={isLoading}
            />
            <View style={styles.biometricButton}>
                <Button title="Use Biometrics" onPress={authenticateBiometric} />
            </View>

            <View style={styles.registerContainer}>
                <Text>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerLink}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.l,
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
    },
    title: {
        fontSize: 24,
        marginBottom: theme.spacing.xl,
        textAlign: 'center',
        color: theme.colors.primary,
    },
    input: {
        marginBottom: theme.spacing.m,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    biometricButton: {
        marginTop: theme.spacing.m,
    },
    error: {
        color: 'red',
        marginBottom: theme.spacing.s,
        textAlign: 'center',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.l,
    },
    registerLink: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
});
