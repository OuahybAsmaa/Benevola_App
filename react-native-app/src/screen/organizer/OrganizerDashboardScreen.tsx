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
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  Alert
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../../components/MobileHeader"
import { useAuth } from "../../hooks/useAuth"
import { useState, useRef, useEffect } from "react"
import { styles } from '../../style/organizer/OrganizerDashboardScreen.style'
import { useMission } from '../../hooks/useMissions'
import { getImageUrl } from '../../config/api.config'

interface OrganizerDashboardScreenProps {
  onNavigate: (screen: string, params?: any) => void
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

// Définition du type Mission pour le dashboard
interface MissionWithParticipants {
  id: string
  title: string
  image?: string
  category: string
  status: string
  maxParticipants: number
  date: string
  location?: string
  participants?: number  // Nombre actuel de participants
  currentParticipants?: number  // Alternative pour compatibilité
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
}

// Retourne couleur + label selon le statut
function getStatusStyle(status: string): { color: string; label: string } {
  switch (status) {
    case 'active':
      return { color: '#3b82f6', label: 'Actif' }
    case 'complete':
      return { color: '#f59e0b', label: 'Complète' }
    case 'finished':
      return { color: '#6b7280', label: 'Terminée' }
    default:
      return { color: '#3b82f6', label: 'Actif' }
  }
}

export default function OrganizerDashboardScreen({ onNavigate }: OrganizerDashboardScreenProps) {
  const { user } = useAuth()
  const { myMissions, getMyMissions, deleteMission, loading } = useMission()

  const [showMessagingModal, setShowMessagingModal] = useState(false)
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null)
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerMessage | null>(null)
  const [messageText, setMessageText] = useState("")
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    getMyMissions()
  }, [])

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

  // ⭐ CALCULER LE TOTAL DE BÉNÉVOLES INSCRITS
  const totalVolunteers = myMissions.reduce((total, mission: any) => {
    // Essayer d'abord participants, puis currentParticipants, sinon 0
    const participants = mission.participants || mission.currentParticipants || 0
    return total + participants
  }, 0)

  const missionVolunteerMessages: { [key: string]: VolunteerMessage[] } = {}
  const totalUnreadMessages = 0

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
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedVolunteer || !selectedMissionId) return

    const newMessage = {
      id: `m${selectedVolunteer.messages.length + 1}`,
      sender: "organizer" as const,
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    const updatedVolunteer = {
      ...selectedVolunteer,
      messages: [...selectedVolunteer.messages, newMessage],
    }

    missionVolunteerMessages[selectedMissionId] = missionVolunteerMessages[selectedMissionId].map((v) =>
      v.id === selectedVolunteer.id ? updatedVolunteer : v
    )

    setSelectedVolunteer(updatedVolunteer)
    setMessageText("")

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const handleDeleteMission = async (missionId: string, missionTitle: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer la mission "${missionTitle}" ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await deleteMission(missionId)
              if (result.meta.requestStatus === 'fulfilled') {
                Alert.alert('Succès', 'Mission supprimée avec succès')
              } else {
                Alert.alert('Erreur', 'Impossible de supprimer la mission')
              }
            } catch (error: any) {
              console.error('Erreur suppression:', error)
              Alert.alert('Erreur', error.message || 'Une erreur est survenue')
            }
          },
        },
      ],
      { cancelable: true }
    )
  }

  const currentMission = myMissions.find((m) => m.id === selectedMissionId)
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
          {/* Titre */}
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
              <Text style={styles.statValue}>{myMissions.length}</Text>
              <Text style={styles.statLabel}>Missions</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="people-outline" size={24} color="#10b981" />
              </View>
              {/* ⭐ AFFICHAGE DU TOTAL DE BÉNÉVOLES */}
              <Text style={styles.statValue}>{totalVolunteers}</Text>
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

          {/* Loading */}
          {loading && (
            <View style={{ padding: 40, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#7B68EE" />
              <Text style={{ marginTop: 12, color: "#666" }}>Chargement...</Text>
            </View>
          )}

          {/* Empty state */}
          {!loading && myMissions.length === 0 && (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Ionicons name="briefcase-outline" size={48} color="#d1d5db" />
              <Text style={{ marginTop: 12, color: "#666", textAlign: "center" }}>
                Vous n'avez pas encore de missions.{"\n"}Créez votre première mission !
              </Text>
            </View>
          )}

          {/* Liste des missions */}
          {!loading && (
            <View style={styles.missionsList}>
              {myMissions.slice(0, 3).map((mission: any) => {
                const imageUri = getImageUrl(mission.image)
                const statusStyle = getStatusStyle(mission.status)
                
                // ⭐ RÉCUPÉRER LE NOMBRE DE PARTICIPANTS - Comme dans HomeScreen
                // Essayer d'abord participants, puis currentParticipants, sinon 0
                const currentParticipants = mission.participants || mission.currentParticipants || 0

                return (
                  <View key={mission.id} style={styles.missionCard}>

                    {/* Image */}
                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.missionImage}
                        resizeMode="cover"
                        onError={(error) => {
                          console.error('❌ Erreur chargement image pour:', mission.title, error.nativeEvent.error)
                        }}
                        onLoad={() => {
                          console.log('✅ Image chargée pour:', mission.title)
                        }}
                      />
                    ) : (
                      <View style={styles.missionImagePlaceholder}>
                        <Ionicons name="image-outline" size={32} color="#ccc" />
                      </View>
                    )}

                    {/* Titre + Status dynamique selon mission.status */}
                    <View style={styles.missionHeader}>
                      <View style={styles.missionTitleContainer}>
                        <Text style={styles.missionTitle}>{mission.title}</Text>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryText}>{mission.category}</Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusStyle.color }]}>
                        <Text style={styles.statusText}>{statusStyle.label}</Text>
                      </View>
                    </View>

                    {/* Infos */}
                    <View style={styles.missionInfo}>
                      <View style={styles.infoItem}>
                        <Ionicons name="people-outline" size={16} color="#666" />
                        {/* ⭐ AFFICHAGE DU NOMBRE RÉEL DE PARTICIPANTS - Comme dans HomeScreen */}
                        <Text style={styles.infoText}>
                          {currentParticipants}/{mission.maxParticipants}
                        </Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Ionicons name="calendar-outline" size={16} color="#666" />
                        <Text style={styles.infoText}>{formatDate(mission.date)}</Text>
                      </View>
                      {mission.location && (
                        <View style={styles.infoItem}>
                          <Ionicons name="location-outline" size={16} color="#666" />
                          <Text style={styles.infoText} numberOfLines={1}>{mission.location}</Text>
                        </View>
                      )}
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                      <TouchableOpacity 
                        style={styles.editButton} 
                        onPress={() => onNavigate("edit-mission", { missionId: mission.id })}
                      >
                        <Ionicons name="create-outline" size={16} color="#666" />
                        <Text style={styles.editButtonText}>Modifier</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDeleteMission(mission.id, mission.title)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB Créer mission */}
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

          <View style={styles.customHeader}>
            <TouchableOpacity
              onPress={() => (selectedVolunteer ? setSelectedVolunteer(null) : handleCloseMessages())}
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
                      <Text style={[styles.messageText, msg.sender === "organizer" && styles.messageOrganizerText]}>
                        {msg.content}
                      </Text>
                      <Text style={[styles.messageTime, msg.sender === "organizer" && styles.messageOrganizerTime]}>
                        {msg.timestamp}
                      </Text>
                    </View>
                  ))}
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