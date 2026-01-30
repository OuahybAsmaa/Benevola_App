// screens/MissionDetailScreen.tsx - Version complète avec avatars
import { useState, useRef, useEffect } from "react"
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  TextInput, 
  Modal,
  Platform,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../components/MobileHeader"
import { useMissionDetail } from "../hooks/useMissionDetail"
import { colors} from "../style/theme"
import { commonStyles } from "../style/common"
import { styles } from '../style/benevole/MissionDetailScreen.style'

interface Message {
  id: string
  sender: string
  senderRole: "volunteer" | "organizer"
  content: string
  timestamp: string
  senderAvatar?: string
}

interface MissionDetailScreenProps {
  missionId: string | null
  onNavigate: (screen: string) => void
  organizerName?: string
}

export default function MissionDetailScreen({ missionId, onNavigate }: MissionDetailScreenProps) {
  const {
    mission,
    isLoading,
    error,
    isRegistered,
    isFavorite,
    toggleRegistration,
    toggleFavorite,
  } = useMissionDetail(missionId)

  const [showMessaging, setShowMessaging] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      sender: "Organisateur", 
      senderRole: "organizer", 
      content: "Bienvenue! Avez-vous des questions?", 
      timestamp: "10:30",
      senderAvatar: "ON"
    },
    { 
      id: "2", 
      sender: "Vous", 
      senderRole: "volunteer", 
      content: "Bonjour, quels sont les horaires?", 
      timestamp: "10:35",
      senderAvatar: "VS"
    },
    { 
      id: "3", 
      sender: "Organisateur", 
      senderRole: "organizer", 
      content: "La mission commence à 9h et se termine vers 13h", 
      timestamp: "10:36",
      senderAvatar: "ON"
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)

  // Gestion du clavier pour Android
  useEffect(() => {
    if (Platform.OS === "android") {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        (e) => {
          setKeyboardHeight(e.endCoordinates.height)
        }
      )
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardHeight(0)
        }
      )

      return () => {
        keyboardDidShowListener.remove()
        keyboardDidHideListener.remove()
      }
    }
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <View style={commonStyles.container}>
        <MobileHeader showBack onBack={() => onNavigate("home")} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    )
  }

  // Error state
  if (error || !mission) {
    return (
      <View style={commonStyles.container}>
        <MobileHeader showBack onBack={() => onNavigate("home")} />
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.error} />
          <Text style={styles.errorText}>{error || "Mission introuvable"}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => onNavigate("home")}>
            <Text style={styles.retryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const handleRegistration = async () => {
    try {
      await toggleRegistration()
    } catch (err) {
      console.error("Registration error:", err)
      // Vous pouvez afficher un toast/alert ici
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: String(messages.length + 1),
        sender: "Vous",
        senderRole: "volunteer",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        senderAvatar: "VS"
      }
      setMessages([...messages, message])
      setNewMessage("")
      
      // Faire défiler vers le bas
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }

  return (
    <View style={commonStyles.container}>
      <MobileHeader showBack onBack={() => onNavigate("home")} />

      <ScrollView style={commonStyles.scrollView}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={mission.image} style={styles.image} resizeMode="cover" />
          
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowMessaging(!showMessaging)}>
              <Ionicons
                name={showMessaging ? "mail" : "mail-outline"}
                size={24}
                color={showMessaging ? colors.primary : colors.text.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? colors.error : colors.text.primary}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{mission.category}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          {/* Organisation */}
          <View style={styles.organizationRow}>
            <View style={styles.orgAvatar}>
              <Text style={styles.orgAvatarText}>
                {mission.organization.name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.orgInfo}>
              <View style={styles.orgNameRow}>
                <Text style={styles.orgName}>{mission.organization.name}</Text>
                {mission.organization.verified && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.info} />
                )}
              </View>
              <Text style={styles.orgVerified}>Organisation vérifiée</Text>
            </View>
          </View>

          {/* Titre */}
          <Text style={styles.title}>{mission.title}</Text>

          {/* Infos rapides */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>{mission.date}</Text>
            </View>

            <View style={[styles.infoItem, styles.timeItem]}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>{mission.time}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>
                {mission.participants}/{mission.maxParticipants} inscrits
              </Text>
            </View>
          </View>

          {/* Description */}
          {mission.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{mission.description}</Text>
            </View>
          )}

          {/* Infos pratiques */}
          {mission.requirements && mission.requirements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ce qu'il faut savoir</Text>
              {mission.requirements.map((req, index) => (
                <View key={index} style={styles.requirementRow}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Lieu */}
          {mission.address && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lieu</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={20} color={colors.primary} />
                <Text style={styles.locationText}>{mission.address}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal Messaging - AVEC AVATARS */}
      <Modal
        visible={showMessaging}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowMessaging(false)}
      >
        <View style={styles.modalContainer}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          
          {/* Header personnalisé pour la modale */}
          <View style={styles.customHeader}>
            <TouchableOpacity 
              onPress={() => setShowMessaging(false)}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>
                Contacter l'organisateur
              </Text>
              <Text style={styles.headerSubtitle}>{mission.title}</Text>
            </View>
            
            <View style={{ width: 40 }} />
          </View>

          {/* Conversation View - AVEC AVATARS */}
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          >
            <View style={styles.conversationContainer}>
              {/* Messages avec avatars */}
              <ScrollView 
                ref={scrollViewRef}
                style={styles.messagesContent}
                contentContainerStyle={styles.messagesContentContainer}
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              >
                {messages.length === 0 ? (
                  <View style={styles.emptyMessagingContainer}>
                    <Ionicons name="mail-outline" size={48} color="#d1d5db" />
                    <Text style={styles.emptyMessagingText}>Aucun message</Text>
                  </View>
                ) : (
                  messages.map((msg) => (
                    <View
                      key={msg.id}
                      style={[
                        styles.messageContainer,
                        msg.senderRole === "volunteer" && styles.messageContainerRight,
                      ]}
                    >
                      {/* Avatar pour l'organisateur (à gauche) */}
                      {msg.senderRole === "organizer" && (
                        <View style={styles.avatarContainer}>
                          <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                              {msg.senderAvatar || "O"}
                            </Text>
                          </View>
                        </View>
                      )}
                      
                      {/* Bulle de message */}
                      <View
                        style={[
                          styles.messageBubble,
                          msg.senderRole === "volunteer" ? styles.messageVolunteer : styles.messageOrganizer,
                        ]}
                      >
                        <Text style={[
                          styles.messageText,
                          msg.senderRole === "volunteer" && styles.messageVolunteerText
                        ]}>
                          {msg.content}
                        </Text>
                        <Text style={[
                          styles.messageTime,
                          msg.senderRole === "volunteer" ? styles.messageVolunteerTime : styles.messageOrganizerTime
                        ]}>
                          {msg.timestamp}
                        </Text>
                      </View>

                      {/* Avatar pour le bénévole (à droite) */}
                      {msg.senderRole === "volunteer" && (
                        <View style={styles.avatarContainer}>
                          <View style={[styles.avatar, styles.volunteerAvatar]}>
                            <Text style={styles.avatarText}>
                              {msg.senderAvatar || "V"}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  ))
                )}
                {/* Espace en bas pour éviter que l'input cache les messages */}
                <View style={{ height: Platform.OS === "ios" ? 100 : 120 }} />
              </ScrollView>

              {/* Input avec gestion manuelle pour Android */}
              <View style={[
                styles.replyWrapper,
                Platform.OS === "android" && keyboardHeight > 0 && { 
                  marginBottom: keyboardHeight + 15
                }
              ]}>
                <View style={styles.replyContainer}>
                  <TextInput
                    style={styles.replyInput}
                    placeholder="Écrivez votre message..."
                    placeholderTextColor="#999"
                    multiline
                    value={newMessage}
                    onChangeText={setNewMessage}
                    onSubmitEditing={handleSendMessage}
                    returnKeyType="send"
                    blurOnSubmit={false}
                  />
                  <TouchableOpacity 
                    style={[styles.replyButton, !newMessage.trim() && styles.replyButtonDisabled]}
                    onPress={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Ionicons name="send" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Bouton bas */}
      <View style={styles.bottomButton}>
        <TouchableOpacity
          style={[styles.registerButton, isRegistered && styles.registeredButton]}
          onPress={handleRegistration}
        >
          {isRegistered && (
            <Ionicons name="checkmark-circle" size={20} color="white" style={{ marginRight: 8 }} />
          )}
          <Text style={styles.registerText}>
            {isRegistered ? "Inscription confirmée" : "S'inscrire à cette mission"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

