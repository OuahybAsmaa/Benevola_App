import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,  
  Modal, 
  TextInput,
  Platform,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../../components/MobileHeader"
import { useAuth } from "../../hooks/useAuth"
import { useState, useRef, useEffect } from "react"
import { styles } from '../../style/organizer/OrganizerDashboardScreen.style'

interface OrganizerDashboardScreenProps {
  onNavigate: (screen: string) => void
}

interface VolunteerMessage {
  id: string
  volunteerName: string
  volunteerAvatar: string
  messages: Array<{
    id: string
    sender: "volunteer" | "organizer"
    content: string
    timestamp: string
  }>
}

const missions = [
  {
    id: "1",
    title: "Nettoyage de la plage Ain Diab",
    category: "Environnement",
    participants: 5,
    maxParticipants: 10,
    date: "23 Dec 2024",
    status: "active",
    unreadMessages: 3,
  },
  {
    id: "2",
    title: "Aide aux devoirs pour enfants",
    category: "Éducation",
    participants: 15,
    maxParticipants: 15,
    date: "24 Dec 2024",
    status: "full",
    unreadMessages: 0,
  },
  {
    id: "3",
    title: "Distribution de repas",
    category: "Social",
    participants: 8,
    maxParticipants: 12,
    date: "25 Dec 2024",
    status: "active",
    unreadMessages: 2,
  },
  {
    id: "4",
    title: "Plantation d'arbres",
    category: "Environnement",
    participants: 3,
    maxParticipants: 8,
    date: "28 Dec 2024",
    status: "draft",
    unreadMessages: 0,
  },
]

export default function OrganizerDashboardScreen({ onNavigate }: OrganizerDashboardScreenProps) {
  const { user } = useAuth()
  const [showMessagingModal, setShowMessagingModal] = useState(false)
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null)
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerMessage | null>(null)
  const [messageText, setMessageText] = useState("")
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

  // Sample data: Messages by mission and volunteer
  const missionVolunteerMessages: { [key: string]: VolunteerMessage[] } = {
    "1": [
      {
        id: "v1",
        volunteerName: "Ahmed Ben Ali",
        volunteerAvatar: "A",
        messages: [
          { id: "m1", sender: "volunteer", content: "À quelle heure je dois arriver exactement?", timestamp: "09:30" },
          { id: "m2", sender: "organizer", content: "À 8h00 du matin sur place", timestamp: "09:45" },
          { id: "m3", sender: "volunteer", content: "Merci beaucoup!", timestamp: "10:00" },
        ],
      },
      {
        id: "v2",
        volunteerName: "Fatima Zohra",
        volunteerAvatar: "F",
        messages: [
          { id: "m1", sender: "volunteer", content: "Quel matériel je dois apporter?", timestamp: "10:15" },
          { id: "m2", sender: "organizer", content: "Apportez juste des gants de travail", timestamp: "10:30" },
        ],
      },
      {
        id: "v3",
        volunteerName: "Karim",
        volunteerAvatar: "K",
        messages: [
          { id: "m1", sender: "volunteer", content: "Je peux venir avec mon ami?", timestamp: "08:00" },
        ],
      },
    ],
    "3": [
      {
        id: "v4",
        volunteerName: "Sofia Martinez",
        volunteerAvatar: "S",
        messages: [
          { id: "m1", sender: "volunteer", content: "Y aura-t-il des repas fournis?", timestamp: "14:00" },
          { id: "m2", sender: "organizer", content: "Oui, nous fournirons le déjeuner", timestamp: "14:15" },
        ],
      },
      {
        id: "v5",
        volunteerName: "Hassan",
        volunteerAvatar: "H",
        messages: [
          { id: "m1", sender: "volunteer", content: "Merci pour cette belle mission", timestamp: "12:45" },
        ],
      },
    ],
  }

  const totalUnreadMessages = missions.reduce((sum, mission) => sum + (mission.unreadMessages || 0), 0)

  const handleOpenMessages = (missionId: string) => {
    setSelectedMissionId(missionId)
    setSelectedVolunteer(null)
    setShowMessagingModal(true)
  }

  const handleCloseMessages = () => {
    setShowMessagingModal(false)
    setSelectedMissionId(null)
    setSelectedVolunteer(null)
    setMessageText("")
    setKeyboardHeight(0)
  }

  const handleSelectVolunteer = (volunteer: VolunteerMessage) => {
    setSelectedVolunteer(volunteer)
    setMessageText("")
    // Faire défiler vers le bas après un court délai
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedVolunteer || !selectedMissionId) return
    
    // Créer un nouveau message
    const newMessage = {
      id: `m${selectedVolunteer.messages.length + 1}`,
      sender: "organizer" as const,
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    // Mettre à jour les messages du volontaire
    const updatedVolunteer = {
      ...selectedVolunteer,
      messages: [...selectedVolunteer.messages, newMessage]
    }
    
    // Mettre à jour la liste des messages de la mission
    missionVolunteerMessages[selectedMissionId] = missionVolunteerMessages[selectedMissionId].map(v => 
      v.id === selectedVolunteer.id ? updatedVolunteer : v
    )
    
    // Mettre à jour l'état
    setSelectedVolunteer(updatedVolunteer)
    setMessageText("")
    
    // Faire défiler vers le bas
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const currentMission = missions.find(m => m.id === selectedMissionId)
  const currentVolunteers = selectedMissionId ? missionVolunteerMessages[selectedMissionId] || [] : []

  return (
    <View style={styles.container}>
      <MobileHeader
        title=""
        showProfile
        showNotifications
        notificationCount={3 + totalUnreadMessages}
        user={{
          firstName: user?.firstName || "Organisateur",
          lastName: user?.lastName || "",
          role: "organisation",
        }}
        onProfile={() => onNavigate("profil-organisateur")}
        onNotifications={() => onNavigate("notifications")}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Titre du Dashboard */}
          <View style={styles.dashboardHeader}>
            <View>
              <Text style={styles.greeting}>Tableau de Bord</Text>
              <Text style={styles.subtitle}>Gérez vos missions</Text>
            </View>
          </View>

          {/* Statistiques */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="briefcase-outline" size={24} color="#7B68EE" />
              </View>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Missions</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="people-outline" size={24} color="#10b981" />
              </View>
              <Text style={styles.statValue}>26</Text>
              <Text style={styles.statLabel}>Bénévoles</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="mail-outline" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.statValue}>{totalUnreadMessages}</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </View>
          </View>

          {/* Section Missions */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vos Missions</Text>
            <TouchableOpacity onPress={() => onNavigate("organizer-missions")}>
              <Text style={styles.viewAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.missionsList}>
            {missions.slice(0, 3).map((mission) => (
              <View key={mission.id} style={styles.missionCard}>
                <View style={styles.missionHeader}>
                  <View style={styles.missionTitleContainer}>
                    <Text style={styles.missionTitle}>{mission.title}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{mission.category}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          mission.status === "full" ? "#10b981" : mission.status === "draft" ? "#6b7280" : "#3b82f6",
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {mission.status === "full" ? "Complet" : mission.status === "draft" ? "Brouillon" : "Actif"}
                    </Text>
                  </View>
                </View>

                <View style={styles.missionInfo}>
                  <View style={styles.infoItem}>
                    <Ionicons name="people-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      {mission.participants}/{mission.maxParticipants}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{mission.date}</Text>
                  </View>
                  {mission.unreadMessages > 0 && (
                    <View style={styles.infoItem}>
                      <Ionicons name="mail-outline" size={16} color="#f59e0b" />
                      <Text style={[styles.infoText, { color: "#f59e0b", fontWeight: "600" }]}>
                        {mission.unreadMessages} message{mission.unreadMessages > 1 ? "s" : ""}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity style={styles.editButton} onPress={() => onNavigate("edit-mission")}>
                    <Ionicons name="create-outline" size={16} color="#666" />
                    <Text style={styles.editButtonText}>Modifier</Text>
                  </TouchableOpacity>
                  {mission.unreadMessages > 0 && (
                    <TouchableOpacity 
                      style={[styles.editButton, styles.messageButtonOrganzier]}
                      onPress={() => handleOpenMessages(mission.id)}
                    >
                      <Ionicons name="mail-outline" size={16} color="#f59e0b" />
                      <Text style={[styles.editButtonText, { color: "#f59e0b" }]}>
                        {mission.unreadMessages}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fabButton} onPress={() => onNavigate("organizer-create")}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Messaging Modal */}
      <Modal
        visible={showMessagingModal}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseMessages}
      >
        <View style={styles.modalContainer}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          
          {/* Header personnalisé pour la modale */}
          <View style={styles.customHeader}>
            <TouchableOpacity 
              onPress={() => selectedVolunteer ? setSelectedVolunteer(null) : handleCloseMessages()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>
                {selectedVolunteer ? selectedVolunteer.volunteerName : "Messages"}
              </Text>
              {!selectedVolunteer && currentMission && (
                <Text style={styles.headerSubtitle}>{currentMission.title}</Text>
              )}
            </View>
            
            <View style={{ width: 40 }} />
          </View>

          {!selectedVolunteer ? (
            // Volunteers List View
            <View style={styles.volunteersContent}>
              <ScrollView style={styles.volunteersList}>
                {currentVolunteers.length === 0 ? (
                  <View style={styles.emptyMessagingContainer}>
                    <Ionicons name="mail-outline" size={48} color="#d1d5db" />
                    <Text style={styles.emptyMessagingText}>Aucun message</Text>
                  </View>
                ) : (
                  currentVolunteers.map((volunteer) => (
                    <TouchableOpacity
                      key={volunteer.id}
                      style={styles.volunteerListItem}
                      onPress={() => handleSelectVolunteer(volunteer)}
                    >
                      <View style={styles.volunteerListAvatar}>
                        <Text style={styles.volunteerListAvatarText}>{volunteer.volunteerAvatar}</Text>
                      </View>
                      <View style={styles.volunteerListInfo}>
                        <Text style={styles.volunteerListName}>{volunteer.volunteerName}</Text>
                        <Text style={styles.volunteerListPreview} numberOfLines={1}>
                          {volunteer.messages[volunteer.messages.length - 1].content}
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
            // Conversation View - Solution hybride
            <KeyboardAvoidingView
              style={styles.keyboardAvoidingView}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
              <View style={styles.conversationContainer}>
                {/* Messages */}
                <ScrollView 
                  ref={scrollViewRef}
                  style={styles.messagesContent}
                  contentContainerStyle={styles.messagesContentContainer}
                  keyboardShouldPersistTaps="handled"
                  onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                  {selectedVolunteer.messages.map((msg) => (
                    <View
                      key={msg.id}
                      style={[
                        styles.messageBubble,
                        msg.sender === "organizer" ? styles.messageOrganizer : styles.messageVolunteer,
                      ]}
                    >
                      <Text style={[
                        styles.messageText,
                        msg.sender === "organizer" && styles.messageOrganizerText
                      ]}>
                        {msg.content}
                      </Text>
                      <Text style={[
                        styles.messageTime,
                        msg.sender === "organizer" && styles.messageOrganizerTime
                      ]}>
                        {msg.timestamp}
                      </Text>
                    </View>
                  ))}
                  {/* Espace en bas pour éviter que l'input cache les messages */}
                  <View style={{ height: Platform.OS === "ios" ? 100 : 120 }} />
                </ScrollView>

                {/* Input avec gestion manuelle pour Android */}
                <View style={[
                    styles.replyWrapper,
                    Platform.OS === "android" && keyboardHeight > 0 && { 
                    marginBottom: keyboardHeight + 15 // Réduire de 50px pour monter plus haut
                    }
                  ]}>
                  <View style={styles.replyContainer}>
                    <TextInput
                      style={styles.replyInput}
                      placeholder="Répondre au bénévole..."
                      placeholderTextColor="#999"
                      multiline
                      value={messageText}
                      onChangeText={setMessageText}
                      onSubmitEditing={handleSendMessage}
                      returnKeyType="send"
                      blurOnSubmit={false}
                    />
                    <TouchableOpacity 
                      style={[styles.replyButton, !messageText.trim() && styles.replyButtonDisabled]}
                      onPress={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      <Ionicons name="send" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          )}
        </View>
      </Modal>
    </View>
  )
}

