import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, FAB, Dialog, Portal, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { supabase } from '../../config/supabaseConfig';

export const AdminCategoriesScreen = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState('');

    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            setCategories(data);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showDialog = (category = null) => {
        if (category) {
            setEditingId(category.id);
            setName(category.name);
            setEmoji(category.emoji || '');
        } else {
            setEditingId(null);
            setName('');
            setEmoji('');
        }
        setVisible(true);
    };

    const hideDialog = () => setVisible(false);

    const handleSave = async () => {
        if (!name) {
            Alert.alert('Error', 'Name is required');
            return;
        }

        const payload = {
            name,
            emoji
        };

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('categories')
                    .update(payload)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                // Use name as ID (slugified)
                const newId = name.toLowerCase().replace(/\s+/g, '-');
                // Check if exists? Unique constraint on PK will fail if duplicate.
                const { error } = await supabase
                    .from('categories')
                    .insert({ id: newId, ...payload });
                if (error) throw error;
            }
            hideDialog();
            fetchData();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Delete Category',
            'Are you sure? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('categories')
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
                onPress={() => navigation.navigate('AdminVenues', { categoryId: item.id })}
            >
                <Text style={styles.emoji}>{item.emoji || '📦'}</Text>
                <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.subtext}>Tap to view venues</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => showDialog(item)} style={styles.actionBtn}>
                    <MaterialCommunityIcons name="pencil" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                    <MaterialCommunityIcons name="trash-can" size={24} color={theme.colors.error} />
                </TouchableOpacity>
                <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.textSecondary} style={{ marginLeft: 8 }} />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.empty}>No categories found</Text>}
                />
            )}

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => showDialog()}
                label="Add Category"
            />

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>{editingId ? 'Edit Category' : 'Add Category'}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Name"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
                        <TextInput
                            label="Emoji"
                            value={emoji}
                            onChangeText={setEmoji}
                            style={styles.input}
                            placeholder="e.g. 🍔"
                        />
                    </Dialog.Content>
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
    },
    emoji: {
        fontSize: 24,
        marginRight: 16,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
    },
    subtext: {
        fontSize: 12,
        color: '#666',
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
    input: {
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    empty: {
        textAlign: 'center',
        marginTop: 50,
        color: '#666',
    }
});
