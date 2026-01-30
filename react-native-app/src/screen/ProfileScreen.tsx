import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../components/MobileHeader"
import { useAuth } from "../hooks/useAuth"
import { styles } from '../style/benevole/ProfileScreen.style'

interface ProfileScreenProps {
  onNavigate: (screen: string) => void
}

const menuItems = [
  { id: "1", label: "Mes favoris", icon: "heart-outline" },
  { id: "2", label: "Paramètres", icon: "settings-outline" },
]

const missions = [
  { id: "1", title: "Nettoyage de plage", status: "En cours", color: "#10b981" },
  { id: "2", title: "Aide aux devoirs", status: "Complétée", color: "#3b82f6" },
  { id: "3", title: "Distribution de repas", status: "À venir", color: "#f59e0b" },
]

const history = [
  { id: "1", title: "Nettoyage de plage", date: "15 Dec 2024", color: "#10b981" },
  { id: "2", title: "Aide aux devoirs", date: "10 Dec 2024", color: "#3b82f6" },
]

export default function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"missions" | "history">("missions")

  const handleLogout = async () => {
    try {
      await logout()
      onNavigate("login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (!user) return null

  return (
    <View style={styles.container}>
      <MobileHeader title="Mon Profil" showBack onBack={() => onNavigate("home")} />

      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </Text>
              </View>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {user.role === "benevole" ? "Bénévole" : user.role === "organisation" ? "Organisation" : "Bénévole"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => onNavigate("edit-profile")}>
              <Ionicons name="create-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("missions")}
            style={[styles.tab, activeTab === "missions" && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === "missions" && styles.activeTabText]}>Mes missions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("history")}
            style={[styles.tab, activeTab === "history" && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>Historique</Text>
          </TouchableOpacity>
        </View>

        {/* Missions Section */}
        {activeTab === "missions" && (
          <View style={styles.section}>
            {missions.map((mission) => (
              <View key={mission.id} style={styles.missionItem}>
                <View style={[styles.missionIcon, { backgroundColor: mission.color + "20" }]}>
                  <Ionicons name="location-outline" size={24} color={mission.color} />
                </View>
                <View style={styles.missionDetails}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <Text style={[styles.missionStatus, { color: mission.color }]}>{mission.status}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </View>
            ))}
          </View>
        )}

        {/* History Section */}
        {activeTab === "history" && (
          <View style={styles.section}>
            {history.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={[styles.historyIcon, { backgroundColor: item.color + "20" }]}>
                  <Ionicons name="calendar-outline" size={24} color={item.color} />
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historyDate}>Complétée le {item.date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Menu */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity style={styles.menuItem}>
                  <Ionicons name={item.icon as any} size={24} color="#666" />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
                {index < menuItems.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

