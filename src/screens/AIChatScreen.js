import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, StatusBar, ActivityIndicator, Alert, Modal, Pressable, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Sparkles, Settings, Plus, X, Check, ScanLine, Package, MapPin, Bandage, Utensils, Coffee, Star, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// REPLACE WITH YOUR ACTUAL KEY
const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || "";
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || "";

// Chip configurations with icons and gradients
const CHIP_CONFIGS = [
  {
    key: 'order_status',
    icon: Package,
    gradient: ['#667eea', '#764ba2'],
    emoji: '📦'
  },
  {
    key: 'change_address',
    icon: MapPin,
    gradient: ['#f093fb', '#f5576c'],
    emoji: '📍'
  },
  {
    key: 'cut_finger',
    icon: Bandage,
    gradient: ['#4facfe', '#00f2fe'],
    emoji: '🩹'
  },
  {
    key: 'hungry',
    icon: Utensils,
    gradient: ['#fa709a', '#fee140'],
    emoji: '🍽️'
  },
  {
    key: 'drink',
    icon: Coffee,
    gradient: ['#a8edea', '#fed6e3'],
    emoji: '☕'
  },
  {
    key: 'recommend',
    icon: Star,
    gradient: ['#ffecd2', '#fcb69f'],
    emoji: '⭐'
  },
];

// Constants for wheel carousel
const ITEM_HEIGHT = 72;
const VISIBLE_ITEMS = 5;
const CAROUSEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

// Premium 3D Wheel Carousel Component
const VerticalChipsCarousel = ({ t, onChipPress }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const scaleValues = useRef(
    CHIP_CONFIGS.map(() => new Animated.Value(1))
  ).current;

  // Set initial scroll position to center the middle chip
  useEffect(() => {
    // Calculate middle index (for 6 items: index 2 or 3)
    const middleIndex = Math.floor(CHIP_CONFIGS.length / 2);
    const initialScrollY = middleIndex * ITEM_HEIGHT;

    // Set initial animated value
    scrollY.setValue(initialScrollY);

    // Scroll to middle after a brief delay to ensure layout is ready
    const timeout = setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: initialScrollY,
        animated: false,
      });
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  const handlePressIn = (index) => {
    Animated.spring(scaleValues[index], {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(scaleValues[index], {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  const handlePress = (text, index) => {
    // Haptic-like visual feedback
    Animated.sequence([
      Animated.timing(scaleValues[index], {
        toValue: 0.88,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValues[index], {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 200,
      }),
    ]).start(() => {
      onChipPress(text);
    });
  };

  const renderChip = (config, index) => {
    const IconComponent = config.icon;
    const chipText = t(`ai_chat_screen.chips.${config.key}`);

    // Calculate 3D wheel transformations
    const inputRange = [
      (index - 2) * ITEM_HEIGHT,
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT,
      (index + 2) * ITEM_HEIGHT,
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.7, 0.85, 1, 0.85, 0.7],
      extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.3, 0.6, 1, 0.6, 0.3],
      extrapolate: 'clamp',
    });

    const translateX = scrollY.interpolate({
      inputRange,
      outputRange: [30, 12, 0, 12, 30],
      extrapolate: 'clamp',
    });

    const rotateX = scrollY.interpolate({
      inputRange,
      outputRange: ['-25deg', '-12deg', '0deg', '12deg', '25deg'],
      extrapolate: 'clamp',
    });

    const focusOpacity = scrollY.interpolate({
      inputRange,
      outputRange: [0, 0.2, 1, 0.2, 0],
      extrapolate: 'clamp',
    });

    const activeBorderColor = scrollY.interpolate({
      inputRange,
      outputRange: ['rgba(226, 232, 240, 0)', 'rgba(226, 232, 240, 0.3)', 'rgba(99, 102, 241, 0.5)', 'rgba(226, 232, 240, 0.3)', 'rgba(226, 232, 240, 0)'],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={config.key}
        style={[
          carouselStyles.chipOuter,
          {
            height: ITEM_HEIGHT,
            opacity,
            transform: [
              { perspective: 800 },
              { scale: Animated.multiply(scale, scaleValues[index]) },
              { translateX },
              { rotateX },
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          onPressIn={() => handlePressIn(index)}
          onPressOut={() => handlePressOut(index)}
          onPress={() => handlePress(chipText, index)}
          style={carouselStyles.chipTouchable}
        >
          <Animated.View style={[carouselStyles.chipCard, { borderColor: activeBorderColor }]}>
            {/* Minimalist Premium active glow */}
            <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: focusOpacity }]}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.6)', 'rgba(99, 102, 241, 0.05)', 'rgba(255, 255, 255, 0.6)']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>

            {/* Glowing gradient background base */}
            <LinearGradient
              colors={[...config.gradient, 'rgba(255,255,255,0.9)']}
              style={carouselStyles.glowBg}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />

            {/* Inner card with glassmorphism */}
            <View style={carouselStyles.innerCard}>
              {/* Gradient accent bar */}
              <LinearGradient
                colors={config.gradient}
                style={carouselStyles.accentBar}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />

              {/* Icon container with gradient */}
              <View style={carouselStyles.iconWrapper}>
                <LinearGradient
                  colors={config.gradient}
                  style={carouselStyles.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <IconComponent size={20} color="#fff" strokeWidth={2.5} />
                </LinearGradient>
              </View>

              {/* Text content */}
              <View style={carouselStyles.textContainer}>
                <Text style={carouselStyles.chipTitle} numberOfLines={1}>
                  {chipText}
                </Text>
              </View>
            </View>

            {/* Refined Active Highlights (Minimalist) */}
            <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: focusOpacity }]} pointerEvents="none">
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0)']}
                style={carouselStyles.focusHighlightTop}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={carouselStyles.container}>
      {/* Top fade gradient */}
      <LinearGradient
        colors={['#fff', 'rgba(255,255,255,0)']}
        style={carouselStyles.fadeTop}
        pointerEvents="none"
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate={Platform.OS === 'ios' ? 0.92 : 0.89}
        nestedScrollEnabled={true}
        scrollEnabled={true}
        bounces={true}
        overScrollMode="always"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={8}
        contentContainerStyle={carouselStyles.scrollContent}
        style={{ height: CAROUSEL_HEIGHT }}
      >
        {/* Top padding for centering */}
        <View style={{ height: ITEM_HEIGHT * 2 }} />

        {CHIP_CONFIGS.map((config, index) => renderChip(config, index))}

        {/* Bottom padding for centering */}
        <View style={{ height: ITEM_HEIGHT * 2 }} />
      </Animated.ScrollView>

      {/* Bottom fade gradient */}
      <LinearGradient
        colors={['rgba(255,255,255,0)', '#fff']}
        style={carouselStyles.fadeBottom}
        pointerEvents="none"
      />
    </View>
  );
};

// Carousel-specific styles
const carouselStyles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginHorizontal: 4,
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 10,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 10,
  },
  focusIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 4,
    right: 4,
    height: ITEM_HEIGHT,
    borderRadius: 22,
    overflow: 'hidden',
    zIndex: 5,
  },
  focusGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  focusHighlightTop: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
  },
  chipOuter: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  chipTouchable: {
    flex: 1,
    justifyContent: 'center',
  },
  chipCard: {
    flex: 1,
    borderRadius: 18,
    padding: 3,
    marginVertical: 4,
  },
  glowBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
    opacity: 0.15,
  },
  innerCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 10,
    paddingRight: 12,
    paddingLeft: 4,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  iconWrapper: {
    marginLeft: 12,
    marginRight: 14,
  },
  iconGradient: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  chipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
});

const AIChatScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Safely get tab bar height and safe area insets
  let tabBarHeight = 0;
  try {
    tabBarHeight = useBottomTabBarHeight();
  } catch (e) {
    tabBarHeight = Platform.OS === 'ios' ? 85 : 50;
  }

  const PROVIDERS = {
    OpenRouter: {
      models: [
        { id: 'xiaomi/mimo-v2-flash:free', name: 'Xiaomi Mimo V2' },
        { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1' },
        { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B' },
        { id: 'meta-llama/llama-3.1-405b-instruct:free', name: 'Llama 3.1 405B' },
      ],
      apiKey: API_KEY,
      apiUrl: "https://openrouter.ai/api/v1/chat/completions",
    },
    Groq: {
      models: [
        { id: 'meta-llama/llama-4-maverick-17b-128e-instruct', name: 'Llama 4 Maverick' },
        { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B' },
        // Add other Groq models here if needed
      ],
      apiKey: GROQ_API_KEY,
      apiUrl: "https://api.groq.com/openai/v1/chat/completions",
    },
  };

  const getWelcomeMessage = () => {
    return t('ai_chat_screen.welcome_message');
  };

  const [messages, setMessages] = useState([
    { id: 'welcome-message', text: getWelcomeMessage(), sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('Groq');
  const [selectedModel, setSelectedModel] = useState(PROVIDERS.Groq.models[0].id);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const typingInterval = useRef(null);

  const startNewChat = () => {
    setMessages([
      { id: 'welcome-message', text: getWelcomeMessage(), sender: 'ai' }
    ]);
    setShowChips(true);
  };

  const handleChipPress = (text) => {
    setInput(text);
    sendMessage(text);
  };

  const animateText = (fullText, messageId) => {
    let currentText = '';
    let index = 0;
    // Constant writing speed: ~20ms per character
    const delay = 25;

    if (typingInterval.current) clearInterval(typingInterval.current);

    typingInterval.current = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText.charAt(index);
        index++;
        setMessages(prev => prev.map(msg =>
          msg.id === messageId
            ? { ...msg, text: currentText }
            : msg
        ));
      } else {
        clearInterval(typingInterval.current);
        typingInterval.current = null;
      }
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (typingInterval.current) clearInterval(typingInterval.current);
    };
  }, []);

  const sendMessage = async (textOverride = null) => {
    const messageText = typeof textOverride === 'string' ? textOverride : input;

    if (!messageText.trim()) return;

    // Simple check for placeholder
    if (API_KEY.includes("****")) {
      Alert.alert(t('ai_chat_screen.error_config'), t('ai_chat_screen.error_api_key'));
      return;
    }

    const userMessage = { id: Date.now().toString(), text: messageText, sender: 'user' };
    setMessages(prev => {
      // Remove welcome message if it's the only message present
      if (prev.length === 1 && prev[0].id === 'welcome-message') {
        return [userMessage];
      }
      return [...prev, userMessage];
    });
    setInput('');
    setShowChips(false);
    setIsLoading(true);

    const provider = PROVIDERS[selectedProvider];

    // Simple check for placeholder
    if (provider.apiKey.includes("YOUR_") || provider.apiKey.includes("****")) {
      Alert.alert(t('ai_chat_screen.error_config'), t('ai_chat_screen.error_api_key'));
      setIsLoading(false);
      return;
    }

    try {
      const headers = {
        "Authorization": `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
      };

      if (selectedProvider === 'OpenRouter') {
        headers["HTTP-Referer"] = "https://deliveryapp.com";
        headers["X-Title"] = "DeliveryApp AI";
      }

      const response = await fetch(provider.apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          "model": selectedModel,
          "messages": [
            { "role": "system", "content": t('ai_chat_screen.system_prompt') },
            ...messages.slice(-10).map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text
            })),
            { "role": "user", "content": userMessage.text }
          ]
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "Unknown API Error");
      }

      const aiText = data.choices?.[0]?.message?.content || "I didn't get a response. Please try again.";

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: "",
        sender: 'ai'
      };

      setMessages(prev => [...prev, aiMessage]);
      animateText(aiText, aiMessage.id);

    } catch (error) {
      console.error("AI Request Failed:", error);
      Alert.alert(t('ai_chat_screen.error_generic'), `AI Request Failed: ${error.message}`);
      setMessages(prev => [...prev, { id: Date.now().toString(), text: t('ai_chat_screen.error_connection'), sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const renderMessage = ({ item, index }) => {
    const isUser = item.sender === 'user';
    const isFirstAIMessage = !isUser && index === 0;
    return (
      <View>
        <View style={[styles.messageWrapper, isUser ? styles.userMessageWrapper : styles.aiMessageWrapper]}>
          {!isUser && (
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.avatarGradient}
              >
                <Sparkles size={16} color="#fff" />
              </LinearGradient>
            </View>
          )}
          <View style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
            isFirstAIMessage && styles.welcomeBubble
          ]}>
            {!isUser && isFirstAIMessage && (
              <LinearGradient
                colors={['#F8FAFC', '#F1F5F9']}
                style={StyleSheet.absoluteFillObject}
              />
            )}
            {isUser && (
              <LinearGradient
                colors={['#007AFF', '#00C6FF']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
              {item.text}
            </Text>
          </View>
        </View>
        {isFirstAIMessage && showChips && (
          <VerticalChipsCarousel
            t={t}
            onChipPress={handleChipPress}
          />
        )}
      </View>
    );
  };

  // Add generous padding to ensure input clears the bottom tab bar and safe area
  const bottomPadding = Platform.OS === 'android' ? tabBarHeight + 75 : tabBarHeight + 45;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <BlurView intensity={80} tint="light" style={styles.headerBlur}>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <LinearGradient
              colors={['#007AFF', '#00C6FF']}
              style={styles.headerIconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Sparkles size={16} color="#fff" />
            </LinearGradient>
            <Text style={styles.headerTitle}>{t('ai_chat_screen.header_title')}</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={startNewChat} style={styles.headerButton}>
              <View style={styles.iconCircle}>
                <Plus size={20} color="#007AFF" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSettingsVisible(true)} style={styles.headerButton}>
              <View style={styles.iconCircle}>
                <Settings size={20} color="#64748B" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={[styles.chatList, { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.keyboardAvoidingView}
      >
        <View style={[
          styles.inputWrapper,
          { paddingBottom: bottomPadding }
        ]}>
          <View style={styles.inputContainer}>
            <View style={styles.inputPrefix}>
              <Sparkles size={18} color="#007AFF" opacity={0.6} />
            </View>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={t('ai_chat_screen.input_placeholder')}
              placeholderTextColor="#94A3B8"
              multiline
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              <LinearGradient
                colors={(!input.trim() || isLoading) ? ['#CBD5E1', '#94A3B8'] : ['#007AFF', '#00C6FF']}
                style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Send size={18} color="#fff" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSettingsVisible}
        onRequestClose={() => setIsSettingsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('ai_chat_screen.settings_title')}</Text>
              <TouchableOpacity onPress={() => setIsSettingsVisible(false)} style={styles.closeButton}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>{t('ai_chat_screen.provider_label')}</Text>
            <View style={styles.providerContainer}>
              {Object.keys(PROVIDERS).map((providerName) => (
                <TouchableOpacity
                  key={providerName}
                  style={[
                    styles.providerButton,
                    selectedProvider === providerName && styles.selectedProviderButton
                  ]}
                  onPress={() => {
                    setSelectedProvider(providerName);
                    setSelectedModel(PROVIDERS[providerName].models[0].id);
                  }}
                >
                  <Text style={[
                    styles.providerButtonText,
                    selectedProvider === providerName && styles.selectedProviderButtonText
                  ]}>
                    {providerName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>{t('ai_chat_screen.model_label')}</Text>
            <View style={styles.modelList}>
              {PROVIDERS[selectedProvider].models.map((model) => (
                <TouchableOpacity
                  key={model.id}
                  style={[
                    styles.modelOption,
                    selectedModel === model.id && styles.selectedModelOption
                  ]}
                  onPress={() => {
                    setSelectedModel(model.id);
                    setIsSettingsVisible(false);
                  }}
                >
                  <View>
                    <Text style={[
                      styles.modelName,
                      selectedModel === model.id && styles.selectedModelText
                    ]}>{model.name}</Text>
                    <Text style={[
                      styles.modelId,
                      selectedModel === model.id && styles.selectedModelId
                    ]}>{model.id.split(':')[0]}</Text>
                  </View>
                  {selectedModel === model.id && (
                    <Check size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerBlur: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  headerIconGradient: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatList: {
    padding: 20,
  },
  messageWrapper: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    overflow: 'hidden', // Required for Inner Gradient
  },
  userBubble: {
    backgroundColor: '#007AFF', // Fallback
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#924decff',
    shadowColor: '#64748B',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#1E293B',
    fontWeight: '500',
    lineHeight: 24,
  },
  welcomeBubble: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
    shadowColor: '#64748B',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    padding: 18,
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputPrefix: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    maxHeight: 120,
    paddingTop: 0,
    paddingBottom: 0,
    fontWeight: '400',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modelList: {
    gap: 12,
  },
  modelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedModelOption: {
    backgroundColor: '#f0f9ff',
    borderColor: '#007AFF',
  },
  modelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  selectedModelText: {
    color: '#007AFF',
  },
  modelId: {
    fontSize: 12,
    color: '#888',
  },
  selectedModelId: {
    color: '#60a5fa',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 10,
  },
  providerContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  providerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedProviderButton: {
    backgroundColor: '#007AFF',
  },
  providerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  selectedProviderButtonText: {
    color: '#fff',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  chipIconContainer: {
    marginRight: 8,
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    letterSpacing: -0.2,
  }
});

export default AIChatScreen;