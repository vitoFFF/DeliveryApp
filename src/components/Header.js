import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, ChevronDown } from 'lucide-react-native';
import { theme } from '../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

export const Header = () => {
    const [address, setAddress] = useState('Planet Earth, Milky Way 🚀');
    const [isLoading, setIsLoading] = useState(true);

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

                    <TouchableOpacity style={styles.profileButton}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>VK</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};

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
    }
});
