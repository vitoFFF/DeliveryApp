import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Image, ScrollView, Platform } from 'react-native';
import { Text, FAB, Dialog, Portal, TextInput, Button, ActivityIndicator, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../../config/firebaseConfig';
import { ref, onValue, set, push, remove } from 'firebase/database';
import { theme } from '../../utils/theme';

export const AdminVenuesScreen = ({ navigation, route }) => {
    const { categoryId: filterCategoryId } = route.params || {};
    const [venues, setVenues] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [rating, setRating] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [priceRange, setPriceRange] = useState('$');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const venuesRef = ref(database, 'deliveryApp/venues');
        const categoriesRef = ref(database, 'deliveryApp/categories');

        const unsubVenues = onValue(venuesRef, (snapshot) => {
            const data = snapshot.val();
            let loadedVenues = data ? Object.entries(data).map(([id, val]) => ({ id, ...val })) : [];

            // Filter if category passed
            if (filterCategoryId) {
                loadedVenues = loadedVenues.filter(v =>
                    v.categoryId === filterCategoryId ||
                    (v.categories && v.categories.includes(filterCategoryId))
                );
            }

            setVenues(loadedVenues);
            setLoading(false);
        });

        const unsubCategories = onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedCats = data ? Object.entries(data).map(([id, val]) => ({ id, ...val })) : [];
            setCategories(loadedCats);
        });

        // Pre-fill form if adding new under this filter
        if (filterCategoryId) {
            setCategoryId(filterCategoryId);
        }

        return () => {
            unsubVenues();
            unsubCategories();
        };
    }, [filterCategoryId]);

    const showDialog = (venue = null) => {
        if (venue) {
            setEditingId(venue.id);
            setName(venue.name);
            setCategoryId(venue.categoryId || (venue.categories ? venue.categories[0] : ''));
            setRating(String(venue.rating));
            setDeliveryTime(venue.deliveryTime);
            setPriceRange(venue.priceRange);
            setImageUrl(venue.image);
        } else {
            setEditingId(null);
            setName('');
            setCategoryId('');
            setRating('');
            setDeliveryTime('');
            setPriceRange('');
            setImageUrl('');
        }
        setVisible(true);
    };

    const hideDialog = () => setVisible(false);

    const handleSave = async () => {
        if (!name || !categoryId) {
            Alert.alert('Error', 'Name and Category are required');
            return;
        }

        const venueData = {
            name,
            categoryId, // Primary category
            categories: [categoryId], // For compatibility with array-based structure
            rating: parseFloat(rating) || 0,
            deliveryTime,
            priceRange,
            image: imageUrl,
            id: editingId
        };

        try {
            if (editingId) {
                await set(ref(database, `deliveryApp/venues/${editingId}`), venueData);
            } else {
                const newRef = push(ref(database, 'deliveryApp/venues'));
                venueData.id = newRef.key;
                await set(newRef, venueData);
            }
            hideDialog();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleDelete = (id) => {
        Alert.alert('Delete Venue', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => await remove(ref(database, `deliveryApp/venues/${id}`))
            }
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={[styles.cardContent, { flexDirection: 'row', alignItems: 'center' }]}
                onPress={() => navigation.navigate('AdminProducts', { venueId: item.id })}
            >
                {item.image ? <Image source={{ uri: item.image }} style={styles.cardImage} /> : null}
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.subtitle}>⭐ {item.rating} • {item.deliveryTime}</Text>
                    <Text style={styles.subtitle}>Tap to manage menu</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => showDialog(item)}>
                    <MaterialCommunityIcons name="pencil" size={24} color={theme.colors.primary} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <MaterialCommunityIcons name="trash-can" size={24} color={theme.colors.error} style={styles.icon} />
                </TouchableOpacity>
                <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.textSecondary} style={{ marginLeft: 8 }} />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {loading ? <ActivityIndicator size="large" style={styles.loader} /> :
                <FlatList
                    data={venues}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
            }
            <FAB style={styles.fab} icon="plus" onPress={() => showDialog()} />

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
                    <Dialog.Title>{editingId ? 'Edit Venue' : 'Add Venue'}</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView contentContainerStyle={styles.dialogScroll}>
                            <TextInput label="Name" value={name} onChangeText={setName} style={styles.input} />
                            <TextInput label="Category ID (Manual for now)" value={categoryId} onChangeText={setCategoryId} style={styles.input} />
                            <TextInput label="Rating (0-5)" value={rating} onChangeText={setRating} keyboardType="numeric" style={styles.input} />
                            <TextInput label="Delivery Time (e.g. 20-30 min)" value={deliveryTime} onChangeText={setDeliveryTime} style={styles.input} />
                            <TextInput label="Price Range (e.g. $$)" value={priceRange} onChangeText={setPriceRange} style={styles.input} />
                            <TextInput label="Image URL" value={imageUrl} onChangeText={setImageUrl} style={styles.input} />
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Cancel</Button>
                        <Button onPress={handleSave}>Save</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f7fa' },
    list: { padding: 16, paddingBottom: 80 },
    loader: { marginTop: 50 },
    card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, marginBottom: 12, overflow: 'hidden', elevation: 2, padding: 10, alignItems: 'center' },
    cardImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
    cardContent: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold' },
    subtitle: { color: '#666', fontSize: 13, marginTop: 4 },
    actions: { flexDirection: 'row' },
    icon: { marginLeft: 16 },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: theme.colors.primary },
    input: { marginBottom: 12, backgroundColor: 'transparent' },
    dialog: { maxHeight: '80%' },
    dialogScroll: { paddingVertical: 10 }
});
