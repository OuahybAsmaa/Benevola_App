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
import { useNotifications } from "../../hooks/useNotifications"

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

interface MissionWithParticipants {
  id: string
  title: string
  image?: string
  category: string
  status: string
  maxParticipants: number
  date: string
  location?: string
  participants?: number
  currentParticipants?: number
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
}

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
  const { unreadCount: notificationUnreadCount, notifications } = useNotifications()

  const [showMessagingModal, setShowMessagingModal] = useState(false)
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null)
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerMessage | null>(null)
  const [messageText, setMessageText] = useState("")
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)

  const [mockMessages, setMockMessages] = useState<{ [key: string]: VolunteerMessage[] }>({})
  
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0)

  useEffect(() => {
    getMyMissions()
  }, [])

  useEffect(() => {
    if (myMissions.length > 0 && Object.keys(mockMessages).length === 0) {
      const newMockData: { [key: string]: VolunteerMessage[] } = {}
      
      myMissions.forEach((mission: any) => {
        const volunteers: VolunteerMessage[] = [
          {
            id: "vol1",
            volunteerName: "Marie Dubois",
            volunteerAvatar: "MD",
            messages: [
              {
                id: "1",
                sender: "volunteer",
                content: "Bonjour, je suis intéressé par votre mission !",
                timestamp: "09:30"
              },
              {
                id: "2",
                sender: "organizer",
                content: "Bonjour Marie, ravi de votre intérêt !",
                timestamp: "10:15"
              },
              {
                id: "3",
                sender: "volunteer",
                content: "Quel est l'horaire exact pour samedi ?",
                timestamp: "11:00"
              }
            ]
          },
          {
            id: "vol2",
            volunteerName: "Jean Martin",
            volunteerAvatar: "JM",
            messages: [
              {
                id: "1",
                sender: "volunteer",
                content: "J'ai une question sur l'équipement nécessaire",
                timestamp: "Hier 14:20"
              },
              {
                id: "2",
                sender: "organizer",
                content: "Bonjour Jean, tout le matériel est fourni sur place",
                timestamp: "Hier 16:45"
              }
            ]
          },
          {
            id: "vol3",
            volunteerName: "Sophie Laurent",
            volunteerAvatar: "SL",
            messages: [
              {
                id: "1",
                sender: "organizer",
                content: "Bonjour Sophie, merci pour votre inscription !",
                timestamp: "Lundi 09:00"
              },
              {
                id: "2",
                sender: "volunteer",
                content: "Avec plaisir ! Je suis impatiente de participer",
                timestamp: "Lundi 10:30"
              },
              {
                id: "3",
                sender: "volunteer",
                content: "Est-ce que je peux amener un ami ?",
                timestamp: "Lundi 15:20"
              },
              {
                id: "4",
                sender: "organizer",
                content: "Bien sûr, il suffit qu'il s'inscrive aussi",
                timestamp: "Mardi 08:45"
              }
            ]
          }
        ]
        
        newMockData[mission.id] = volunteers
      })
      
      setMockMessages(newMockData)
    }
  }, [myMissions])

  const messageNotifications = notifications.filter(
    n => n.type === 'message' && !n.isRead
  )

  useEffect(() => {
    let totalUnread = 0
    
    myMissions.forEach((mission: any) => {
      if (mockMessages[mission.id]) {
        const randomUnread = Math.floor(Math.random() * 3) + 1
        totalUnread += randomUnread
      }
    })
    
    setTotalUnreadMessages(totalUnread)
  }, [myMissions, mockMessages])

 
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

  const totalVolunteers = myMissions.reduce((total, mission: any) => {
    const participants = mission.participants || mission.currentParticipants || 0
    return total + participants
  }, 0)

  const handleOpenMessages = (missionId: string, missionTitle: string) => {
    onNavigate("organizer-messaging", { 
      missionId, 
      missionTitle 
    })
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

    const updatedMockMessages = {
      ...mockMessages,
      [selectedMissionId]: mockMessages[selectedMissionId].map((v) =>
        v.id === selectedVolunteer.id ? updatedVolunteer : v
      )
    }

    setMockMessages(updatedMockMessages)
    setSelectedVolunteer(updatedVolunteer)
    setMessageText("")

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const handleDeleteMission = (missionId: string, missionTitle: string) => {
  Alert.alert(
    'Confirmer la suppression',
    `Voulez-vous vraiment supprimer "${missionTitle}" ?`,
    [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
       onPress: async () => {
  try {
    await deleteMission(missionId).unwrap();

    Alert.alert(
      'Succès',
      'Mission supprimée avec succès',
      [{ text: 'OK', style: 'default' }]
    );

    getMyMissions();

  } catch (err: any) {

    let errorMessage = 'Une erreur inconnue est survenue';

    if (err?.payload?.message) {
      errorMessage = err.payload.message;
    } else if (err?.data?.message) {
      errorMessage = err.data.message;
    } else if (err?.message) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    }

    Alert.alert(
      'Impossible de supprimer la mission',
      errorMessage,
      [{ text: 'OK', style: 'default' }],
      { cancelable: true }
    );
  }
},
      },
    ],
    { cancelable: true }
  );
};

  const currentMission = myMissions.find((m) => m.id === selectedMissionId)
  const currentVolunteers = selectedMissionId ? mockMessages[selectedMissionId] || [] : []

  return (
    <View style={styles.container}>
      <MobileHeader
        title=""
        showProfile
        showNotifications
        notificationCount={notificationUnreadCount}
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
          <View style={styles.dashboardHeader}>
            <View>
              <Text style={styles.greeting}>Tableau de Bord</Text>
              <Text style={styles.subtitle}>Gérez vos missions</Text>
            </View>
          </View>

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
              <Text style={styles.statValue}>{totalVolunteers}</Text>
              <Text style={styles.statLabel}>Bénévoles</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="mail-outline" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.statValue}>{messageNotifications.length}</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Vos Missions</Text>
          </View>

          {loading && (
            <View style={{ padding: 40, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#7B68EE" />
              <Text style={{ marginTop: 12, color: "#666" }}>Chargement...</Text>
            </View>
          )}

          {!loading && myMissions.length === 0 && (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Ionicons name="briefcase-outline" size={48} color="#d1d5db" />
              <Text style={{ marginTop: 12, color: "#666", textAlign: "center" }}>
                Vous n'avez pas encore de missions.{"\n"}Créez votre première mission !
              </Text>
            </View>
          )}

          {!loading && (
            <View style={styles.missionsList}>
              {myMissions.map((mission: any) => {
                const imageUri = getImageUrl(mission.image)
                const statusStyle = getStatusStyle(mission.status)
                
                const currentParticipants = mission.participants || mission.currentParticipants || 0

                const missionMessages = mockMessages[mission.id] || []
                const unreadCount = missionMessages.length > 0 
                  ? Math.min(missionMessages.length, 3)
                  : 0

                const missionMessageNotifications = notifications.filter(
                  n => n.type === 'message' && 
                       n.data?.missionId === mission.id && 
                       !n.isRead
                )

                return (
                  <View key={mission.id} style={styles.missionCard}>

                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.missionImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.missionImagePlaceholder}>
                        <Ionicons name="image-outline" size={32} color="#ccc" />
                      </View>
                    )}

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

                    <View style={styles.missionInfo}>
                      <View style={styles.infoItem}>
                        <Ionicons name="people-outline" size={16} color="#666" />
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

                    <View style={styles.actions}>
                      <TouchableOpacity 
                        style={styles.messagesButton}
                        onPress={() => handleOpenMessages(mission.id, mission.title)}
                      >
                        <Ionicons name="chatbubble-outline" size={16} color="#7B68EE" />
                        <Text style={styles.messagesButtonText}>Messages</Text>
                        {missionMessageNotifications.length > 0 && (
                          <View style={styles.messageBadge}>
                            <Text style={styles.messageBadgeText}>
                              {missionMessageNotifications.length}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      
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

      <TouchableOpacity style={styles.fabButton} onPress={() => onNavigate("organizer-create")}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

    </View>
  )
}