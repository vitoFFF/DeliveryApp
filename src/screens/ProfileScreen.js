import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Title, Subheading, Button, TextInput, List, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logoutUser } from '../store/authSlice';
import { theme } from '../utils/theme';
import { seedSupabase } from '../utils/seedSupabase';

export const ProfileScreen = () => {
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [seeding, setSeeding] = useState(false);

    const handleSave = () => {
        // In a real app, dispatch an updateProfile action
        setIsEditing(false);
    };

    const handleSeed = async () => {
        setSeeding(true);
        const success = await seedSupabase();
        setSeeding(false);
        if (success) {
            Alert.alert('Success', 'Data uploaded to Supabase!');
        } else {
            Alert.alert('Error', 'Failed to upload data.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.header}>
                    <Avatar.Text size={80} label={name.charAt(0) || 'U'} style={styles.avatar} />
                    {!isEditing ? (
                        <>
                            <Title>{name}</Title>
                            <Subheading>{email}</Subheading>
                            <Button mode="outlined" onPress={() => setIsEditing(true)} style={styles.button}>
                                {t('profile.edit_profile')}
                            </Button>
                        </>
                    ) : (
                        <View style={styles.form}>
                            <TextInput
                                label={t('profile.name')}
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                                mode="outlined"
                            />
                            <TextInput
                                label={t('profile.email')}
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                mode="outlined"
                                disabled
                            />
                            <View style={styles.buttonRow}>
                                <Button onPress={() => setIsEditing(false)} style={styles.button}>
                                    {t('common.cancel')}
                                </Button>
                                <Button mode="contained" onPress={handleSave} style={styles.button}>
                                    {t('common.save')}
                                </Button>
                            </View>
                        </View>
                    )}
                </View>

                <Divider style={styles.divider} />

                <List.Section>
                    <List.Subheader>{t('profile.settings')}</List.Subheader>
                    <List.Item
                        title={t('profile.payment_methods')}
                        left={(props) => <List.Icon {...props} icon="credit-card" />}
                        onPress={() => { }}
                    />
                    <List.Item
                        title={t('profile.addresses')}
                        left={(props) => <List.Icon {...props} icon="map-marker" />}
                        onPress={() => { }}
                    />
                    <List.Item
                        title={t('profile.notifications')}
                        left={(props) => <List.Icon {...props} icon="bell" />}
                        onPress={() => { }}
                    />
                    <Divider />
                    <List.Item
                        title="Upload Mock Data to Supabase"
                        description="One-time setup"
                        left={(props) => <List.Icon {...props} icon="cloud-upload" color={theme.colors.primary} />}
                        onPress={handleSeed}
                        right={() => seeding && <Button loading>Uploading...</Button>}
                    />
                </List.Section>

                <View style={styles.footer}>
                    <Button mode="contained" color="red" onPress={() => dispatch(logoutUser())}>
                        {t('profile.logout')}
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
