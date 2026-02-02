import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../../components/MobileHeader"
import { useAuth } from "../../hooks/useAuth"
import { useMission } from "../../hooks/useMissions"
import { styles } from '../../style/organizer/ProfilOrganisateur.style'

interface ProfileScreenProps {
  onNavigate: (screen: string) => void
}

const API_URL = 'http://192.168.0.105:3000'

const menuItems = [
  { id: "1", label: "Paramètres", icon: "settings-outline" },
]

const categoryColors: Record<string, string> = {
  environnement: "#10b981",
  education: "#3b82f6",
  alimentaire: "#f59e0b",
  social: "#8b5cf6",
  sante: "#ef4444",
  culture: "#ec4899",
}

function getCategoryColor(category: string): string {
  return categoryColors[category?.toLowerCase()] || "#6b7280"
}

export default function ProfilOrganisateur({ onNavigate }: ProfileScreenProps) {
  const { user, logout } = useAuth()
  const { finishedMissions, getMyFinishedMissions, loading } = useMission()

  // Fetch des missions terminées au montage
  useEffect(() => {
    getMyFinishedMissions()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      onNavigate("login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
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
              {user.avatar ? (
                <Image 
                  source={{ uri: `${API_URL}${user.avatar}` }} 
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.firstName[0]}
                    {user.lastName[0]}
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

        {/* Historique des missions terminées */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>Historique</Text>
            {!loading && (
              <View style={{ backgroundColor: '#10b98120', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
                <Text style={{ fontSize: 13, color: '#10b981', fontWeight: '600' }}>
                  {finishedMissions.length} terminée{finishedMissions.length !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>

          {/* Loading */}
          {loading && (
            <View style={{ alignItems: 'center', paddingVertical: 24 }}>
              <ActivityIndicator size="small" color="#10b981" />
            </View>
          )}

          {/* Empty state */}
          {!loading && finishedMissions.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 24 }}>
              <Ionicons name="checkmark-circle-outline" size={40} color="#d1d5db" />
              <Text style={{ color: '#9ca3af', marginTop: 8, fontSize: 14, textAlign: 'center' }}>
                Aucune mission terminée pour le moment.
              </Text>
            </View>
          )}

          {/* Liste des missions terminées */}
          {!loading && finishedMissions.map((mission) => {
            const color = getCategoryColor(mission.category)
            return (
              <View key={mission.id} style={styles.missionItem}>
                <View style={[styles.missionIcon, { backgroundColor: color + "20" }]}>
                  <Ionicons name="checkmark-circle" size={24} color={color} />
                </View>
                <View style={styles.missionDetails}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <Text style={styles.missionVolunteers}>
                    Terminée le {formatDate(mission.date)} · {mission.location}
                  </Text>
                </View>
                <View style={{ backgroundColor: '#10b98115', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                  <Text style={{ fontSize: 11, color: '#10b981', fontWeight: '600' }}>Terminée</Text>
                </View>
              </View>
            )
          })}
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