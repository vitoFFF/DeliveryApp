import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, FAB, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { supabase } from '../../config/supabaseConfig';

export const AdminDriversScreen = ({ navigation }) => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from('drivers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDrivers(data);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to load drivers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (id) => {
        Alert.alert(
            'Delete Driver',
            'Are you sure? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('drivers')
                                .delete()
                                .eq('id', id);
                            if (error) throw error;
                            fetchData();
                        } catch (error) {
                            Alert.alert('Error', error.message);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.cardContent}
                onPress={() => {/* Maybe navigate to driver details */}}
            >
                <MaterialCommunityIcons name="account" size={24} color={theme.colors.primary} />
                <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.subtext}>{item.email}</Text>
                    <Text style={styles.subtext}>{item.phone} • {item.vehicle_type}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => {/* Edit */}} style={styles.actionBtn}>
                    <MaterialCommunityIcons name="pencil" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                    <MaterialCommunityIcons name="trash-can" size={24} color={theme.colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : (
                <FlatList
                    data={drivers}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.empty}>No drivers found</Text>}
                />
            )}

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate('AdminAddDriver')}
                label="Add Driver"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    list: {
        padding: 16,
        paddingBottom: 80,
    },
    loader: {
        marginTop: 50,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
    },
    subtext: {
        fontSize: 12,
        color: '#666',
        marginLeft: 12,
    },
    actions: {
        flexDirection: 'row',
    },
    actionBtn: {
        marginLeft: 16,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.primary,
    },
    empty: {
        textAlign: 'center',
        marginTop: 50,
        color: '#666',
    }
});