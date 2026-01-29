"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../../components/MobileHeader"
import { useAuth } from "../../hooks/useAuth"

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: "white",
    padding: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "#ede9fe",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#7B68EE",
    fontSize: 12,
    fontWeight: "600",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#7B68EE",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#7B68EE",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
  },
  missionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  missionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  missionDetails: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  missionVolunteers: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  menuCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  separator: {
    height: 1,
    backgroundColor: "#f3f4f6",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  historyDetails: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
})
