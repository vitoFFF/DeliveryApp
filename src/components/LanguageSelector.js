import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react-native';
import { theme } from '../utils/theme';

const LanguageSelector = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.iconContainer}>
                    <Languages size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.label}>{t('language.change_language')}</Text>
                    <Text style={styles.subtitle}>
                        {i18n.language === 'en' ? 'English' : i18n.language === 'ka' ? 'ქართული' : 'Русский'}
                    </Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        i18n.language === 'en' && styles.activeButton,
                    ]}
                    onPress={() => changeLanguage('en')}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            i18n.language === 'en' && styles.activeButtonText,
                        ]}
                    >
                        EN
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        i18n.language === 'ka' && styles.activeButton,
                    ]}
                    onPress={() => changeLanguage('ka')}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            i18n.language === 'ka' && styles.activeButtonText,
                        ]}
                    >
                        KA
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        i18n.language === 'ru' && styles.activeButton,
                    ]}
                    onPress={() => changeLanguage('ru')}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            i18n.language === 'ru' && styles.activeButtonText,
                        ]}
                    >
                        RU
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: 56, // Align with the start of the text (40px icon + 16px margin)
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    activeButton: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    buttonText: {
        color: '#4B5563',
        fontSize: 13,
        fontWeight: '600',
    },
    activeButtonText: {
        color: '#FFFFFF',
    },
});

export default LanguageSelector;
