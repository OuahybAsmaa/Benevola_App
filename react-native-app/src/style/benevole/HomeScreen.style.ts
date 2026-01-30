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
})
