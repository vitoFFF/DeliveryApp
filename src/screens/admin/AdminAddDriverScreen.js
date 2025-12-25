import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Surface, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { supabase } from '../../config/supabaseConfig';

export const AdminAddDriverScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        vehicleType: '',
        licenseNumber: '',
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const { name, email, phone, vehicleType, licenseNumber, password } = formData;
        if (!name.trim()) {
            Alert.alert('Error', 'Name is required');
            return false;
        }
        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Error', 'Valid email is required');
            return false;
        }
        if (!phone.trim()) {
            Alert.alert('Error', 'Phone number is required');
            return false;
        }
        if (!password.trim() || password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return false;
        }
        if (!vehicleType.trim()) {
            Alert.alert('Error', 'Vehicle type is required');
            return false;
        }
        if (!licenseNumber.trim()) {
            Alert.alert('Error', 'License number is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });
            if (authError) throw authError;

            const userId = authData.user.id;

            // Assign driver role
            const { error: roleError } = await supabase.rpc('assign_role_to_user', {
                p_user_id: userId,
                p_role: 'driver'
            });
            if (roleError) throw roleError;

            // Insert into drivers table
            const { error } = await supabase
                .from('drivers')
                .insert({
                    id: userId,
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    phone: formData.phone.trim(),
                    vehicle_type: formData.vehicleType.trim(),
                    license_number: formData.licenseNumber.trim(),
                });

            if (error) throw error;

            Alert.alert('Success', 'Driver added successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to add driver');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <MaterialCommunityIcons name="account-plus" size={32} color={theme.colors.primary} />
                    <Text style={styles.title}>Add New Driver</Text>
                    <Text style={styles.subtitle}>Enter driver information below</Text>
                </View>

                <Surface style={styles.formCard}>
                    <TextInput
                        label="Full Name"
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        style={styles.input}
                        mode="outlined"
                        left={<TextInput.Icon icon="account" />}
                    />

                    <TextInput
                        label="Email Address"
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        style={styles.input}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        left={<TextInput.Icon icon="email" />}
                    />

                    <TextInput
                        label="Phone Number"
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        style={styles.input}
                        mode="outlined"
                        keyboardType="phone-pad"
                        left={<TextInput.Icon icon="phone" />}
                    />

                    <TextInput
                        label="Password"
                        value={formData.password}
                        onChangeText={(value) => handleInputChange('password', value)}
                        style={styles.input}
                        mode="outlined"
                        secureTextEntry
                        left={<TextInput.Icon icon="lock" />}
                    />

                    <TextInput
                        label="Vehicle Type"
                        value={formData.vehicleType}
                        onChangeText={(value) => handleInputChange('vehicleType', value)}
                        style={styles.input}
                        mode="outlined"
                        placeholder="e.g. Motorcycle, Car, Van"
                        left={<TextInput.Icon icon="car" />}
                    />

                    <TextInput
                        label="License Number"
                        value={formData.licenseNumber}
                        onChangeText={(value) => handleInputChange('licenseNumber', value)}
                        style={styles.input}
                        mode="outlined"
                        autoCapitalize="characters"
                        left={<TextInput.Icon icon="card-account-details" />}
                    />
                </Surface>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        style={styles.cancelButton}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.submitButton}
                        loading={loading}
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Driver'}
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: theme.spacing.l,
        paddingBottom: theme.spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: theme.spacing.m,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    formCard: {
        padding: theme.spacing.l,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: 'white',
        ...theme.shadows.medium,
        marginBottom: theme.spacing.xl,
    },
    input: {
        marginBottom: theme.spacing.m,
        backgroundColor: 'transparent',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.m,
    },
    cancelButton: {
        flex: 1,
        borderColor: theme.colors.primary,
    },
    submitButton: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
});