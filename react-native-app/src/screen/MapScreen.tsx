import { useState } from "react"
import { View, Text, TouchableOpacity, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import MobileHeader from "../components/MobileHeader"
import { styles } from '../style/benevole/MapScreen.style'

const { width, height } = Dimensions.get("window")

const missions = [
  {
    id: "1",
    title: "Nettoyage de la plage Ain Diab",
    latitude: 33.5731,
    longitude: -7.5898,
    category: "Environnement",
    participants: 5,
    maxParticipants: 10,
  },
  {
    id: "2",
    title: "Aide aux devoirs pour enfants",
    latitude: 33.585,
    longitude: -7.6,
    category: "Éducation",
    participants: 8,
    maxParticipants: 15,
  },
  {
    id: "3",
    title: "Visite aux personnes âgées",
    latitude: 33.565,
    longitude: -7.58,
    category: "Social",
    participants: 12,
    maxParticipants: 12,
  },
]

interface MapScreenProps {
  onNavigate: (screen: string, id?: string) => void
}

export default function MapScreen({ onNavigate }: MapScreenProps) {
  const [selectedMission, setSelectedMission] = useState<typeof missions[0] | null>(null)

  return (
    <View style={styles.container}>
      <MobileHeader
        title="Carte des missions"
        showBack
        onBack={() => onNavigate("home")}
        showProfile
        onProfile={() => onNavigate("profile")}
        showNotifications
        onNotifications={() => onNavigate("notifications")}
      />

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE} // Pour un beau style Google Maps
          style={styles.map}
          initialRegion={{
            latitude: 33.5731, // Centre sur Casablanca (Ain Diab)
            longitude: -7.5898,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          showsUserLocation={true} // Affiche la position de l'utilisateur
          showsMyLocationButton={true}
        >
          {missions.map((mission) => (
            <Marker
              key={mission.id}
              coordinate={{
                latitude: mission.latitude,
                longitude: mission.longitude,
              }}
              onPress={() => setSelectedMission(mission)}
            >
              <View style={styles.customMarker}>
                <Ionicons
                  name="location"
                  size={40}
                  color={selectedMission?.id === mission.id ? "#7B68EE" : "#ef4444"}
                />
                <View style={styles.participantBadge}>
                  <Text style={styles.participantCount}>{mission.participants}</Text>
                </View>
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Boutons en haut */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.filterControlButton}>
            <Ionicons name="options" size={16} color="#111827" />
            <Text style={styles.filterControlText}>Filtres</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navigationButton}>
            <Ionicons name="navigate" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Fiche détail en bas */}
        {selectedMission && (
          <View style={styles.detailsCard}>
            <View style={styles.detailsContent}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{selectedMission.category}</Text>
              </View>
              <Text style={styles.participantsText}>
                {selectedMission.participants}/{selectedMission.maxParticipants} participants
              </Text>
              <Text style={styles.missionTitle}>{selectedMission.title}</Text>
              <View style={styles.distanceRow}>
                <Ionicons name="location" size={16} color="#6b7280" />
                <Text style={styles.distanceText}>À proximité</Text>
              </View>
            </View>
            <View style={styles.detailsActions}>
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => onNavigate("mission-detail", selectedMission.id)}
              >
                <Text style={styles.viewDetailsText}>Voir les détails</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedMission(null)}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

