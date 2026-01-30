import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../../components/MobileHeader"
import { useAuth } from "../../hooks/useAuth"
import { styles } from '../../style/organizer/ProfilOrganisateur.style'

interface ProfileScreenProps {
  onNavigate: (screen: string) => void
}

const menuItems = [
  { id: "1", label: "Paramètres", icon: "settings-outline" },
]

const createdMissions = [
  { id: "1", title: "Nettoyage de plage", volunteers: 12, color: "#10b981" },
  { id: "2", title: "Aide aux devoirs", volunteers: 8, color: "#3b82f6" },
  { id: "3", title: "Distribution de repas", volunteers: 15, color: "#f59e0b" },
]

const history = [
  { id: "1", title: "Mission 1", date: "2023-10-01", color: "#10b981" },
  { id: "2", title: "Mission 2", date: "2023-10-02", color: "#3b82f6" },
]

export default function ProfilOrganisateur({ onNavigate }: ProfileScreenProps) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("missions")

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
      <MobileHeader title="Mon Profil" showBack onBack={() => onNavigate("organizer-dashboard")} />

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

        {/* Missions Créées Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Missions créées</Text>
          {createdMissions.map((mission) => (
            <View key={mission.id} style={styles.missionItem}>
              <View style={[styles.missionIcon, { backgroundColor: mission.color + "20" }]}>
                <Ionicons name="location-outline" size={24} color={mission.color} />
              </View>
              <View style={styles.missionDetails}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionVolunteers}>{mission.volunteers} bénévoles inscrits</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          ))}
        </View>

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
