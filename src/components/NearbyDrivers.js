import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Truck, Bike } from 'lucide-react-native';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');

// Mock centers
const USER_LOCATION = { latitude: 41.7610, longitude: 44.6606 }; // Tsodoreti

const generateRandomDrivers = (count) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `driver-${i}`,
        latitude: USER_LOCATION.latitude + (Math.random() - 0.5) * 0.02,
        longitude: USER_LOCATION.longitude + (Math.random() - 0.5) * 0.02,
        rotation: Math.random() * 360,
    }));
};

export const NearbyDrivers = () => {
    const [drivers, setDrivers] = useState(generateRandomDrivers(5));

    useEffect(() => {
        (async () => {
            await Location.requestForegroundPermissionsAsync();
        })();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Couriers Near You</Text>
                <View style={styles.badge}>
                    <View style={styles.dot} />
                    <Text style={styles.badgeText}>Live</Text>
                </View>
            </View>
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        ...USER_LOCATION,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    }}
                    showsUserLocation={true}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                >
                    {/* Real user location is shown by showsUserLocation={true} */}
                    {drivers.map(driver => (
                        <Marker
                            key={driver.id}
                            coordinate={{ latitude: driver.latitude, longitude: driver.longitude }}
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <View style={styles.driverMarkerWrapper}>
                                <View style={styles.driverMarkerInner}>
                                    <Bike size={12} color="#fff" />
                                </View>
                            </View>
                        </Marker>
                    ))}
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
        backgroundColor: '#FFEBEE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E53935',
        marginRight: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#E53935',
        textTransform: 'uppercase',
    },
    mapContainer: {
        height: 150,
        borderRadius: theme.borderRadius.l,
        overflow: 'hidden',
        ...theme.shadows.small,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    userMarker: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.primary,
        borderWidth: 2,
        borderColor: '#fff',
    },
    driverMarkerWrapper: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    driverMarkerInner: {
        backgroundColor: '#FF9800',
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.small,
    },
});
