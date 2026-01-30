// screens/HomeScreen.refactored.tsx
import { useState } from "react"
import { View, Text, TextInput, ScrollView, ActivityIndicator, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../components/MobileHeader"
import CategoryButton from "../components/CategoryButton"
import MissionCard from "../components/MissionCard"
import { useMissions } from "../hooks/useMissions"
import { colors} from "../style/theme"
import { commonStyles } from "../style/common"
import { useAuth } from "../hooks/useAuth"
import { styles } from '../style/benevole/HomeScreen.style'

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

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user } = useAuth()
  const [activeCategory, setActiveCategory] = useState("all")
  const [cityQuery, setCityQuery] = useState("")

  const {
    missions,
    isLoading,
    error,
    refresh,
  } = useMissions({
    category: activeCategory !== "all" ? activeCategory : undefined,
    city: cityQuery,
  })

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
  }

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

        {/* Loading State */}
        {isLoading && !refreshing && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Chargement des missions...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle" size={48} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && !error && missions.length === 0 && (
          <View style={styles.centerContainer}>
            <Ionicons name="search" size={48} color={colors.text.disabled} />
            <Text style={styles.emptyText}>Aucune mission trouvée</Text>
            <Text style={styles.emptySubtext}>Essayez de modifier vos filtres</Text>
          </View>
        )}

        {/* Missions List */}
        {!isLoading && !error && missions.length > 0 && (
          <View style={styles.missionsContainer}>
            {missions.map((mission) => (
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
