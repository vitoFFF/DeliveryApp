import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Image, ScrollView, Platform } from 'react-native';
import { Text, FAB, Dialog, Portal, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { supabase } from '../../config/supabaseConfig';

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

    const fetchData = async () => {
        try {
            // Fetch Categories
            const { data: cats, error: catError } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (catError) throw catError;
            setCategories(cats);

            // Fetch Venues
            let query = supabase.from('venues').select('*').order('created_at', { ascending: false });
            // Note: simple filtering here or client side? Client side is easier for multi-category check logic that existed before.
            // But strict category_id check can be done here.

            const { data: vens, error: venError } = await query;
            if (venError) throw venError;

            // Map keys
            const mappedVenues = vens.map(v => ({
                ...v,
                categoryId: v.category_id,
                deliveryTime: v.delivery_time,
                priceRange: v.price_range
            }));

            // Client side filter to match original logic (array includes or exact match)
            let filtered = mappedVenues;
            if (filterCategoryId) {
                filtered = mappedVenues.filter(v =>
                    v.categoryId === filterCategoryId ||
                    (v.categories && v.categories.includes(filterCategoryId))
                );
            }

            setVenues(filtered);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterCategoryId]);

    // Pre-fill form if adding new under this filter
    useEffect(() => {
        if (filterCategoryId && !editingId) {
            setCategoryId(filterCategoryId);
        }
    }, [filterCategoryId, editingId]);

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
            setCategoryId(filterCategoryId || '');
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

        const payload = {
            name,
            category_id: categoryId,
            categories: [categoryId],
            rating: parseFloat(rating) || 0,
            delivery_time: deliveryTime,
            price_range: priceRange,
            image: imageUrl,
        };

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('venues')
                    .update(payload)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                // Generate ID or let DB handle it? Original used push key.
                // Supabase tables are TEXT PK (from my schema), so simple string id is fine or uuid.
                // schema says id is TEXT PRIMARY KEY. upsert in seeding passed id.
                // To create new, we should usually let DB generate UUID if set to default gen_random_uuid(), but I set it as just TEXT.
                // I should generate a random ID here to match the manual Text ID style of the schema if it doesn't auto-gen.
                // My schema: `id TEXT PRIMARY KEY`. It does NOT have `DEFAULT gen_random_uuid()`. 
                // So I MUST provide an ID.
                const newId = `ven_${Date.now()}`;
                const { error } = await supabase
                    .from('venues')
                    .insert({ ...payload, id: newId });
                if (error) throw error;
            }
            hideDialog();
            fetchData(); // Refresh
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
                onPress: async () => {
                    try {
                        const { error } = await supabase.from('venues').delete().eq('id', id);
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
                            <TextInput label="Category ID" value={categoryId} onChangeText={setCategoryId} style={styles.input} />
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
