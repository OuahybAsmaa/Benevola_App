// src/screen/organizer/OrganizerMessagingScreen.tsx
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useRef, useEffect } from "react"
import { styles } from '../../style/organizer/OrganizerMessagingScreen.style'
import { useAuth } from "../../hooks/useAuth"
import { useSocket } from "../../hooks/useSocket"
import { 
  getUserConversations, 
  getConversation, 
  markAsRead as apiMarkAsRead,
  Conversation,
  Message 
} from "../../api/messages"

interface OrganizerMessagingScreenProps {
  onNavigate: (screen: string, params?: any) => void
  navigation: {
    goBack: () => void
    canGoBack: boolean
  }
  missionId?: string
  missionTitle?: string
}

export default function OrganizerMessagingScreen({ 
  onNavigate, 
  navigation, 
  missionId,
  missionTitle 
}: OrganizerMessagingScreenProps) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasScrolledToBottom = useRef(false)

  const {
    connected,
    newMessage: socketNewMessage,
    typingUsers,
    sendMessage: socketSendMessage,
    markAsRead,
    sendTyping,
    sendStopTyping,
  } = useSocket()

  useEffect(() => {
    if (Platform.OS === "android") {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        (e) => { setKeyboardHeight(e.endCoordinates.height) }
      )
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => { setKeyboardHeight(0) }
      )
      return () => {
        keyboardDidShowListener.remove()
        keyboardDidHideListener.remove()
      }
    }
  }, [])

useEffect(() => {
  return () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }
}, [])

  useEffect(() => {
    loadConversations()
  }, [])

  const scrollToBottom = (animated = true) => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated })
        hasScrolledToBottom.current = true
      }, 100)
    }
  }

  useEffect(() => {
    if (socketNewMessage) {
      
      if (!selectedConversation) {
        loadConversations()
      }

      if (selectedConversation) {
        const isForThisConversation =
          (socketNewMessage.senderId === selectedConversation.userId && 
           socketNewMessage.receiverId === user?.id) ||
          (socketNewMessage.senderId === user?.id && 
           socketNewMessage.receiverId === selectedConversation.userId)

        const isSameMission = 
          !selectedConversation.missionId || 
          socketNewMessage.missionId === selectedConversation.missionId

        if (isForThisConversation && isSameMission) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === socketNewMessage.id)) {
              return prev
            }
            return [...prev, socketNewMessage]
          })

          scrollToBottom()
        }
      }
    }
  }, [socketNewMessage, selectedConversation])

  useEffect(() => {
    if (messages.length > 0 && !hasScrolledToBottom.current) {
      scrollToBottom(false)
    }
  }, [messages])

  useEffect(() => {
    if (selectedConversation) {
      setIsOtherUserTyping(typingUsers.has(selectedConversation.userId))
    }
  }, [typingUsers, selectedConversation])

  const loadConversations = async () => {
    setLoading(true)
    try {
      const fetchedConversations = await getUserConversations()
      
      if (missionId) {
        setConversations(fetchedConversations.filter(c => c.missionId === missionId))
      } else {
        setConversations(fetchedConversations)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const loadConversationMessages = async (conversation: Conversation) => {
    setLoadingMessages(true)
    hasScrolledToBottom.current = false
    try {
      const { messages: fetchedMessages } = await getConversation(
        conversation.userId,
        conversation.missionId,
        1,
        50
      )
      setMessages(fetchedMessages)

      if (fetchedMessages.length > 0) {
        await apiMarkAsRead(conversation.userId, conversation.missionId)
      }

      setTimeout(() => {
        scrollToBottom(false)
      }, 200)
    } catch (error) {
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setMessageText("")
    setMessages([])
    hasScrolledToBottom.current = false
    loadConversationMessages(conversation)
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || sending || !user) return

    setSending(true)
    const messageContent = messageText.trim()
    setMessageText("")

    sendStopTyping(selectedConversation.userId, selectedConversation.missionId)

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      receiverId: selectedConversation.userId,
      missionId: selectedConversation.missionId,
      content: messageContent,
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempMessage])

    scrollToBottom()

    try {
      if (connected) {
        socketSendMessage(
          selectedConversation.userId,
          messageContent,
          selectedConversation.missionId
        )
      } else {
      }
    } catch (error) {
      setMessages((prev) => prev.filter(m => m.id !== tempMessage.id))
      setMessageText(messageContent)
    } finally {
      setSending(false)
    }
  }

  const handleTextChange = (text: string) => {
    setMessageText(text)

    if (!connected || !text.trim() || !selectedConversation) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
      if (selectedConversation) {
        sendStopTyping(selectedConversation.userId, selectedConversation.missionId)
      }
      return
    }

    sendTyping(selectedConversation.userId, selectedConversation.missionId)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendStopTyping(selectedConversation.userId, selectedConversation.missionId)
    }, 2000)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.customHeader}>
        <TouchableOpacity
          onPress={() => selectedConversation ? setSelectedConversation(null) : navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {selectedConversation ? selectedConversation.userName : "Messages"}
          </Text>
          {!selectedConversation && missionTitle && (
            <Text style={styles.headerSubtitle}>{missionTitle}</Text>
          )}
          {selectedConversation && selectedConversation.missionTitle && (
            <Text style={styles.headerSubtitle}>{selectedConversation.missionTitle}</Text>
          )}
        </View>

        <View style={{ width: 40 }} />
      </View>

      {!connected && (
        <View style={styles.connectionBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color="#ff6b6b" />
          <Text style={styles.connectionText}>
            Mode hors ligne
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7B68EE" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : !selectedConversation ? (
        <View style={styles.volunteersContent}>
          <ScrollView style={styles.volunteersList}>
            {conversations.length === 0 ? (
              <View style={styles.emptyMessagingContainer}>
                <Ionicons name="mail-outline" size={48} color="#d1d5db" />
                <Text style={styles.emptyMessagingText}>Aucun message</Text>
              </View>
            ) : (
              conversations.map((conversation) => (
                <TouchableOpacity
                  key={`${conversation.userId}-${conversation.missionId || 'no-mission'}`}
                  style={styles.volunteerListItem}
                  onPress={() => handleSelectConversation(conversation)}
                >
                  <View style={styles.volunteerListAvatar}>
                    <Text style={styles.volunteerListAvatarText}>
                      {getInitials(conversation.userName)}
                    </Text>
                  </View>
                  <View style={styles.volunteerListInfo}>
                    <View style={styles.volunteerListHeader}>
                      <Text style={styles.volunteerListName}>
                        {conversation.userName}
                      </Text>
                      {conversation.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadBadgeText}>
                            {conversation.unreadCount}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.volunteerListPreview} numberOfLines={1}>
                      {conversation.lastMessage.content}
                    </Text>
                  </View>
                  <View style={styles.volunteerListArrow}>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.conversationContainer}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContent}
              contentContainerStyle={styles.messagesContentContainer}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() => {
                if (!hasScrolledToBottom.current && messages.length > 0) {
                  scrollToBottom(false)
                }
              }}
            >
              <>
                {messages.map((msg) => {
                  const isMe = msg.senderId === user?.id
                  return (
                    <View
                      key={msg.id}
                      style={[
                        styles.messageBubble,
                        isMe ? styles.messageOrganizer : styles.messageVolunteer,
                      ]}
                    >
                      <Text style={[
                        styles.messageText, 
                        isMe && styles.messageOrganizerText
                      ]}>
                        {msg.content}
                      </Text>
                      <Text style={[
                        styles.messageTime, 
                        isMe && styles.messageOrganizerTime
                      ]}>
                        {formatTime(msg.createdAt)}
                      </Text>
                    </View>
                  )
                })}

                {isOtherUserTyping && (
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDot} />
                    <View style={[styles.typingDot, { marginLeft: 4 }]} />
                    <View style={[styles.typingDot, { marginLeft: 4 }]} />
                    <Text style={styles.typingText}>
                      {selectedConversation.userName} est en train de taper...
                    </Text>
                  </View>
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
                  placeholder="Répondre au bénévole..."
                  placeholderTextColor="#999"
                  multiline
                  value={messageText}
                  onChangeText={handleTextChange}
                  onSubmitEditing={handleSendMessage}
                  returnKeyType="send"
                  blurOnSubmit={false}
                  editable={!sending}
                />
                <TouchableOpacity
                  style={[
                    styles.replyButton, 
                    (!messageText.trim() || sending) && styles.replyButtonDisabled
                  ]}
                  onPress={handleSendMessage}
                  disabled={!messageText.trim() || sending}
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
      )}
    </View>
  )
}