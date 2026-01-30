import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../../components/MobileHeader"
import { styles } from '../../style/organizer/OrganizerMissionsScreen.style'

interface OrganizerMissionsScreenProps {
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

export default function OrganizerMissionsScreen({ onNavigate }: OrganizerMissionsScreenProps) {
  return (
    <View style={styles.container}>
      <MobileHeader title="Mes Missions" showBack onBack={() => onNavigate("organizer-dashboard")} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => onNavigate("organizer-create")} style={styles.createButton}>
            <Ionicons name="add-circle-outline" size={20} color="white" />
            <Text style={styles.createButtonText}>Créer une mission</Text>
          </TouchableOpacity>

          <View style={styles.missionsList}>
            {missions.map((mission) => (
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
    </View>
  )
}

