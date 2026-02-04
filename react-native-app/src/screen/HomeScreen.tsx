// screens/HomeScreen.tsx
import { useState, useEffect } from "react"
import { View, Text, TextInput, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Alert, Platform, Linking } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Location from 'expo-location' // 🔥 AJOUT
import MobileHeader from "../components/MobileHeader"
import CategoryButton from "../components/CategoryButton"
import MissionCard from "../components/MissionCard"
import { useMission } from "../hooks/useMissions"
import { colors } from "../style/theme"
import { commonStyles } from "../style/common"
import { useAuth } from "../hooks/useAuth"
import { styles } from '../style/benevole/HomeScreen.style'
import { Mission } from "../services/mission.service"
import { getImageUrl } from "../config/api.config"
import { useNotifications } from "../hooks/useNotifications"

const categories = [
  { id: "all", icon: "📋", label: "Toutes" },
  { id: "Environnement", icon: "🌱", label: "Environnement" },
  { id: "Social", icon: "🤝", label: "Social" },
  { id: "Éducation", icon: "📚", label: "Éducation" },
  { id: "Santé", icon: "❤️", label: "Santé" },
  { id: "Culture", icon: "🎭", label: "Culture" },
]

// 🔥 AJOUT: Constantes pour la géolocalisation
const RADIUS_KM = 50;
const RADIUS_METERS = RADIUS_KM * 1000;

interface HomeScreenProps {
  onNavigate: (screen: string, id?: string) => void
}

interface DisplayMission extends Mission {
  distance?: string | number;
  participants: number;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user } = useAuth()
  const { unreadCount: notificationUnreadCount } = useNotifications()
  
  const [activeCategory, setActiveCategory] = useState("all")
  const [cityQuery, setCityQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  // 🔥 AJOUT: États pour la géolocalisation
  const [showNearbyOnly, setShowNearbyOnly] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null)

  const {
    missions,
    loading,
    error,
    getAllMissions,
    getMissionsNearby, // 🔥 AJOUT
  } = useMission()

  useEffect(() => {
    getAllMissions()
  }, [])

  useEffect(() => {
    if (missions.length > 0) {
      console.log("📋 Total missions chargées:", missions.length);
      missions.forEach((m, index) => {
        const imageUrl = getImageUrl(m.image);
        console.log(`Mission ${index + 1}:`, {
          title: m.title,
          imagePath: m.image,
          fullImageUrl: imageUrl
        });
      });
    }
  }, [missions])

  // 🔥 AJOUT: Fonction pour afficher les missions proches
  const handleShowNearbyMissions = async () => {
    try {
      setLoadingLocation(true)

      // Demander la permission de localisation
      const { status } = await Location.requestForegroundPermissionsAsync()
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'Pour afficher les missions proches de vous, veuillez activer la localisation dans les paramètres de votre appareil.',
          [
            { text: 'Annuler', style: 'cancel' },
            { 
              text: 'Ouvrir Paramètres', 
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:')
                } else {
                  Linking.openSettings()
                }
              }
            }
          ]
        )
        setLoadingLocation(false)
        return
      }

      // Récupérer la position actuelle
      Alert.alert(
        'Localisation en cours',
        'Récupération de votre position GPS...',
        [{ text: 'OK' }]
      )

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      const { latitude, longitude } = location.coords
      console.log("=== POSITION GPS RÉCUPÉRÉE ===");
      console.log("Latitude  :", latitude);
console.log("Longitude :", longitude);
console.log("Précision :", location.coords.accuracy, "mètres");
      setUserLocation({ latitude, longitude })

      console.log('📍 Position du bénévole:', { latitude, longitude })

      // Récupérer les missions proches
      await getMissionsNearby(latitude, longitude, RADIUS_METERS)
      setShowNearbyOnly(true)

      Alert.alert(
        'Missions trouvées',
        `Affichage des missions dans un rayon de ${RADIUS_KM} km.`,
        [{ text: 'OK' }]
      )

    } catch (error: any) {
      console.error('❌ Erreur géolocalisation:', error)
      Alert.alert(
        'Erreur',
        'Impossible de récupérer votre position. Assurez-vous que le GPS est activé.',
        [{ text: 'OK' }]
      )
    } finally {
      setLoadingLocation(false)
    }
  }

  // 🔥 AJOUT: Fonction pour afficher toutes les missions
  const handleShowAllMissions = async () => {
    setShowNearbyOnly(false)
    setUserLocation(null)
    await getAllMissions()
  }

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      // 🔥 MODIFICATION: Rafraîchir selon le mode actif
      if (showNearbyOnly && userLocation) {
        await getMissionsNearby(userLocation.latitude, userLocation.longitude, RADIUS_METERS)
      } else {
        await getAllMissions()
      }
    } catch (err) {
      console.error("Erreur refresh:", err)
    } finally {
      setRefreshing(false)
    }
  }

  const filteredMissions = activeCategory === "all"
    ? missions
    : missions.filter((m) => m.category.toLowerCase() === activeCategory.toLowerCase())

  const searchedMissions = cityQuery.trim() === ""
    ? filteredMissions
    : filteredMissions.filter((m) =>
        m.location.toLowerCase().includes(cityQuery.toLowerCase())
      )

  const displayMissions: DisplayMission[] = searchedMissions.map((mission) => ({
    ...mission,
    participants: (mission as any).currentParticipants ?? 0,
    distance: (mission as any).distance ?? undefined,
  }))

  return (
    <View style={commonStyles.container}>
      <MobileHeader
        showProfile
        showNotifications
        notificationCount={notificationUnreadCount}
        onProfile={() => onNavigate("profile")}
        onNotifications={() => onNavigate("notifications")}
        user={user}
      />

      <ScrollView
        style={commonStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* 🔥 AJOUT: Bouton de géolocalisation (remplace la barre de recherche) */}
        <View style={styles.searchContainer}>
          {!showNearbyOnly ? (
            <TouchableOpacity
              style={styles.nearbyButton}
              onPress={handleShowNearbyMissions}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="location" size={20} color="#FFFFFF" />
                  <Text style={styles.nearbyButtonText}>
                    Missions proches de moi
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.allMissionsButton}
              onPress={handleShowAllMissions}
            >
              <Ionicons name="list" size={20} color={colors.primary} />
              <Text style={styles.allMissionsButtonText}>
                Voir toutes les missions
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Categories - 🔥 SUPPRIMÉ comme demandé */}
        {/* Si vous voulez garder les catégories, décommentez ce bloc:
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryWrapper}>
                <CategoryButton
                  icon={category.icon}
                  label={category.label}
                  isActive={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
        */}

        {/* Section Title - 🔥 MODIFICATION: Titre dynamique */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {showNearbyOnly ? 'Missions à proximité' : 'Missions près de vous'}
          </Text>
        </View>

        {/* Loading */}
        {loading && !refreshing && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Chargement des missions...</Text>
          </View>
        )}

        {/* Erreur */}
        {!loading && error && (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle" size={48} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Aucune mission trouvée - 🔥 MODIFICATION: Message adaptatif */}
        {!loading && !error && displayMissions.length === 0 && (
          <View style={styles.centerContainer}>
            <Ionicons 
              name={showNearbyOnly ? "location-outline" : "search"} 
              size={48} 
              color={colors.text.disabled} 
            />
            <Text style={styles.emptyText}>
              {showNearbyOnly ? 'Aucune mission proche trouvée' : 'Aucune mission trouvée'}
            </Text>
            <Text style={styles.emptySubtext}>
              {showNearbyOnly 
                ? `Essayez d'augmenter le rayon de recherche (actuellement ${RADIUS_KM} km)` 
                : 'Essayez de modifier vos filtres'}
            </Text>
          </View>
        )}

        {/* Liste des missions - 🔥 MODIFICATION: Passer userLocation */}
        {!loading && !error && displayMissions.length > 0 && (
          <View style={styles.missionsContainer}>
            {displayMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onClick={() => onNavigate("mission-detail", mission.id)}
                userLocation={userLocation} // 🔥 AJOUT
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}