import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, StatusBar, ActivityIndicator, Alert, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Sparkles, Settings, Plus, X, Check, ScanLine } from 'lucide-react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

// REPLACE WITH YOUR ACTUAL KEY
const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || "";
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || "";

const AIChatScreen = ({ navigation }) => {
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
    const userName = user?.displayName || '';
    return `Hello${userName ? ' ' + userName : ''}! I'm your AI Assistant. How can I help you today?`;
  };

  const [messages, setMessages] = useState([
    { id: '1', text: getWelcomeMessage(), sender: 'ai' }
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
      { id: Date.now().toString(), text: getWelcomeMessage(), sender: 'ai' }
    ]);
    setShowChips(true);
  };

  const handleChipPress = (text) => {
    setInput(text);
    sendMessage();
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

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Simple check for placeholder
    if (API_KEY.includes("****")) {
      Alert.alert("Configuration Error", "Please replace the API_KEY placeholder in the code with your actual OpenRouter key.");
      return;
    }

    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowChips(false);
    setIsLoading(true);

    const provider = PROVIDERS[selectedProvider];

    // Simple check for placeholder
    if (provider.apiKey.includes("YOUR_") || provider.apiKey.includes("****")) {
      Alert.alert("Configuration Error", `Please replace the API key placeholder for ${selectedProvider} in the code.`);
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
            { "role": "system", "content": "You are a helpful, professional, and concise AI assistant integrated into a delivery application. Respond in a friendly application style." },
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
      Alert.alert("Error", `AI Request Failed: ${error.message}`);
      setMessages(prev => [...prev, { id: Date.now().toString(), text: "Sorry, I encountered an error connecting to the AI. Please check your API key / internet connection.", sender: 'ai' }]);
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
          <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
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
          <View style={styles.chipsContainer}>
            {['Where is my order?', 'Change delivery address', 'I cut my finger'].map((text, chipIndex) => (
              <TouchableOpacity key={chipIndex} onPress={() => handleChipPress(text)}>
                <LinearGradient
                  colors={['#f8f9fa', '#e9ecef']}
                  style={styles.chip}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.chipText}>{text}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Add generous padding to ensure input clears the bottom tab bar and safe area
  const bottomPadding = Platform.OS === 'android' ? tabBarHeight + 75 : tabBarHeight + 45;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Sparkles size={24} color="#007AFF" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>Delivery Chat</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={startNewChat} style={styles.headerButton}>
            <Plus size={22} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSettingsVisible(true)} style={styles.headerButton}>
            <Settings size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

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
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask anything..."
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Send size={20} color="#fff" />}
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
              <Text style={styles.modalTitle}>AI Settings</Text>
              <TouchableOpacity onPress={() => setIsSettingsVisible(false)} style={styles.closeButton}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Provider</Text>
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

            <Text style={styles.sectionTitle}>Model</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 0.5,
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
    color: '#0F172A',
    fontWeight: '500',
    lineHeight: 24,
  },
  inputWrapper: {
    // padding is added dynamically via style prop
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    marginLeft: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
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
    paddingVertical: 10,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chipText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  }
});

export default AIChatScreen;