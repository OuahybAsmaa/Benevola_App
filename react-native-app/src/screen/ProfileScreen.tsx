// screens/ProfileScreen.tsx
import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../components/MobileHeader"
import { useAuth } from "../hooks/useAuth"
import { useMissionParticipant } from "../hooks/useMissionParticipant"
import { styles } from '../style/benevole/ProfileScreen.style'
import { getImageUrl } from "../config/api.config"

interface ProfileScreenProps {
  onNavigate: (screen: string, id?: string) => void
}

const menuItems = [
  { id: "2", label: "Paramètres", icon: "settings-outline" },
]

export default function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"missions" | "history">("missions")
  const { myRegistrations, getMyRegisteredMissions, loading } = useMissionParticipant()

  useEffect(() => {
    getMyRegisteredMissions()
  }, [])

  // Missions actives (active ou complete) où je suis inscrit
  const activeMissions = myRegistrations.filter(
    (reg) => reg.mission && (reg.mission.status === "active" || reg.mission.status === "complete")
  )

  // Missions terminées où j'étais inscrit
  const finishedMissions = myRegistrations.filter(
    (reg) => reg.mission && reg.mission.status === "finished"
  )

  const handleLogout = async () => {
    try {
      await logout()
      onNavigate("login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (!user) return null

  const avatarUrl = getImageUrl(user.avatar)

  const getMissionStatusLabel = (status: string) => {
    switch (status) {
      case "active": return { label: "En cours", color: "#10b981" }
      case "complete": return { label: "Complète", color: "#3b82f6" }
      case "finished": return { label: "Terminée", color: "#6b7280" }
      default: return { label: status, color: "#999" }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <View style={styles.container}>
      <MobileHeader title="Mon Profil" showBack onBack={() => onNavigate("home")} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatarImage}
                 
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.firstName?.[0] || ''}
                    {user.lastName?.[0] || ''}
                  </Text>
                </View>
              )}
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
            <Text style={[styles.tabText, activeTab === "missions" && styles.activeTabText]}>
              Mes missions {activeMissions.length > 0 ? `(${activeMissions.length})` : ""}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("history")}
            style={[styles.tab, activeTab === "history" && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>
              Historique {finishedMissions.length > 0 ? `(${finishedMissions.length})` : ""}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ActivityIndicator size="small" color="#10b981" />
          </View>
        )}

        {!loading && activeTab === "missions" && (
          <View style={styles.section}>
            {activeMissions.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#999", padding: 20 }}>
                Vous n'êtes inscrit à aucune mission pour le moment.
              </Text>
            ) : (
              activeMissions.map((reg) => {
                const { label, color } = getMissionStatusLabel(reg.mission.status)
                return (
                  <TouchableOpacity
                    key={reg.id}
                    style={styles.missionItem}
                    onPress={() => onNavigate("mission-detail", reg.mission.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.missionIcon, { backgroundColor: color + "20" }]}>
                      <Ionicons name="location-outline" size={24} color={color} />
                    </View>
                    <View style={styles.missionDetails}>
                      <Text style={styles.missionTitle}>{reg.mission.title}</Text>
                      <Text style={[styles.missionStatus, { color }]}>{label}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>
                )
              })
            )}
          </View>
        )}

        {!loading && activeTab === "history" && (
          <View style={styles.section}>
            {finishedMissions.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#999", padding: 20 }}>
                Aucune mission terminée pour le moment.
              </Text>
            ) : (
              finishedMissions.map((reg) => (
                <TouchableOpacity
                  key={reg.id}
                  style={styles.historyItem}
                  onPress={() => onNavigate("mission-detail", reg.mission.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.historyIcon, { backgroundColor: "#6b728020" }]}>
                    <Ionicons name="calendar-outline" size={24} color="#6b7280" />
                  </View>
                  <View style={styles.historyDetails}>
                    <Text style={styles.historyTitle}>{reg.mission.title}</Text>
                    <Text style={styles.historyDate}>
                      Terminée le {formatDate(reg.mission.date)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

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

        {/* Logout */}
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