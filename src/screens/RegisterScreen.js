import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { theme } from '../utils/theme';
import { TextInput, Button, Text, Title, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.headerContainer}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="account-plus" size={50} color={theme.colors.primary} />
                        </View>
                        <Title style={styles.title}>Create Account</Title>
                        <Text style={styles.subtitle}>Join us and start ordering today</Text>
                    </View>

                    <Surface style={styles.formSurface}>
                        <TextInput
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            mode="outlined"
                            autoCapitalize="words"
                            left={<TextInput.Icon icon="account" color={theme.colors.textSecondary} />}
                            theme={{ colors: { primary: theme.colors.primary } }}
                        />

                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            mode="outlined"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            left={<TextInput.Icon icon="email" color={theme.colors.textSecondary} />}
                            theme={{ colors: { primary: theme.colors.primary } }}
                        />

                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            secureTextEntry={!showPassword}
                            mode="outlined"
                            left={<TextInput.Icon icon="lock" color={theme.colors.textSecondary} />}
                            right={
                                <TextInput.Icon
                                    icon={showPassword ? "eye-off" : "eye"}
                                    onPress={() => setShowPassword(!showPassword)}
                                    color={theme.colors.textSecondary}
                                />
                            }
                            theme={{ colors: { primary: theme.colors.primary } }}
                        />

                        <TextInput
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={styles.input}
                            secureTextEntry={!showConfirmPassword}
                            mode="outlined"
                            left={<TextInput.Icon icon="lock-check" color={theme.colors.textSecondary} />}
                            right={
                                <TextInput.Icon
                                    icon={showConfirmPassword ? "eye-off" : "eye"}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    color={theme.colors.textSecondary}
                                />
                            }
                            theme={{ colors: { primary: theme.colors.primary } }}
                        />

                        {(validationError || error) && (
                            <View style={styles.errorContainer}>
                                <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.error} />
                                <Text style={styles.errorText}>{validationError || error}</Text>
                            </View>
                        )}

                        <Button
                            mode="contained"
                            onPress={handleRegister}
                            loading={isLoading}
                            disabled={isLoading}
                            style={styles.registerButton}
                            contentStyle={styles.registerButtonContent}
                            labelStyle={styles.registerButtonLabel}
                        >
                            Register
                        </Button>
                    </Surface>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        flexGrow: 1,
        padding: theme.spacing.l,
        justifyContent: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
        ...theme.shadows.medium,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    formSurface: {
        padding: theme.spacing.l,
        borderRadius: theme.borderRadius.l,
        backgroundColor: theme.colors.surface,
        ...theme.shadows.small,
    },
    input: {
        marginBottom: theme.spacing.m,
        backgroundColor: theme.colors.surface,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
        padding: theme.spacing.s,
        backgroundColor: '#FFEBEE',
        borderRadius: theme.borderRadius.s,
    },
    errorText: {
        color: theme.colors.error,
        marginLeft: theme.spacing.s,
        flex: 1,
    },
    registerButton: {
        marginTop: theme.spacing.s,
        borderRadius: theme.borderRadius.m,
        backgroundColor: theme.colors.primary,
    },
    registerButtonContent: {
        height: 50,
    },
    registerButtonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
    },
    footerText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
    },
    loginLink: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
