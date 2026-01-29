"use client";

// screens/MissionDetailScreen.tsx - Version complète avec avatars
import { useState, useRef, useEffect } from "react"
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
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
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from "../styles/theme"
import { commonStyles } from "../styles/common"

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

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  
  loadingText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  
  errorText: {
    fontSize: fontSize.lg,
    color: colors.error,
    textAlign: "center",
    marginTop: spacing.md,
  },
  
  retryButton: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  
  retryButtonText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  
  imageContainer: {
    height: 256,
    position: "relative",
  },
  
  image: {
    width: "100%",
    height: "100%",
  },
  
  imageActions: {
    flexDirection: "column",
    gap: spacing.sm,
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
  },
  
  actionButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
  
  categoryBadge: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  
  categoryText: {
    color: colors.text.inverse,
    fontWeight: fontWeight.semibold,
  },
  
  detailsContainer: {
    padding: spacing.xl,
  },
  
  organizationRow: {
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  
  orgAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  
  orgAvatarText: {
    color: colors.text.inverse,
    fontWeight: fontWeight.bold,
  },
  
  orgInfo: {
    flex: 1,
  },
  
  orgNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  
  orgName: {
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  
  orgVerified: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.lg,
    color: colors.text.primary,
  },
  
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.xxl,
  },
  
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  
  timeItem: {
    marginLeft: "4%",
  },
  
  infoText: {
    fontSize: fontSize.base,
    color: colors.text.primary,
  },
  
  section: {
    marginBottom: spacing.xxl,
  },
  
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  
  description: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    lineHeight: 24,
  },
  
  requirementRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  
  requirementText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  
  locationRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  
  locationText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  
  bottomButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.medium,
  },
  
  registerButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  
  registeredButton: {
    backgroundColor: colors.success,
  },
  
  registerText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingTop: Platform.OS === "ios" ? 50 : 12,
  },
  
  backButton: {
    padding: 4,
  },
  
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  // Conversation Styles - CORRIGÉ POUR MOINS D'ESPACE
  conversationContainer: {
    flex: 1,
  },
  
  messagesContent: {
    flex: 1,
  },
  
  messagesContentContainer: {
    paddingHorizontal: 12, // Réduit de 16 à 12
    paddingVertical: 12,
  },
  
  emptyMessagingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  
  emptyMessagingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },

  // Styles pour les messages avec avatars - CORRIGÉ POUR MOINS D'ESPACE
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8, // Seulement en bas
  },

  messageContainerRight: {
    justifyContent: "flex-end",
  },

  avatarContainer: {
    width: 36,
    marginHorizontal: 6, // Réduit
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  volunteerAvatar: {
    backgroundColor: "#10b981", // Vert pour le bénévole
  },

  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  messageBubble: {
    maxWidth: "76%", // Augmenté pour utiliser plus d'espace
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    minHeight: 44, // Hauteur minimale
  },

  messageVolunteer: {
    backgroundColor: "#7B68EE", // Violet pour le bénévole
    borderBottomRightRadius: 6,
  },

  messageOrganizer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderBottomLeftRadius: 6,
  },

  messageText: {
    fontSize: 15,
    color: "#111",
    marginBottom: 4,
    lineHeight: 20,
  },

  messageVolunteerText: {
    color: "white",
  },

  messageTime: {
    fontSize: 11,
    alignSelf: "flex-end",
    marginTop: 2,
  },

  messageVolunteerTime: {
    color: "rgba(255, 255, 255, 0.85)",
  },

  messageOrganizerTime: {
    color: "#666",
  },

  // Input Styles
  replyWrapper: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingBottom: Platform.OS === "android" ? 40 : 0,
  },
  
  replyContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  
  replyInput: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    fontSize: 14,
    color: "#111",
    maxHeight: 100,
    minHeight: 40,
  },
  
  replyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  
  replyButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
})