import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import { Clock, MapPin, ChevronRight, Star, RotateCcw, Package, Truck, CheckCircle, Navigation, Bike } from 'lucide-react-native';

// Mock Data
const ACTIVE_ORDERS = [
    // Empty by default, should be populated by real app logic if needed
    // or kept empty for testing "no active orders" state
];

const PAST_ORDERS = [
    // Empty by default
];

const STATUS_STEPS = [
    { label: 'Confirmed', icon: Package },
    { label: 'Preparing', icon: Clock },
    { label: 'On the way', icon: Truck },
    { label: 'Delivered', icon: CheckCircle },
];

const REAL_ROUTE = [
    { latitude: 41.7107, longitude: 44.7554 }, // Start: Vake
    { latitude: 41.7150, longitude: 44.7450 },
    { latitude: 41.7250, longitude: 44.7300 },
    { latitude: 41.7350, longitude: 44.7150 },
    { latitude: 41.7450, longitude: 44.7000 },
    { latitude: 41.7510, longitude: 44.6850 },
    { latitude: 41.7580, longitude: 44.6720 },
    { latitude: 41.7610, longitude: 44.6606 }, // End: Tsodoreti
];

const MOCK_LOCATION = {
    restaurant: REAL_ROUTE[0],
    customer: REAL_ROUTE[REAL_ROUTE.length - 1],
    initialRegion: {
        latitude: 41.7358,
        longitude: 44.708,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
    }
};

export const OrderStatusScreen = ({ route, navigation }) => {
    const [activeTab, setActiveTab] = useState('Active');
    const orderId = route?.params?.orderId;

    // If specific order ID passed, show detail (simplified logic for demo)
    if (orderId) {
        return <OrderDetailView orderId={orderId} navigation={navigation} />;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Orders</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Active' && styles.activeTab]}
                    onPress={() => setActiveTab('Active')}
                >
                    <Text style={[styles.tabText, activeTab === 'Active' && styles.activeTabText]}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Past' && styles.activeTab]}
                    onPress={() => setActiveTab('Past')}
                >
                    <Text style={[styles.tabText, activeTab === 'Past' && styles.activeTabText]}>Past</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {activeTab === 'Active' ? (
                    ACTIVE_ORDERS.length > 0 ? (
                        ACTIVE_ORDERS.map((order) => (
                            <ActiveOrderCard
                                key={order.id}
                                order={order}
                                onPress={() => navigation.navigate('Orders', { orderId: order.id })}
                            />
                        ))
                    ) : (
                        <EmptyState message="No active orders" />
                    )
                ) : (
                    PAST_ORDERS.length > 0 ? (
                        PAST_ORDERS.map((order) => (
                            <PastOrderCard key={order.id} order={order} />
                        ))
                    ) : (
                        <EmptyState message="No past orders" />
                    )
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const ActiveOrderCard = ({ order, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.cardHeader}>
            <Image source={{ uri: order.image }} style={styles.restaurantImage} />
            <View style={styles.cardInfo}>
                <Text style={styles.restaurantName}>{order.restaurant}</Text>
                <Text style={styles.orderItems} numberOfLines={1}>
                    {order.items.join(', ')}
                </Text>
                <View style={styles.statusBadge}>
                    <Clock size={12} color="#fff" />
                    <Text style={styles.statusText}>{order.status} • {order.eta}</Text>
                </View>
            </View>
            <View style={styles.priceContainer}>
                <Text style={styles.priceText}>{order.total}</Text>
            </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${(order.statusStep + 1) * 25}%` }]} />
            </View>
            <TouchableOpacity style={styles.trackButton} onPress={onPress}>
                <Text style={styles.trackButtonText}>Track Order</Text>
                <ChevronRight size={16} color="#fff" />
            </TouchableOpacity>
        </View>
    </TouchableOpacity>
);

const PastOrderCard = ({ order }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Image source={{ uri: order.image }} style={styles.restaurantImage} />
            <View style={styles.cardInfo}>
                <View style={styles.pastHeaderRow}>
                    <Text style={styles.restaurantName}>{order.restaurant}</Text>
                    {order.rating && (
                        <View style={styles.ratingContainer}>
                            <Star size={12} color="#FFD700" fill="#FFD700" />
                            <Text style={styles.ratingText}>{order.rating}.0</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.dateText}>{order.date}</Text>
                <Text style={styles.orderItems} numberOfLines={1}>
                    {order.items.join(', ')}
                </Text>
            </View>
            <Text style={styles.priceText}>{order.total}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
            <TouchableOpacity style={styles.reorderButton}>
                <RotateCcw size={16} color={theme.colors.primary} />
                <Text style={styles.reorderText}>Reorder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rateButton}>
                <Text style={styles.rateButtonText}>Rate</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const EmptyState = ({ message }) => (
    <View style={styles.emptyState}>
        <Package size={64} color={theme.colors.textSecondary} />
        <Text style={styles.emptyText}>{message}</Text>
    </View>
);

const OrderDetailView = ({ orderId, navigation }) => {
    // For demo, if orderId is provided but not in ACTIVE_ORDERS, use a placeholder
    const order = ACTIVE_ORDERS.find(o => o.id === orderId) || {
        id: orderId,
        restaurant: 'Burger King', // Default for demo
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
        status: 'Preparing',
        statusStep: 1,
        items: ['New Order'],
        total: '$0.00',
        eta: '15-20 min'
    };
    const [currentStep, setCurrentStep] = useState(order.statusStep);

    useEffect(() => {
        (async () => {
            await Location.requestForegroundPermissionsAsync();
        })();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.detailHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronRight size={24} color={theme.colors.text} style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Track Order</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.detailContent}>
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={MOCK_LOCATION.initialRegion}
                        showsUserLocation={true}
                        followsUserLocation={false}
                    // provider={PROVIDER_GOOGLE} // Uncomment for Google Maps
                    >
                        <Marker
                            coordinate={MOCK_LOCATION.restaurant}
                            title="Restaurant"
                        >
                            <View style={styles.smallMarker}>
                                <Package size={14} color="#fff" />
                            </View>
                        </Marker>

                        <Marker
                            coordinate={REAL_ROUTE[Math.floor(REAL_ROUTE.length / 2)]}
                            title="Courier"
                        >
                            <View style={[styles.smallMarker, { backgroundColor: '#FF9800' }]}>
                                <Bike size={14} color="#fff" />
                            </View>
                        </Marker>

                        <Polyline
                            coordinates={REAL_ROUTE}
                            strokeColor={theme.colors.primary}
                            strokeWidth={3}
                        />
                    </MapView>
                </View>

                <View style={styles.statusCard}>
                    <View style={styles.etaContainer}>
                        <Text style={styles.etaLabel}>Estimated Delivery</Text>
                        <Text style={styles.etaTime}>{order.eta}</Text>
                    </View>

                    <View style={styles.timeline}>
                        {STATUS_STEPS.map((step, index) => {
                            const isActive = index <= currentStep;
                            const isLast = index === STATUS_STEPS.length - 1;
                            return (
                                <View key={index} style={styles.timelineItem}>
                                    <View style={[styles.timelineIcon, isActive && styles.activeTimelineIcon]}>
                                        <step.icon size={20} color={isActive ? '#fff' : theme.colors.textSecondary} />
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <Text style={[styles.timelineLabel, isActive && styles.activeTimelineLabel]}>
                                            {step.label}
                                        </Text>
                                    </View>
                                    {!isLast && (
                                        <View style={[styles.timelineLine, index < currentStep && styles.activeTimelineLine]} />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.driverCard}>
                    <View style={styles.driverInfo}>
                        <View style={styles.driverAvatar}>
                            <Text style={styles.driverInitials}>JD</Text>
                        </View>
                        <View>
                            <Text style={styles.driverName}>John Doe</Text>
                            <Text style={styles.driverRole}>Your Courier</Text>
                        </View>
                    </View>
                    <View style={styles.driverActions}>
                        <TouchableOpacity style={styles.callButton}>
                            <Text style={styles.callButtonText}>Call</Text>
                        </TouchableOpacity>
                    </View>
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
    header: {
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.m,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.m,
        marginBottom: theme.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    tab: {
        marginRight: theme.spacing.l,
        paddingBottom: theme.spacing.s,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
    },
    tabText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: theme.colors.primary,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.m,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        marginBottom: theme.spacing.m,
        padding: theme.spacing.m,
        ...theme.shadows.small,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: theme.spacing.m,
    },
    restaurantImage: {
        width: 60,
        height: 60,
        borderRadius: theme.borderRadius.m,
        marginRight: theme.spacing.m,
    },
    cardInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    orderItems: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginBottom: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    statusText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 4,
    },
    priceContainer: {
        justifyContent: 'flex-start',
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginBottom: theme.spacing.m,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    progressBarContainer: {
        flex: 1,
        height: 6,
        backgroundColor: theme.colors.border,
        borderRadius: 3,
        marginRight: theme.spacing.m,
    },
    progressBar: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 3,
    },
    trackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.m,
        paddingVertical: 8,
        borderRadius: theme.borderRadius.m,
    },
    trackButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        marginRight: 4,
    },
    // Past Order Styles
    pastHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9C4',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    ratingText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FBC02D',
        marginLeft: 2,
    },
    dateText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    reorderButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reorderText: {
        color: theme.colors.primary,
        fontWeight: '600',
        marginLeft: 6,
    },
    rateButton: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    rateButtonText: {
        color: theme.colors.text,
        fontWeight: '600',
        fontSize: 13,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        marginTop: theme.spacing.m,
        color: theme.colors.textSecondary,
        fontSize: 16,
    },
    // Detail View Styles
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.m,
    },
    backButton: {
        padding: 4,
    },
    detailContent: {
        padding: theme.spacing.m,
    },
    mapContainer: {
        height: 250,
        borderRadius: theme.borderRadius.l,
        overflow: 'hidden',
        marginBottom: theme.spacing.m,
        ...theme.shadows.medium,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    smallMarker: {
        backgroundColor: theme.colors.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.small,
    },
    statusCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.l,
        ...theme.shadows.medium,
        marginBottom: theme.spacing.m,
    },
    etaContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.l,
    },
    etaLabel: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    etaTime: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    timeline: {
        marginLeft: theme.spacing.s,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 24,
        position: 'relative',
    },
    timelineIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    activeTimelineIcon: {
        backgroundColor: theme.colors.primary,
    },
    timelineContent: {
        marginLeft: theme.spacing.m,
        justifyContent: 'center',
    },
    timelineLabel: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    activeTimelineLabel: {
        color: theme.colors.text,
        fontWeight: '600',
    },
    timelineLine: {
        position: 'absolute',
        left: 15,
        top: 32,
        bottom: -24,
        width: 2,
        backgroundColor: theme.colors.border,
    },
    activeTimelineLine: {
        backgroundColor: theme.colors.primary,
    },
    driverCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.l,
        ...theme.shadows.small,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.m,
    },
    driverInitials: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    driverName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    driverRole: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    callButton: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    callButtonText: {
        color: '#2E7D32',
        fontWeight: '600',
    },
});
