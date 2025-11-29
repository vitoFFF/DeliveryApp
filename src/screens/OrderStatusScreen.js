import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import { Clock, MapPin, ChevronRight, Star, RotateCcw, Package, Truck, CheckCircle } from 'lucide-react-native';

// Mock Data
const ACTIVE_ORDERS = [
    {
        id: 'ORD-2458',
        restaurant: 'Burger King',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
        status: 'Preparing',
        statusStep: 1,
        items: ['Whopper Meal', 'Onion Rings'],
        total: '$18.50',
        eta: '15-20 min'
    },
    {
        id: 'ORD-2459',
        restaurant: 'Sushi Express',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
        status: 'Out for Delivery',
        statusStep: 2,
        items: ['Spicy Tuna Roll', 'Miso Soup', 'Edamame'],
        total: '$32.00',
        eta: '5-10 min'
    },
];

const PAST_ORDERS = [
    {
        id: 'ORD-2301',
        restaurant: 'Pizza Palace',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80',
        status: 'Delivered',
        date: 'Yesterday, 8:30 PM',
        items: ['Pepperoni Pizza (L)', 'Coke Zero'],
        total: '$24.99',
        rating: 5
    },
    {
        id: 'ORD-2289',
        restaurant: 'Green Bowl',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
        status: 'Delivered',
        date: 'Nov 26, 1:15 PM',
        items: ['Quinoa Salad', 'Green Smoothie'],
        total: '$16.50',
        rating: 4
    },
];

const STATUS_STEPS = [
    { label: 'Confirmed', icon: Package },
    { label: 'Preparing', icon: Clock },
    { label: 'On the way', icon: Truck },
    { label: 'Delivered', icon: CheckCircle },
];

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
    // Find order in mock data (fallback to first active for demo)
    const order = ACTIVE_ORDERS.find(o => o.id === orderId) || ACTIVE_ORDERS[0];
    const [currentStep, setCurrentStep] = useState(order.statusStep);

    useEffect(() => {
        // Simulate progress
        const interval = setInterval(() => {
            setCurrentStep(prev => (prev < 3 ? prev + 1 : prev));
        }, 3000);
        return () => clearInterval(interval);
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
                <View style={styles.mapPlaceholder}>
                    <MapPin size={48} color={theme.colors.primary} />
                    <Text style={styles.mapText}>Map View Placeholder</Text>
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
    mapPlaceholder: {
        height: 200,
        backgroundColor: '#E0E0E0',
        borderRadius: theme.borderRadius.l,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.m,
    },
    mapText: {
        color: theme.colors.textSecondary,
        marginTop: 8,
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
