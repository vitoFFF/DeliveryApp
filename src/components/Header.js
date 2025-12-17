import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MapPin, ChevronDown, Settings, X, CreditCard, History, User, Bell, Shield } from 'lucide-react-native';
import { theme } from '../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

export const Header = () => {
    const [address, setAddress] = useState('Planet Earth, Milky Way 🚀');
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                    animationType="fade"
                    transparent={true}
                    visible={isMenuOpen}
                    onRequestClose={() => setIsMenuOpen(false)}
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setIsMenuOpen(false)}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Settings</Text>
                                <TouchableOpacity
                                    onPress={() => setIsMenuOpen(false)}
                                    style={styles.closeButton}
                                >
                                    <X size={20} color={theme.colors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.menuList}>
                                <MenuItem icon={User} label="Profile" />
                                <MenuItem icon={CreditCard} label="Payment Methods" />
                                <MenuItem icon={History} label="Order History" />
                                <MenuItem icon={Bell} label="Notifications" />
                                <MenuItem icon={Shield} label="Privacy & Security" />
                            </View>

                            <View style={styles.comingSoonBadge}>
                                <Text style={styles.comingSoonText}>✨ Features Coming Soon ✨</Text>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            </LinearGradient>
        </View>
    );
};

const MenuItem = ({ icon: Icon, label }) => (
    <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuIconContainer}>
            <Icon size={18} color={theme.colors.primary} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    wrapper: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
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
    avatarText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingRight: 16,
    },
    modalContent: {
        width: 240,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
    },
    closeButton: {
        padding: 4,
    },
    menuList: {
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    comingSoonBadge: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingVertical: 8,
        alignItems: 'center',
    },
    comingSoonText: {
        fontSize: 11,
        fontWeight: '700',
        color: theme.colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    }
});
