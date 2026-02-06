// src/screen/MessagingScreen.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import MobileHeader from "../components/MobileHeader";
import { styles } from "../style/benevole/MessagingScreen.style";
import { colors } from "../style/theme";
import { getConversation, markAsRead as apiMarkAsRead, Message } from "../api/messages";

interface MessagingScreenProps {
  organizerId: string;
  organizerName: string;
  missionId?: string;
  missionTitle?: string;
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
    canGoBack: boolean;
  };
  onNavigate: (screen: string, params?: any) => void;
}

const MessagingScreen: React.FC<MessagingScreenProps> = ({
  organizerId,
  organizerName,
  missionId,
  missionTitle,
  navigation,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasScrolledToBottom = useRef(false);

  const {
    connected,
    newMessage: socketNewMessage,
    typingUsers,
    sendMessage: socketSendMessage,
    markAsRead,
    sendTyping,
    sendStopTyping,
  } = useSocket();

  useEffect(() => {
    if (Platform.OS === "android") {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        (e) => { 
          setKeyboardHeight(e.endCoordinates.height) 
        }
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => { 
          setKeyboardHeight(0) 
        }
      );
      
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }
  }, []);

  // ✅ AJOUT - Cleanup du typing timeout au démontage
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, []);

  const scrollToBottom = (animated = true) => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated });
        hasScrolledToBottom.current = true;
      }, 100);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !hasScrolledToBottom.current) {
      scrollToBottom(false);
    }
  }, [messages]);

  useEffect(() => {
    if (socketNewMessage) {
      
      const isForThisConversation =
        (socketNewMessage.senderId === organizerId && 
         socketNewMessage.receiverId === user?.id) ||
        (socketNewMessage.senderId === user?.id && 
         socketNewMessage.receiverId === organizerId);

      const isSameMission = !missionId || socketNewMessage.missionId === missionId;

      if (isForThisConversation && isSameMission) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === socketNewMessage.id)) {
            return prev;
          }
          return [...prev, socketNewMessage];
        });

        scrollToBottom();
      }
    }
  }, [socketNewMessage]);

  useEffect(() => {
    setIsOtherUserTyping(typingUsers.has(organizerId));
  }, [typingUsers, organizerId]);

  const loadMessages = async () => {
    setLoading(true);
    hasScrolledToBottom.current = false;
    try {
      const { messages: fetchedMessages } = await getConversation(
        organizerId,
        missionId,
        1,
        50
      );
      setMessages(fetchedMessages);

      if (fetchedMessages.length > 0) {
        await apiMarkAsRead(organizerId, missionId);
      }

      setTimeout(() => {
        scrollToBottom(false);
      }, 200);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending || !user) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage("");

    sendStopTyping(organizerId, missionId);

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      receiverId: organizerId,
      missionId,
      content: messageContent,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    scrollToBottom();

    try {
      if (connected) {
        socketSendMessage(organizerId, messageContent, missionId);
      } else {
      }
    } catch (error) {
      setMessages((prev) => prev.filter(m => m.id !== tempMessage.id));
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  const handleTextChange = (text: string) => {
    setNewMessage(text);

    if (!connected || !text.trim()) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      sendStopTyping(organizerId, missionId);
      return;
    }

    sendTyping(organizerId, missionId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendStopTyping(organizerId, missionId);
    }, 2000);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      <MobileHeader
        title={organizerName}
        subtitle={missionTitle}
        showBack
        onBack={navigation.goBack}
      />

      {!connected && (
        <View style={styles.connectionBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color="#ff6b6b" />
          <Text style={styles.connectionText}>
            Mode hors ligne - Les messages seront envoyés plus tard
          </Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.conversationContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContentContainer}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              if (!hasScrolledToBottom.current && messages.length > 0) {
                scrollToBottom(false);
              }
            }}
          >
            <>
              {messages.length === 0 && !loading ? (
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="chatbubbles-outline"
                    size={64}
                    color="#999999"
                    style={styles.emptyIcon}
                  />
                  <Text style={styles.emptyText}>
                    Aucun message pour le moment.{"\n"}
                    Démarrez la conversation !
                  </Text>
                </View>
              ) : (
                <>
                  {messages.map((message) => {
                    const isMe = message.senderId === user?.id;
                    return (
                      <View
                        key={message.id}
                        style={[
                          styles.messageBubble,
                          isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,
                            isMe ? styles.messageTextMe : styles.messageTextOther,
                          ]}
                        >
                          {message.content}
                        </Text>
                        <Text
                          style={[
                            styles.messageTime,
                            isMe ? styles.messageTimeMe : styles.messageTimeOther,
                          ]}
                        >
                          {formatTime(message.createdAt)}
                        </Text>
                      </View>
                    );
                  })}

                  {isOtherUserTyping && (
                    <View style={styles.typingIndicator}>
                      <View style={styles.typingDot} />
                      <View style={[styles.typingDot, { marginLeft: 4 }]} />
                      <View style={[styles.typingDot, { marginLeft: 4 }]} />
                      <Text style={styles.typingText}>
                        {organizerName} est en train de taper...
                      </Text>
                    </View>
                  )}
                </>
              )}
            </>
            
            <View style={{ height: Platform.OS === "ios" ? 100 : 120 }} />
          </ScrollView>

          <View
            style={[
              styles.replyWrapper,
              Platform.OS === "android" && keyboardHeight > 0 && {
                marginBottom: keyboardHeight + 15,
              },
            ]}
          >
            <View style={styles.replyContainer}>
              <TextInput
                style={styles.replyInput}
                placeholder="Écrivez votre message..."
                placeholderTextColor="#999"
                multiline
                value={newMessage}
                onChangeText={handleTextChange}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
                blurOnSubmit={false}
                editable={!sending}
              />
              <TouchableOpacity
                style={[
                  styles.replyButton,
                  (!newMessage.trim() || sending) && styles.replyButtonDisabled
                ]}
                onPress={handleSendMessage}
                disabled={!newMessage.trim() || sending}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="send" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MessagingScreen;