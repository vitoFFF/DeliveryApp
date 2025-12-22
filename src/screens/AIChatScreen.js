import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, StatusBar, ActivityIndicator, Alert, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Sparkles, Settings, Plus, X, Check, ScanLine } from 'lucide-react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

// REPLACE WITH YOUR ACTUAL KEY
const API_KEY = "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";

const AIChatScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);

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

  const MODELS = [
    { id: 'xiaomi/mimo-v2-flash:free', name: 'Xiaomi Mimo V2' },
    { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1' },
    { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B' },
    { id: 'meta-llama/llama-3.1-405b-instruct:free', name: 'Llama 3.1 405B' },
  ];

  const [messages, setMessages] = useState([
    { id: '1', text: "Hello! I'm your AI Assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const startNewChat = () => {
    setMessages([
      { id: Date.now().toString(), text: "Hello! I'm your AI Assistant. How can I help you today?", sender: 'ai' }
    ]);
  };

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
    setIsLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://deliveryapp.com",
          "X-Title": "DeliveryApp AI",
        },
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
        text: aiText,
        sender: 'ai'
      };

      setMessages(prev => [...prev, aiMessage]);

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

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
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
              <Text style={styles.modalTitle}>Select AI Model</Text>
              <TouchableOpacity onPress={() => setIsSettingsVisible(false)} style={styles.closeButton}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.modelList}>
              {MODELS.map((model) => (
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
    backgroundColor: '#f2f2f7',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#333',
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
  }
});

export default AIChatScreen;