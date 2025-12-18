import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from './MapViewWrapper';
import * as Location from 'expo-location';
import { Utensils, Store, Cross, PlusSquare } from 'lucide-react-native';
import { theme } from '../utils/theme';

import { lightMapStyle } from '../utils/mapStyles';

const { width } = Dimensions.get('window');

// Mock center (Tsodoreti)
const USER_LOCATION = { latitude: 41.7610, longitude: 44.6606 };

const SERVICE_TYPES = [
    { type: 'Restaurant', icon: Utensils, color: '#FF5252' },
    { type: 'Bakery', icon: Store, color: '#FFB74D' },
    { type: 'Pharmacy', icon: PlusSquare, color: '#4CAF50' },
];

const generateRandomServices = (count) => {
    return Array.from({ length: count }).map((_, i) => {
        const serviceType = SERVICE_TYPES[i % SERVICE_TYPES.length];
        return {
            id: `service-${i}`,
            latitude: USER_LOCATION.latitude + (Math.random() - 0.5) * 0.015,
            longitude: USER_LOCATION.longitude + (Math.random() - 0.5) * 0.015,
            name: `${serviceType.type} ${i + 1}`,
            type: serviceType.type,
            icon: serviceType.icon,
            color: serviceType.color,
        };
    });
};

export const NearbyServices = () => {
    const [services, setServices] = useState(generateRandomServices(6));
    const [tracksViewChanges, setTracksViewChanges] = useState(true);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Permission to access location was denied');
            }
        })();

        // Fix flickering by disabling tracksViewChanges after initial render
        const timer = setTimeout(() => {
            setTracksViewChanges(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Services Near You</Text>
                <View style={styles.badge}>
                    <View style={styles.dot} />
                    <Text style={styles.badgeText}>Nearby</Text>
                </View>
            </View>
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        ...USER_LOCATION,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    customMapStyle={lightMapStyle}
                    showsUserLocation={true}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    pitchEnabled={false}
                    rotateEnabled={false}
                >
                    {services.map(service => {
                        const IconComponent = service.icon;
                        return (
                            <Marker
                                key={service.id}
                                coordinate={{ latitude: service.latitude, longitude: service.longitude }}
                                title={service.name}
                                description={service.type}
                                tracksViewChanges={tracksViewChanges}
                            >
                                <View style={styles.markerWrapper}>
                                    <View style={[styles.markerInner, { backgroundColor: service.color }]}>
                                        <IconComponent size={14} color="#fff" />
                                    </View>
                                </View>
                            </Marker>
                        );
                    })}
                </MapView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.m,
        marginVertical: theme.spacing.s,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.s,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#2196F3',
        marginRight: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2196F3',
        textTransform: 'uppercase',
    },
    mapContainer: {
        height: 180,
        borderRadius: theme.borderRadius.l,
        overflow: 'hidden',
        ...theme.shadows.small,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerWrapper: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerInner: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.small,
    },
});
