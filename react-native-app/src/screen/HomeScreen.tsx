// screens/HomeScreen.tsx
import { useState, useEffect } from "react"
import { View, Text, TextInput, ScrollView, ActivityIndicator, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../components/MobileHeader"
import CategoryButton from "../components/CategoryButton"
import MissionCard from "../components/MissionCard"
import { useMission } from "../hooks/useMissions"
import { colors } from "../style/theme"
import { commonStyles } from "../style/common"
import { useAuth } from "../hooks/useAuth"
import { styles } from '../style/benevole/HomeScreen.style'
import { Mission } from "../services/mission.service"
import { getImageUrl } from "../config/api.config" // ✅ Import pour les logs

const categories = [
  { id: "all", icon: "📋", label: "Toutes" },
  { id: "Environnement", icon: "🌱", label: "Environnement" },
  { id: "Social", icon: "🤝", label: "Social" },
  { id: "Éducation", icon: "📚", label: "Éducation" },
  { id: "Santé", icon: "❤️", label: "Santé" },
  { id: "Culture", icon: "🎭", label: "Culture" },
]

interface HomeScreenProps {
  onNavigate: (screen: string, id?: string) => void
}

// Type local pour l'affichage (seulement dans ce fichier)
interface DisplayMission extends Mission {
  distance?: string | number;
  participants: number;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user } = useAuth()
  const [activeCategory, setActiveCategory] = useState("all")
  const [cityQuery, setCityQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const {
    missions,
    loading,
    error,
    getAllMissions,
  } = useMission()

  useEffect(() => {
    getAllMissions()
  }, [])

  // ✅ Log des images pour debug
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

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await getAllMissions()
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

  // Préparation pour l'affichage avec type DisplayMission
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
        notificationCount={3}
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
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.searchIcon} />
            <TextInput
              placeholder="Entrez le nom de votre ville..."
              value={cityQuery}
              onChangeText={setCityQuery}
              style={styles.searchInput}
              placeholderTextColor={colors.text.disabled}
            />
          </View>
        </View>

        {/* Categories */}
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

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Missions près de vous</Text>
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

        {/* Aucune mission trouvée */}
        {!loading && !error && displayMissions.length === 0 && (
          <View style={styles.centerContainer}>
            <Ionicons name="search" size={48} color={colors.text.disabled} />
            <Text style={styles.emptyText}>Aucune mission trouvée</Text>
            <Text style={styles.emptySubtext}>Essayez de modifier vos filtres</Text>
          </View>
        )}

        {/* Liste des missions */}
        {!loading && !error && displayMissions.length > 0 && (
          <View style={styles.missionsContainer}>
            {displayMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onClick={() => onNavigate("mission-detail", mission.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}