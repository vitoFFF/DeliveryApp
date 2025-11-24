import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../utils/theme';

const LanguageSelector = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('language.change_language')}</Text>
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
                        English
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
                        ქართული
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: theme.colors.text,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
    },
    activeButton: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    buttonText: {
        color: theme.colors.text,
        fontSize: 14,
    },
    activeButtonText: {
        color: '#FFFFFF',
    },
});

export default LanguageSelector;
