import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Modal, Portal, IconButton, Divider } from 'react-native-paper';
import { X, Check } from 'lucide-react-native';
import { theme } from '../utils/theme';

export const AdvancedFilterModal = ({ visible, onDismiss, onApply, onReset, categories = [] }) => {
    const [selectedSort, setSelectedSort] = React.useState('relevance');
    const [selectedPrice, setSelectedPrice] = React.useState(null);
    const [selectedRating, setSelectedRating] = React.useState(null);
    const [selectedSpeed, setSelectedSpeed] = React.useState(null);
    const [onlySales, setOnlySales] = React.useState(false);
    const [selectedDeliveryPrice, setSelectedDeliveryPrice] = React.useState(null);
    const [selectedCategories, setSelectedCategories] = React.useState([]);

    const sortOptions = [
        { id: 'relevance', label: 'Relevance' },
        { id: 'nearest', label: 'Nearest' },
        { id: 'rating', label: 'Rating' },
        { id: 'price', label: 'Price' },
    ];

    const priceOptions = ['$', '$$', '$$$'];
    const ratingOptions = ['4.5+', '4.0+', '3.5+'];
    const speedOptions = ['Under 30 min', '45 min'];
    const deliveryPriceOptions = [
        { id: 'free', label: 'Free' },
        { id: 'under2', label: '< $2' },
        { id: 'under5', label: '< $5' },
    ];

    const toggleCategory = (catId) => {
        setSelectedCategories(prev =>
            prev.includes(catId)
                ? prev.filter(id => id !== catId)
                : [...prev, catId]
        );
    };

    const FilterSection = ({ title, children }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.optionsContainer}>
                {children}
            </View>
        </View>
    );

    const Chip = ({ label, selected, onPress, multi = false }) => (
        <TouchableOpacity
            style={[
                styles.chip,
                selected && styles.chipSelected
            ]}
            onPress={onPress}
        >
            <Text style={[
                styles.chipText,
                selected && styles.chipTextSelected
            ]}>
                {label}
            </Text>
            {selected && <Check size={14} color="#FFFFFF" strokeWidth={3} style={{ marginLeft: 4 }} />}
        </TouchableOpacity>
    );

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.modalContent}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Filter Options</Text>
                    <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                        <X size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
                    <FilterSection title="Offers">
                        <Chip
                            label="Only Sales"
                            selected={onlySales}
                            onPress={() => setOnlySales(!onlySales)}
                        />
                    </FilterSection>

                    <Divider style={styles.divider} />

                    <FilterSection title="Sort By">
                        {sortOptions.map(opt => (
                            <Chip
                                key={opt.id}
                                label={opt.label}
                                selected={selectedSort === opt.id}
                                onPress={() => setSelectedSort(opt.id)}
                            />
                        ))}
                    </FilterSection>

                    <Divider style={styles.divider} />

                    <FilterSection title="Categories">
                        {categories.map(cat => (
                            <Chip
                                key={cat.id}
                                label={cat.name}
                                selected={selectedCategories.includes(cat.id)}
                                onPress={() => toggleCategory(cat.id)}
                                multi
                            />
                        ))}
                    </FilterSection>

                    <Divider style={styles.divider} />

                    <FilterSection title="Delivery Fee">
                        {deliveryPriceOptions.map(opt => (
                            <Chip
                                key={opt.id}
                                label={opt.label}
                                selected={selectedDeliveryPrice === opt.id}
                                onPress={() => setSelectedDeliveryPrice(opt.id)}
                            />
                        ))}
                    </FilterSection>

                    <Divider style={styles.divider} />

                    <FilterSection title="Price range">
                        {priceOptions.map(opt => (
                            <Chip
                                key={opt}
                                label={opt}
                                selected={selectedPrice === opt}
                                onPress={() => setSelectedPrice(opt)}
                            />
                        ))}
                    </FilterSection>

                    <Divider style={styles.divider} />

                    <FilterSection title="Rating">
                        {ratingOptions.map(opt => (
                            <Chip
                                key={opt}
                                label={opt}
                                selected={selectedRating === opt}
                                onPress={() => setSelectedRating(opt)}
                            />
                        ))}
                    </FilterSection>

                    <Divider style={styles.divider} />

                    <FilterSection title="Delivery speed">
                        {speedOptions.map(opt => (
                            <Chip
                                key={opt}
                                label={opt}
                                selected={selectedSpeed === opt}
                                onPress={() => setSelectedSpeed(opt)}
                            />
                        ))}
                    </FilterSection>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={() => {
                            setSelectedSort('relevance');
                            setSelectedPrice(null);
                            setSelectedRating(null);
                            setSelectedSpeed(null);
                            setOnlySales(false);
                            setSelectedDeliveryPrice(null);
                            setSelectedCategories([]);
                            if (onReset) onReset();
                        }}
                    >
                        <Text style={styles.resetText}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={onApply}
                    >
                        <Text style={styles.applyText}>Apply filters</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 24,
        padding: 0,
        maxHeight: '80%',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    closeButton: {
        padding: 4,
    },
    scroll: {
        paddingHorizontal: 20,
    },
    section: {
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 12,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chipSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    chipTextSelected: {
        color: '#FFFFFF',
    },
    divider: {
        backgroundColor: '#F3F4F6',
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
    },
    resetButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    resetText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    applyButton: {
        flex: 2,
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
    },
    applyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
