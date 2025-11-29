import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import { Mic, Camera, Search, MessageCircle, MapPin, Zap, Brain, Sparkles } from 'lucide-react-native';

const MOOD_OPTIONS = [
    { id: 1, emoji: '😋', title: 'Hungry but Lazy', description: 'Quick & easy meals' },
    { id: 2, emoji: '⚡', title: 'Fast & Cheap', description: 'Budget-friendly & speedy' },
    { id: 3, emoji: '🥗', title: 'Healthy & Light', description: 'Fresh & nutritious' },
    { id: 4, emoji: '🍰', title: 'Sweet Craving', description: 'Desserts & treats' },
    { id: 5, emoji: '🔥', title: 'Something Exciting', description: 'Try something different' },
    { id: 6, emoji: '🍛', title: 'Comfort Food', description: 'Warm & satisfying' },
];

export const AIHubScreen = () => {
    const [selectedMood, setSelectedMood] = useState(null);

    const handleMoodSelection = (mood) => {
        setSelectedMood(mood.id);
        // Placeholder for future AI logic
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerEmoji}>🤖</Text>
                    <Text style={styles.title}>AI & Future Tech</Text>
                    <Text style={styles.subtitle}>Experience the future of food delivery</Text>
                </View>

                {/* Gurian Advisor Section */}
                <View style={styles.section}>
                    <View style={[styles.card, styles.gurianCard]}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardEmoji}>😎</Text>
                            <View>
                                <Text style={styles.cardTitle}>The "Gurian Advisor"</Text>
                                <Text style={styles.cardSubtitle}>AI with a Soul & Humor</Text>
                            </View>
                        </View>
                        <Text style={styles.cardDescription}>
                            Not just an algorithm—an AI with a distinct Gurian sense of humor and deep taste knowledge.
                        </Text>
                        <View style={styles.chatBubble}>
                            <Text style={styles.chatText}>
                                "I see you ordered vodka yesterday. You might be hungover today. How about a cold beer or a greasy Khinkali?"
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Voice Order & Chatbot Section */}
                <View style={styles.section}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.iconContainer}>
                                <Mic size={24} color={theme.colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.cardTitle}>Voice Order & Chatbot</Text>
                                <Text style={styles.cardSubtitle}>Talk like a friend</Text>
                            </View>
                        </View>
                        <Text style={styles.cardDescription}>
                            Hands-free ordering. Just say: "I want two pepperoni pizzas from Pirosmani."
                        </Text>
                        <TouchableOpacity style={styles.actionButton}>
                            <Mic size={20} color="#fff" />
                            <Text style={styles.actionButtonText}>Tap to Speak</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* AI Logistics Optimization Section */}
                <View style={styles.section}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                                <Zap size={24} color="#2196F3" />
                            </View>
                            <View>
                                <Text style={styles.cardTitle}>AI Logistics Optimization</Text>
                                <Text style={styles.cardSubtitle}>Real-time Route Magic</Text>
                            </View>
                        </View>
                        <Text style={styles.cardDescription}>
                            Predicting demand hotspots and optimizing courier routes for record-breaking delivery times.
                        </Text>
                        <View style={styles.statRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>15%</Text>
                                <Text style={styles.statLabel}>Faster</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>🔥</Text>
                                <Text style={styles.statLabel}>Hotter Food</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Search & Discovery Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Search & Discovery</Text>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchBar}>
                            <Search size={20} color={theme.colors.textSecondary} />
                            <TextInput
                                placeholder="Ask for anything..."
                                style={styles.searchInput}
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                            <TouchableOpacity>
                                <Camera size={20} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.searchOptions}>
                            <TouchableOpacity style={styles.searchOption}>
                                <Sparkles size={16} color={theme.colors.primary} />
                                <Text style={styles.searchOptionText}>Smart Search</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.searchOption}>
                                <Camera size={16} color={theme.colors.primary} />
                                <Text style={styles.searchOptionText}>Visual Search</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Mood Options Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🎭 The Mood Options</Text>
                    <View style={styles.moodGrid}>
                        {MOOD_OPTIONS.map((mood) => (
                            <TouchableOpacity
                                key={mood.id}
                                style={[
                                    styles.moodCard,
                                    selectedMood === mood.id && styles.moodCardSelected,
                                ]}
                                onPress={() => handleMoodSelection(mood)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                <Text style={styles.moodTitle}>{mood.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

            </ScrollView>

            {/* Chat Assistant Floating Button */}
            <TouchableOpacity style={styles.fab}>
                <MessageCircle size={28} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingBottom: 100, // Space for FAB
    },
    header: {
        alignItems: 'center',
        paddingVertical: theme.spacing.l,
        paddingHorizontal: theme.spacing.m,
    },
    headerEmoji: {
        fontSize: 48,
        marginBottom: theme.spacing.s,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    section: {
        marginBottom: theme.spacing.l,
        paddingHorizontal: theme.spacing.m,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
        ...theme.shadows.small,
    },
    gurianCard: {
        backgroundColor: '#FFF8E1', // Light yellow/gold tint
        borderWidth: 1,
        borderColor: '#FFD54F',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    cardEmoji: {
        fontSize: 32,
        marginRight: theme.spacing.m,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    cardSubtitle: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    cardDescription: {
        fontSize: 14,
        color: theme.colors.text,
        lineHeight: 20,
        marginBottom: theme.spacing.m,
    },
    chatBubble: {
        backgroundColor: '#fff',
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        borderTopLeftRadius: 0,
        ...theme.shadows.small,
    },
    chatText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: theme.colors.text,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.s,
        borderRadius: theme.borderRadius.m,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: theme.spacing.s,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: theme.spacing.s,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    searchContainer: {
        gap: theme.spacing.m,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.s,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: theme.spacing.s,
        fontSize: 16,
        color: theme.colors.text,
    },
    searchOptions: {
        flexDirection: 'row',
        gap: theme.spacing.m,
    },
    searchOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.m,
        borderRadius: theme.borderRadius.s,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    searchOptionText: {
        marginLeft: theme.spacing.xs,
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    moodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.m,
    },
    moodCard: {
        width: '47%', // roughly half width minus gap
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        alignItems: 'center',
        ...theme.shadows.small,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    moodCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryLight,
    },
    moodEmoji: {
        fontSize: 32,
        marginBottom: theme.spacing.xs,
    },
    moodTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.medium,
        elevation: 5,
    },
});
