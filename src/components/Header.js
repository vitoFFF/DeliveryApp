import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, ChevronDown } from 'lucide-react-native';
import { theme } from '../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const Header = () => {
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
                            <Text style={styles.locationText}>Home, 123 Main St</Text>
                            <ChevronDown size={16} color={theme.colors.text} />
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
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 4,
        fontWeight: '500',
    },
    locationSelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 4,
    },
    locationText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginRight: 4,
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
