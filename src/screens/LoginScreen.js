import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as LocalAuthentication from 'expo-local-authentication';
import { loginUser } from '../store/authSlice';
import { theme } from '../utils/theme';
import { TextInput, Button, Text, Title, Surface, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const LoginScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);
    const paperTheme = useTheme();

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
            handleLogin();
        }
    };

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
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
                            <MaterialCommunityIcons name="chef-hat" size={60} color={theme.colors.primary} />
                        </View>
                        <Title style={styles.title}>{t('auth.login')}</Title>
                        <Text style={styles.subtitle}>{t('common.welcome')}</Text>
                    </View>

                    <Surface style={styles.formSurface}>
                        <TextInput
                            label={t('auth.email')}
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
                            label={t('auth.password')}
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

                        {error && (
                            <View style={styles.errorContainer}>
                                <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.error} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            loading={isLoading}
                            disabled={isLoading}
                            style={styles.loginButton}
                            contentStyle={styles.loginButtonContent}
                            labelStyle={styles.loginButtonLabel}
                        >
                            {t('auth.sign_in')}
                        </Button>

                        <TouchableOpacity onPress={authenticateBiometric} style={styles.biometricButton}>
                            <MaterialCommunityIcons name="fingerprint" size={30} color={theme.colors.primary} />
                            <Text style={styles.biometricText}>Use Biometrics</Text>
                        </TouchableOpacity>
                    </Surface>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{t('auth.no_account')} </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.registerLink}>{t('auth.register')}</Text>
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
        width: 100,
        height: 100,
        borderRadius: 50,
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
        backgroundColor: '#FFEBEE', // Light red background
        borderRadius: theme.borderRadius.s,
    },
    errorText: {
        color: theme.colors.error,
        marginLeft: theme.spacing.s,
        flex: 1,
    },
    loginButton: {
        marginTop: theme.spacing.s,
        borderRadius: theme.borderRadius.m,
        backgroundColor: theme.colors.primary,
    },
    loginButtonContent: {
        height: 50,
    },
    loginButtonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    biometricButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.l,
    },
    biometricText: {
        marginLeft: theme.spacing.s,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xl,
    },
    footerText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
    },
    registerLink: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});