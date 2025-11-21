import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { theme } from '../utils/theme';

export const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    const handleRegister = () => {
        setValidationError('');

        if (!name || !email || !password || !confirmPassword) {
            setValidationError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setValidationError('Password must be at least 6 characters');
            return;
        }

        dispatch(registerUser({ email, password, name }));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                autoCapitalize="words"
            />

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />

            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry
            />

            {validationError ? <Text style={styles.error}>{validationError}</Text> : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
                title={isLoading ? "Creating Account..." : "Register"}
                onPress={handleRegister}
                disabled={isLoading}
            />

            <View style={styles.loginContainer}>
                <Text>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
    error: {
        color: 'red',
        marginBottom: theme.spacing.s,
        textAlign: 'center',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.l,
    },
    loginLink: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
});
