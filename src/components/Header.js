import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { MapPin, ChevronDown, Settings, X, CreditCard, History, User, Bell, Shield, ChevronRight, CloudSun, LogOut } from 'lucide-react-native';
import { theme } from '../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import { Switch } from 'react-native';
import LanguageSelector from './LanguageSelector';

export const Header = () => {
    const [address, setAddress] = useState('Planet Earth, Milky Way 🚀');
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isWeatherThemeEnabled, setIsWeatherThemeEnabled] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const getAddress = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    if (isMounted) {
                        setAddress('Planet Earth, Milky Way 🚀');
                        setIsLoading(false);
                    }
                    return;
                }

                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                const reverseGeocode = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });

                if (reverseGeocode && reverseGeocode.length > 0 && isMounted) {
                    const addr = reverseGeocode[0];
                    // Short form: Prefer street name, fallback to city/district
                    const shortAddress = addr.street || addr.name || addr.city || addr.district || 'Planet Earth 🚀';
                    setAddress(shortAddress);
                }
            } catch (error) {
                console.log('Error getting address:', error);
                if (isMounted) setAddress('Planet Earth 🚀');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        getAddress();

        return () => { isMounted = false; };
    }, []);

    return (
        <View style={styles.wrapper}>
            <LinearGradient
                colors={['#FFFFFF', '#F9FAFB']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <View style={styles.container}>
                    <View style={styles.locationContainer}>
                        <Text style={styles.deliverToText}>Deliver to</Text>
                        <TouchableOpacity style={styles.locationSelector}>
                            <MapPin size={16} color={theme.colors.primary} style={styles.icon} />
                            <Text style={styles.locationText} numberOfLines={1}>
                                {isLoading ? 'Locating...' : address}
                            </Text>
                            <ChevronDown size={14} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => setIsMenuOpen(true)}
                    >
                        <View style={styles.avatarContainer}>
                            <Settings size={20} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isMenuOpen}
                    onRequestClose={() => setIsMenuOpen(false)}
                >
                    <BlurView intensity={30} style={styles.modalOverlay}>
                        <Pressable
                            style={styles.modalOverlayTap}
                            onPress={() => setIsMenuOpen(false)}
                        />
                        <View style={styles.modalContent}>
                            <View style={styles.modalHandle} />

                            <View style={styles.modalHeader}>
                                <View>
                                    <Text style={styles.modalTitle}>Settings</Text>
                                    <Text style={styles.modalSubtitle}>Manage your account and preferences</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setIsMenuOpen(false)}
                                    style={styles.closeButton}
                                >
                                    <X size={24} color={theme.colors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuScroll}>
                                <Text style={styles.sectionTitle}>Account</Text>
                                <View style={styles.section}>
                                    <MenuItem
                                        icon={User}
                                        label="Personal Information"
                                        subtitle="Name, email, and phone number"
                                    />
                                    <MenuItem
                                        icon={CreditCard}
                                        label="Payment Methods"
                                        subtitle="Cards, wallets, and more"
                                    />
                                    <MenuItem
                                        icon={History}
                                        label="Order History"
                                        subtitle="Your past and current orders"
                                    />
                                </View>

                                <Text style={styles.sectionTitle}>Preferences</Text>
                                <View style={styles.section}>
                                    <View style={styles.menuItem}>
                                        <View style={styles.menuIconContainer}>
                                            <CloudSun size={18} color={theme.colors.primary} />
                                        </View>
                                        <View style={styles.menuTextContainer}>
                                            <Text style={styles.menuLabel}>Real-time Theme</Text>
                                            <Text style={styles.menuSubtitle}>Adapts to local weather</Text>
                                        </View>
                                        <Switch
                                            value={isWeatherThemeEnabled}
                                            onValueChange={setIsWeatherThemeEnabled}
                                            trackColor={{ false: '#D1D5DB', true: theme.colors.primaryLight }}
                                            thumbColor={isWeatherThemeEnabled ? theme.colors.primary : '#F4F3F4'}
                                        />
                                    </View>
                                    <LanguageSelector />
                                    <MenuItem
                                        icon={Bell}
                                        label="Notifications"
                                        subtitle="Push, email, and SMS"
                                    />
                                    <MenuItem
                                        icon={Shield}
                                        label="Privacy & Security"
                                        subtitle="Password and data"
                                    />
                                </View>

                                <TouchableOpacity style={styles.signOutButton}>
                                    <LogOut size={18} color={theme.colors.error} />
                                    <Text style={styles.signOutText}>Sign Out</Text>
                                </TouchableOpacity>

                                <View style={styles.footer}>
                                    <Text style={styles.versionText}>Version 1.0.0 (Build 42)</Text>
                                </View>
                            </ScrollView>
                        </View>
                    </BlurView>
                </Modal>
            </LinearGradient>
        </View>
    );
};

const MenuItem = ({ icon: Icon, label, subtitle }) => (
    <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuIconContainer}>
            <Icon size={18} color={theme.colors.primary} />
        </View>
        <View style={styles.menuTextContainer}>
            <Text style={styles.menuLabel}>{label}</Text>
            {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        <ChevronRight size={16} color="#D1D5DB" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    wrapper: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        overflow: 'hidden',
    },
    gradient: {
        paddingTop: 8,
        paddingBottom: 12,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    locationContainer: {
        flex: 1,
    },
    deliverToText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginBottom: 4,
        fontWeight: '600',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    locationSelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 4,
    },
    locationText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1F2937',
        marginRight: 4,
        letterSpacing: -0.2,
        textShadowColor: 'rgba(0, 0, 0, 0.05)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    profileButton: {
        padding: 4,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end', // Slide from bottom feel
    },
    modalOverlayTap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 12,
        paddingHorizontal: 24,
        paddingBottom: 40,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    closeButton: {
        backgroundColor: '#F3F4F6',
        padding: 8,
        borderRadius: 12,
    },
    menuScroll: {
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginTop: 8,
    },
    section: {
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 4,
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'transparent',
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        marginTop: 8,
        gap: 8,
    },
    signOutText: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.error,
    },
    footer: {
        alignItems: 'center',
        marginTop: 32,
    },
    versionText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    }
});
