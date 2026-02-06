// screens/HomeScreen.tsx
import { useState, useEffect } from "react"
import { View, Text, TextInput, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Alert, Platform, Linking } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Location from 'expo-location'
import MobileHeader from "../components/MobileHeader"
import MissionCard from "../components/MissionCard"
import { useMission } from "../hooks/useMissions"
import { colors } from "../style/theme"
import { commonStyles } from "../style/common"
import { useAuth } from "../hooks/useAuth"
import { styles } from '../style/benevole/HomeScreen.style'
import { Mission } from "../services/mission.service"
import { getImageUrl } from "../config/api.config"
import { useNotifications } from "../hooks/useNotifications"

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
    getMissionsNearby,
  } = useMission()

  useEffect(() => {
    getAllMissions()
  }, [])

  useEffect(() => {
    if (missions.length > 0) {
      missions.forEach((m, index) => {
        const imageUrl = getImageUrl(m.image);
      });
    }
  }, [missions])

  const handleShowNearbyMissions = async () => {
    try {
      setLoadingLocation(true)

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

      Alert.alert(
        'Localisation en cours',
        'Récupération de votre position GPS...',
        [{ text: 'OK' }]
      )

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      const { latitude, longitude } = location.coords
      setUserLocation({ latitude, longitude })

      await getMissionsNearby(latitude, longitude, RADIUS_METERS)
      setShowNearbyOnly(true)

      Alert.alert(
        'Missions trouvées',
        `Affichage des missions dans un rayon de ${RADIUS_KM} km.`,
        [{ text: 'OK' }]
      )

    } catch (error: any) {
      Alert.alert(
        'Erreur',
        'Impossible de récupérer votre position. Assurez-vous que le GPS est activé.',
        [{ text: 'OK' }]
      )
    } finally {
      setLoadingLocation(false)
    }
  }

  const handleShowAllMissions = async () => {
    setShowNearbyOnly(false)
    setUserLocation(null)
    await getAllMissions()
  }

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      if (showNearbyOnly && userLocation) {
        await getMissionsNearby(userLocation.latitude, userLocation.longitude, RADIUS_METERS)
      } else {
        await getAllMissions()
      }
    } catch (err) {
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {showNearbyOnly ? 'Missions à proximité' : 'Missions près de vous'}
          </Text>
        </View>

        {loading && !refreshing && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Chargement des missions...</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle" size={48} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

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

        {!loading && !error && displayMissions.length > 0 && (
          <View style={styles.missionsContainer}>
            {displayMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onClick={() => onNavigate("mission-detail", mission.id)}
                userLocation={userLocation}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}