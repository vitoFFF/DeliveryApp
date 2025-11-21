import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Title, Subheading, Button, TextInput, List, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { theme } from '../utils/theme';
import { seedDatabase } from '../utils/seedDatabase';

export const ProfileScreen = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [seeding, setSeeding] = useState(false);

    const handleSave = () => {
        // In a real app, dispatch an updateProfile action
        setIsEditing(false);
        // Mock update local state or show success
    };

    const handleSeedDatabase = async () => {
        setSeeding(true);
        const success = await seedDatabase();
        setSeeding(false);
        if (success) {
            Alert.alert('Success', 'Database seeded successfully!');
        } else {
            Alert.alert('Error', 'Failed to seed database. Check console for details.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Avatar.Text size={80} label={name.charAt(0) || 'U'} style={styles.avatar} />
                    {!isEditing ? (
                        <>
                            <Title>{name}</Title>
                            <Subheading>{email}</Subheading>
                            <Button mode="outlined" onPress={() => setIsEditing(true)} style={styles.button}>
                                Edit Profile
                            </Button>
                        </>
                    ) : (
                        <View style={styles.form}>
                            <TextInput
                                label="Name"
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                                mode="outlined"
                            />
                            <TextInput
                                label="Email"
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                mode="outlined"
                                disabled // Usually email is not editable easily
                            />
                            <View style={styles.buttonRow}>
                                <Button onPress={() => setIsEditing(false)} style={styles.button}>
                                    Cancel
                                </Button>
                                <Button mode="contained" onPress={handleSave} style={styles.button}>
                                    Save
                                </Button>
                            </View>
                        </View>
                    )}
                </View>

                <Divider style={styles.divider} />

                <List.Section>
                    <List.Subheader>Settings</List.Subheader>
                    <List.Item
                        title="Payment Methods"
                        left={(props) => <List.Icon {...props} icon="credit-card" />}
                        onPress={() => { }}
                    />
                    <List.Item
                        title="Addresses"
                        left={(props) => <List.Icon {...props} icon="map-marker" />}
                        onPress={() => { }}
                    />
                    <List.Item
                        title="Notifications"
                        left={(props) => <List.Icon {...props} icon="bell" />}
                        onPress={() => { }}
                    />
                    <Divider />
                    <List.Item
                        title="Seed Database (Dev Only)"
                        description="Overwrite Firebase with new schema"
                        left={(props) => <List.Icon {...props} icon="database-refresh" color={theme.colors.error} />}
                        onPress={handleSeedDatabase}
                        right={() => seeding && <Button loading>Seeding...</Button>}
                    />
                </List.Section>

                <View style={styles.footer}>
                    <Button mode="contained" color="red" onPress={() => dispatch(logoutUser())}>
                        Logout
                    </Button>
                </View>
            </ScrollView>
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
        backgroundColor: theme.colors.background,
    },
    header: {
        alignItems: 'center',
        padding: theme.spacing.l,
        backgroundColor: theme.colors.surface,
    },
    avatar: {
        backgroundColor: theme.colors.primary,
        marginBottom: theme.spacing.m,
    },
    form: {
        width: '100%',
    },
    input: {
        marginBottom: theme.spacing.s,
    },
    button: {
        marginTop: theme.spacing.s,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    divider: {
        marginVertical: theme.spacing.s,
    },
    footer: {
        padding: theme.spacing.l,
    },
});
