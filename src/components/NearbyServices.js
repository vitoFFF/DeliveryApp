import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from './MapViewWrapper';
import * as Location from 'expo-location';
import { Utensils, Store, Cross, PlusSquare } from 'lucide-react-native';
import { theme } from '../utils/theme';

import { lightMapStyle } from '../utils/mapStyles';

const { width } = Dimensions.get('window');

// Mock center (Tsodoreti)
const USER_LOCATION = { latitude: 41.7610, longitude: 44.6606 };

const SPECIFIC_LOCATIONS = [
    {
        id: 'art-nona',
        name: 'Art Nona',
        latitude: 41.921495013939094,
        longitude: 42.00402876754617,
        type: 'Restaurant',
        icon: Utensils,
        color: '#FF5252'
    },
    {
        id: 'my-market',
        name: 'My Market',
        latitude: 41.92293970858616,
        longitude: 41.9997383322704,
        type: 'Store',
        icon: Store,
        color: '#FFB74D'
    },
    {
        id: 'pirosmani',
        name: 'Pirosmani',
        latitude: 41.92767949773373,
        longitude: 42.00949770721634,
        type: 'Restaurant',
        icon: Utensils,
        color: '#FF5252'
    }
];

export const NearbyServices = ({ style }) => {
    const { t } = useTranslation();
    const [location, setLocation] = useState(null);
    const [services, setServices] = useState(SPECIFIC_LOCATIONS);
    const [tracksViewChanges, setTracksViewChanges] = useState(true);

    useEffect(() => {
        (async () => {
            let center = USER_LOCATION;
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    const loc = await Location.getCurrentPositionAsync({});
                    center = {
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                    };
                }
            } catch (error) {
                console.log('Error fetching location:', error);
            }
            setLocation(center);
        })();

        // Fix flickering by disabling tracksViewChanges after initial render
        const timer = setTimeout(() => {
            setTracksViewChanges(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('home.services_near_you')}</Text>
                <View style={styles.badge}>
                    <View style={styles.dot} />
                    <Text style={styles.badgeText}>{t('home.nearby_badge')}</Text>
                </View>
            </View>
            <View style={styles.mapContainer}>
                {location && (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            ...location,
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
                )}
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
