import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, ChevronDown, Bell } from 'lucide-react-native';
import { theme } from '../utils/theme';

export const Header = () => {
    return (
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
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.s,
        backgroundColor: theme.colors.background,
    },
    locationContainer: {
        flex: 1,
    },
    deliverToText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 2,
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
        fontWeight: 'bold',
        color: theme.colors.text,
        marginRight: 4,
    },
    profileButton: {
        padding: 4,
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});
