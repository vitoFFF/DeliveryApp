import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';

const MOOD_OPTIONS = [
    { id: 1, emoji: '😋', title: 'Hungry but Lazy', description: 'Quick & easy meals' },
    { id: 2, emoji: '⚡', title: 'Fast & Cheap', description: 'Budget-friendly & speedy' },
    { id: 3, emoji: '🥗', title: 'Healthy & Light', description: 'Fresh & nutritious' },
    { id: 4, emoji: '🍰', title: 'Sweet Craving', description: 'Desserts & treats' },
    { id: 5, emoji: '🔥', title: 'Something Exciting / New', description: 'Try something different' },
    { id: 6, emoji: '🍛', title: 'Comfort Food Mode', description: 'Warm & satisfying' },
];

export const AIHubScreen = () => {
    const [selectedMood, setSelectedMood] = useState(null);

    // TODO: Implement AI backend integration
    // This function will send the selected mood to the AI backend
    // and receive personalized food recommendations
    const handleMoodSelection = (mood) => {
        setSelectedMood(mood.id);

        // TODO: Call AI API here
        // Example:
        // const recommendations = await fetchAIRecommendations(mood.title);
        // Navigate to recommendations screen or show results

        console.log('Selected mood:', mood.title);
        // Temporary feedback - remove when implementing backend
        alert(`Selected: ${mood.title}\n\nAI recommendations will be implemented here!`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.headerEmoji}>🤖</Text>
                    <Text style={styles.title}>AI Food Assistant</Text>
                    <Text style={styles.subtitle}>How are you feeling today?</Text>
                </View>

                <View style={styles.moodGrid}>
                    <Text style={styles.sectionTitle}>🎭 Recommended Moods</Text>

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
                            <View style={styles.moodCardContent}>
                                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                <View style={styles.moodTextContainer}>
                                    <Text style={styles.moodTitle}>{mood.title}</Text>
                                    <Text style={styles.moodDescription}>{mood.description}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* TODO: Add AI recommendations display section here */}
                {/* This section will show personalized food recommendations based on selected mood */}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingBottom: theme.spacing.xl,
    },
    header: {
        alignItems: 'center',
        paddingVertical: theme.spacing.l,
        paddingHorizontal: theme.spacing.m,
    },
    headerEmoji: {
        fontSize: 60,
        marginBottom: theme.spacing.s,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    moodGrid: {
        paddingHorizontal: theme.spacing.m,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
        paddingLeft: theme.spacing.xs,
    },
    moodCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        marginBottom: theme.spacing.m,
        ...theme.shadows.small,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    moodCardSelected: {
        borderColor: theme.colors.primary,
        ...theme.shadows.medium,
    },
    moodCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.m,
    },
    moodEmoji: {
        fontSize: 40,
        marginRight: theme.spacing.m,
    },
    moodTextContainer: {
        flex: 1,
    },
    moodTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    moodDescription: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
});
