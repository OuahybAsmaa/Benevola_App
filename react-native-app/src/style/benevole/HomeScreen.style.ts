import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from "../theme"
export const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  
  searchIcon: {
    marginRight: spacing.sm,
  },
  
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  
  categoriesContainer: {
    backgroundColor: colors.surface,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  
  categoriesContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  
  categoryWrapper: {},
  
  sectionHeader: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  
  missionsContainer: {
    paddingBottom: spacing.xxl,
  },
  
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  
  loadingText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  
  errorText: {
    fontSize: fontSize.md,
    color: colors.error,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  
  emptySubtext: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
  },

  // Bouton "Missions proches de moi"
nearbyButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.primary, // Utilisez votre couleur primaire (#7B68EE)
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 16,
  gap: 8,
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 5,
},

nearbyButtonText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#FFFFFF",
},

// Bouton "Voir toutes les missions"
allMissionsButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  borderWidth: 2,
  borderColor: colors.primary,
  paddingVertical: 14,
  paddingHorizontal: 16,
  gap: 8,
},

allMissionsButtonText: {
  fontSize: 16,
  fontWeight: "600",
  color: colors.primary,
},
})
