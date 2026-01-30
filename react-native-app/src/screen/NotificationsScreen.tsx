import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "@/src/components/MobileHeader"
import { useAuth } from "../hooks/useAuth"
import { styles } from '../style/benevole/NotificationsScreen.style'

interface NotificationsScreenProps {
  onNavigate: (screen: string) => void
}

const notifications = [
  {
    id: "1",
    type: "mission",
    icon: "calendar-outline" as const,
    title: "Nouvelle mission disponible",
    description: "Une mission de nettoyage de plage est disponible près de chez vous",
    time: "Il y a 5 minutes",
    isNew: true,
  },
  {
    id: "2",
    type: "reminder",
    icon: "notifications-outline" as const,
    title: "Rappel : Mission demain",
    description: "N'oubliez pas votre mission d'aide aux devoirs demain à 14h00",
    time: "Il y a 2 heures",
    isNew: true,
  },
  {
    id: "3",
    type: "confirmation",
    icon: "checkmark-circle-outline" as const,
    title: "Inscription confirmée",
    description: "Votre inscription à la visite aux personnes âgées a été confirmée",
    time: "Il y a 5 heures",
    isNew: true,
  },
  {
    id: "4",
    type: "message",
    icon: "chatbubble-outline" as const,
    title: "Message de l'organisateur",
    description: "Association Verte : Le lieu de rendez-vous a changé",
    time: "Hier",
    isNew: false,
  },
  {
    id: "5",
    type: "achievement",
    icon: "heart-outline" as const,
    title: "Nouveau badge débloqué",
    description: 'Félicitations ! Vous avez débloqué le badge "Héros de l\'environnement"',
    time: "Il y a 2 jours",
    isNew: false,
  },
  {
    id: "6",
    type: "friend",
    icon: "person-add-outline" as const,
    title: "Nouvel ami",
    description: "Sarah Benali vous a ajouté en ami",
    time: "Il y a 3 jours",
    isNew: false,
  },
]

const iconColorMap = {
  mission: { text: "#2563eb", bg: "#eff6ff" },
  reminder: { text: "#7B68EE", bg: "#f3e8ff" },
  confirmation: { text: "#16a34a", bg: "#f0fdf4" },
  message: { text: "#ea580c", bg: "#fff7ed" },
  achievement: { text: "#dc2626", bg: "#fef2f2" },
  friend: { text: "#db2777", bg: "#fdf2f8" },
}

export default function NotificationsScreen({ onNavigate }: NotificationsScreenProps) {
  const { user } = useAuth()
  const handleBack = () => {
    // Logique intelligente selon le rôle
    if (user?.role === "organisation") {  // accepte les deux variantes si tu as des incohérences
      onNavigate("organizer-dashboard")
    } else {
      onNavigate("home")
    }
  }
  return (
    <View style={styles.container}>
      <MobileHeader 
        title="Notifications" 
        showBack 
        onBack={handleBack}          // ← utilise la fonction dynamique au lieu de () => onNavigate("home")
      />

      <ScrollView style={styles.content}>
        {/* New Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nouvelles</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>

          <View style={styles.notificationsList}>
            {notifications
              .filter((n) => n.isNew)
              .map((notification, index) => {
                const colors = iconColorMap[notification.type as keyof typeof iconColorMap]
                return (
                  <TouchableOpacity key={notification.id} style={styles.notificationItem}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
                      <Ionicons name={notification.icon} size={24} color={colors.text} />
                    </View>
                    <View style={styles.notificationContent}>
                      <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        <View style={styles.newDot} />
                      </View>
                      <Text style={styles.notificationDescription} numberOfLines={2}>
                        {notification.description}
                      </Text>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
          </View>
        </View>

        {/* Earlier Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Précédentes</Text>

          <View style={styles.notificationsList}>
            {notifications
              .filter((n) => !n.isNew)
              .map((notification) => {
                const colors = iconColorMap[notification.type as keyof typeof iconColorMap]
                return (
                  <TouchableOpacity key={notification.id} style={styles.notificationItem}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
                      <Ionicons name={notification.icon} size={24} color={colors.text} />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationDescription} numberOfLines={2}>
                        {notification.description}
                      </Text>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

