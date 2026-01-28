"use client"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../../components/MobileHeader"
import { useAuth } from "../../hooks/useAuth"

interface OrganizerDashboardScreenProps {
  onNavigate: (screen: string) => void
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
  },
  {
    id: "2",
    title: "Aide aux devoirs pour enfants",
    category: "Éducation",
    participants: 15,
    maxParticipants: 15,
    date: "24 Dec 2024",
    status: "full",
  },
  {
    id: "3",
    title: "Distribution de repas",
    category: "Social",
    participants: 8,
    maxParticipants: 12,
    date: "25 Dec 2024",
    status: "active",
  },
  {
    id: "4",
    title: "Plantation d'arbres",
    category: "Environnement",
    participants: 3,
    maxParticipants: 8,
    date: "28 Dec 2024",
    status: "draft",
  },
]

export default function OrganizerDashboardScreen({ onNavigate }: OrganizerDashboardScreenProps) {
  const { user } = useAuth()

  return (
    <View style={styles.container}>
      <MobileHeader
        title=""
        showProfile
        showNotifications
        notificationCount={3}
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
                <Ionicons name="checkmark-circle-outline" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Actives</Text>
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
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity style={styles.editButton} onPress={() => onNavigate("edit-mission")}>
                    <Ionicons name="create-outline" size={16} color="#666" />
                    <Text style={styles.editButtonText}>Modifier</Text>
                  </TouchableOpacity>
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
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  dashboardHeader: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  viewAll: {
    fontSize: 14,
    color: "#7B68EE",
    fontWeight: "600",
  },
  missionsList: {
    gap: 16,
  },
  missionCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  missionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  missionTitleContainer: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },
  categoryBadge: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 10,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  missionInfo: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fecaca",
    padding: 8,
    borderRadius: 8,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  fabButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
})
