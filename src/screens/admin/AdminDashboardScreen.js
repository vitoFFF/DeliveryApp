import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Text, Surface, useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoutUser } from '../../store/authSlice';
import { theme } from '../../utils/theme';

export const AdminDashboardScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const menuItems = [
        { title: 'Categories', subtitle: 'Manage Types', icon: 'shape', route: 'AdminCategories', color: '#4facfe', gradient: ['#4facfe', '#00f2fe'] },
        { title: 'Venues', subtitle: 'Restaurants & Shops', icon: 'store', route: 'AdminVenues', color: '#f093fb', gradient: ['#f093fb', '#f5576c'] },
        { title: 'Products', subtitle: 'Menu Items', icon: 'food', route: 'AdminProducts', color: '#667eea', gradient: ['#667eea', '#764ba2'] },
        // Add more placeholders for future
        { title: 'Drivers', subtitle: 'Manage Drivers', icon: 'bike', route: 'AdminDrivers', color: '#fbc2eb', gradient: ['#fbc2eb', '#a6c1ee'] },
    ];

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome Back,</Text>
                        <Text style={styles.username}>{user?.displayName || 'Admin'}</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                        <MaterialCommunityIcons name="logout" size={24} color={theme.colors.error} />
                    </TouchableOpacity>
                </View>

                {/* Stats / Overview could go here */}
                <Surface style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>3</Text>
                        <Text style={styles.statLabel}>Modules</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>Active</Text>
                        <Text style={styles.statLabel}>Status</Text>
                    </View>
                </Surface>

                <Text style={styles.sectionTitle}>Management</Text>

                <View style={styles.grid}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.cardWrapper}
                            onPress={() => item.route ? navigation.navigate(item.route) : null}
                            activeOpacity={0.9}
                        >
                            <Surface style={[styles.card, !item.route && styles.disabledCard]}>
                                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                                    <MaterialCommunityIcons name={item.icon} size={28} color="white" />
                                </View>
                                <View style={styles.cardText}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                                </View>
                                {!item.route && (
                                    <View style={styles.comingSoon}>
                                        <Text style={styles.comingSoonText}>Soon</Text>
                                    </View>
                                )}
                            </Surface>
                        </TouchableOpacity>
                    ))}
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
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    greeting: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    logoutBtn: {
        padding: 12,
        backgroundColor: '#fee2e2',
        borderRadius: 12,
    },
    statsCard: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 20,
        backgroundColor: 'white',
        marginBottom: 32,
        ...theme.shadows.medium,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    statLabel: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#e2e8f0',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardWrapper: {
        width: '48%',
        marginBottom: 16,
    },
    card: {
        padding: 16,
        borderRadius: 24,
        backgroundColor: 'white',
        height: 160,
        justifyContent: 'space-between',
        ...theme.shadows.small,
    },
    disabledCard: {
        opacity: 0.7,
        backgroundColor: '#f8fafc',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        marginTop: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    cardSubtitle: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    comingSoon: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#e2e8f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    comingSoonText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#64748b',
    }
});
