// screens/MissionDetailScreen.tsx - Version refactorisée
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../components/MobileHeader"
import { useMissionDetail } from "../hooks/useMissionDetail"
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from "../styles/theme"
import { commonStyles } from "../styles/common"

interface MissionDetailScreenProps {
  missionId: string | null
  onNavigate: (screen: string) => void
}

export default function MissionDetailScreen({ missionId, onNavigate }: MissionDetailScreenProps) {
  const {
    mission,
    isLoading,
    error,
    isRegistered,
    isFavorite,
    toggleRegistration,
    toggleFavorite,
  } = useMissionDetail(missionId)

  // Loading state
  if (isLoading) {
    return (
      <View style={commonStyles.container}>
        <MobileHeader showBack onBack={() => onNavigate("home")} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    )
  }

  // Error state
  if (error || !mission) {
    return (
      <View style={commonStyles.container}>
        <MobileHeader showBack onBack={() => onNavigate("home")} />
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.error} />
          <Text style={styles.errorText}>{error || "Mission introuvable"}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => onNavigate("home")}>
            <Text style={styles.retryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const handleRegistration = async () => {
    try {
      await toggleRegistration()
    } catch (err) {
      console.error("Registration error:", err)
      // Vous pouvez afficher un toast/alert ici
    }
  }

  return (
    <View style={commonStyles.container}>
      <MobileHeader showBack onBack={() => onNavigate("home")} />

      <ScrollView style={commonStyles.scrollView}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={mission.image} style={styles.image} resizeMode="cover" />
          
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? colors.error : colors.text.primary}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{mission.category}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          {/* Organisation */}
          <View style={styles.organizationRow}>
            <View style={styles.orgAvatar}>
              <Text style={styles.orgAvatarText}>
                {mission.organization.name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.orgInfo}>
              <View style={styles.orgNameRow}>
                <Text style={styles.orgName}>{mission.organization.name}</Text>
                {mission.organization.verified && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.info} />
                )}
              </View>
              <Text style={styles.orgVerified}>Organisation vérifiée</Text>
            </View>
          </View>

          {/* Titre */}
          <Text style={styles.title}>{mission.title}</Text>

          {/* Infos rapides */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>{mission.date}</Text>
            </View>

            <View style={[styles.infoItem, styles.timeItem]}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>{mission.time}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>
                {mission.participants}/{mission.maxParticipants} inscrits
              </Text>
            </View>
          </View>

          {/* Description */}
          {mission.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{mission.description}</Text>
            </View>
          )}

          {/* Infos pratiques */}
          {mission.requirements && mission.requirements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ce qu'il faut savoir</Text>
              {mission.requirements.map((req, index) => (
                <View key={index} style={styles.requirementRow}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Lieu */}
          {mission.address && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lieu</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={20} color={colors.primary} />
                <Text style={styles.locationText}>{mission.address}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bouton bas */}
      <View style={styles.bottomButton}>
        <TouchableOpacity
          style={[styles.registerButton, isRegistered && styles.registeredButton]}
          onPress={handleRegistration}
        >
          {isRegistered && (
            <Ionicons name="checkmark-circle" size={20} color="white" style={{ marginRight: 8 }} />
          )}
          <Text style={styles.registerText}>
            {isRegistered ? "Inscription confirmée" : "S'inscrire à cette mission"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  
  loadingText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  
  errorText: {
    fontSize: fontSize.lg,
    color: colors.error,
    textAlign: "center",
    marginTop: spacing.md,
  },
  
  retryButton: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  
  retryButtonText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  
  imageContainer: {
    height: 256,
    position: "relative",
  },
  
  image: {
    width: "100%",
    height: "100%",
  },
  
  imageActions: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
  },
  
  actionButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
  
  categoryBadge: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  
  categoryText: {
    color: colors.text.inverse,
    fontWeight: fontWeight.semibold,
  },
  
  detailsContainer: {
    padding: spacing.xl,
  },
  
  organizationRow: {
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  
  orgAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  
  orgAvatarText: {
    color: colors.text.inverse,
    fontWeight: fontWeight.bold,
  },
  
  orgInfo: {
    flex: 1,
  },
  
  orgNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  
  orgName: {
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  
  orgVerified: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.lg,
    color: colors.text.primary,
  },
  
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.xxl,
  },
  
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  
  timeItem: {
    marginLeft: "4%",
  },
  
  infoText: {
    fontSize: fontSize.base,
    color: colors.text.primary,
  },
  
  section: {
    marginBottom: spacing.xxl,
  },
  
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  
  description: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    lineHeight: 24,
  },
  
  requirementRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  
  requirementText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  
  locationRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  
  locationText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  
  bottomButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.medium,
  },
  
  registerButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  
  registeredButton: {
    backgroundColor: colors.success,
  },
  
  registerText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
})