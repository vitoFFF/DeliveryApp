import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { Text, FAB, Dialog, Portal, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { supabase } from '../../config/supabaseConfig';

export const AdminProductsScreen = ({ navigation, route }) => {
    // Get filter from navigation params
    const { venueId: paramVenueId } = route.params || {};

    const [products, setProducts] = useState([]);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Filter - initialize with param if available
    const [selectedVenueId, setSelectedVenueId] = useState(paramVenueId || null);

    // Form
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [venueId, setVenueId] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const fetchData = async () => {
        try {
            // Fetch Venues for Filter
            const { data: vens, error: venError } = await supabase.from('venues').select('id, name');
            if (venError) throw venError;
            setVenues(vens);

            // Fetch Products
            let query = supabase.from('products').select('*').order('name');
            const { data: prods, error: prodError } = await query;
            if (prodError) throw prodError;

            // Map
            const mappedProducts = prods.map(p => ({
                ...p,
                restaurantId: p.restaurant_id
            }));

            setProducts(mappedProducts);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Update selected venue if param changes
        if (paramVenueId) {
            setSelectedVenueId(paramVenueId);
        }
    }, [paramVenueId]);

    useEffect(() => {
        fetchData();
    }, []);

    const showDialog = (product = null) => {
        if (product) {
            setEditingId(product.id);
            setName(product.name);
            setDescription(product.description);
            setPrice(String(product.price));
            setVenueId(product.restaurantId);
            setImageUrl(product.image);
        } else {
            setEditingId(null);
            setName('');
            setDescription('');
            setPrice('');
            setVenueId(selectedVenueId || ''); // Default to filter
            setImageUrl('');
        }
        setVisible(true);
    };

    const hideDialog = () => setVisible(false);

    const handleSave = async () => {
        if (!name || !venueId) {
            Alert.alert('Error', 'Name and Venue ID are required');
            return;
        }

        const payload = {
            name,
            description,
            price: parseFloat(price) || 0,
            restaurant_id: venueId,
            image: imageUrl
        };

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const newId = `prod_${Date.now()}`;
                const { error } = await supabase
                    .from('products')
                    .insert({ ...payload, id: newId });
                if (error) throw error;
            }
            hideDialog();
            fetchData();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleDelete = (id) => {
        Alert.alert('Delete Product', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const { error } = await supabase.from('products').delete().eq('id', id);
                        if (error) throw error;
                        fetchData();
                    } catch (err) {
                        Alert.alert('Error', err.message);
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {item.image ? <Image source={{ uri: item.image }} style={styles.cardImage} /> : null}
            <View style={styles.cardContent}>
                <Text style={styles.title}>{item.name}</Text>
                <Text numberOfLines={1} style={styles.desc}>{item.description}</Text>
                <Text style={styles.price}>${item.price}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => showDialog(item)}>
                    <MaterialCommunityIcons name="pencil" size={24} color={theme.colors.primary} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <MaterialCommunityIcons name="trash-can" size={24} color={theme.colors.error} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const filteredProducts = selectedVenueId
        ? products.filter(p => p.restaurantId === selectedVenueId)
        : products;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[styles.chip, !selectedVenueId && styles.activeChip]}
                        onPress={() => setSelectedVenueId(null)}
                    >
                        <Text style={[styles.chipText, !selectedVenueId && styles.activeChipText]}>All</Text>
                    </TouchableOpacity>
                    {venues.map(v => (
                        <TouchableOpacity
                            key={v.id}
                            style={[styles.chip, selectedVenueId === v.id && styles.activeChip]}
                            onPress={() => setSelectedVenueId(v.id)}
                        >
                            <Text style={[styles.chipText, selectedVenueId === v.id && styles.activeChipText]}>{v.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? <ActivityIndicator size="large" style={styles.loader} /> :
                <FlatList
                    data={filteredProducts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
            }
            <FAB style={styles.fab} icon="plus" onPress={() => showDialog()} />

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
                    <Dialog.Title>{editingId ? 'Edit Product' : 'Add Product'}</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView contentContainerStyle={styles.dialogScroll}>
                            <TextInput label="Name" value={name} onChangeText={setName} style={styles.input} />
                            <TextInput label="Venue ID" value={venueId} onChangeText={setVenueId} style={styles.input} />
                            <TextInput label="Description" value={description} onChangeText={setDescription} style={styles.input} multiline />
                            <TextInput label="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
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
    filterContainer: { padding: 10, backgroundColor: 'white', elevation: 2 },
    chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#eee', marginRight: 8 },
    activeChip: { backgroundColor: theme.colors.primary },
    chipText: { color: '#333' },
    activeChipText: { color: 'white' },
    list: { padding: 16, paddingBottom: 80 },
    loader: { marginTop: 50 },
    card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, marginBottom: 12, overflow: 'hidden', elevation: 2, padding: 10, alignItems: 'center' },
    cardImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
    cardContent: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold' },
    desc: { color: '#666', fontSize: 13 },
    price: { color: theme.colors.primary, fontWeight: 'bold', marginTop: 4 },
    actions: { flexDirection: 'row' },
    icon: { marginLeft: 16 },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: theme.colors.primary },
    input: { marginBottom: 12, backgroundColor: 'transparent' },
    dialog: { maxHeight: '80%' },
    dialogScroll: { paddingVertical: 10 }
});
