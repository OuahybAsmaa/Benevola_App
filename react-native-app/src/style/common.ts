// styles/common.ts
import { StyleSheet } from "react-native"
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from "./theme"

export const commonStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  scrollView: {
    flex: 1,
  },
  
  contentPadding: {
    padding: spacing.xl,
  },
  
  // Cards
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  
  // Buttons
  button: {
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  
  buttonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  
  buttonTextPrimary: {
    color: colors.text.inverse,
  },
  
  buttonTextSecondary: {
    color: colors.text.primary,
  },
  
  buttonDisabled: {
    opacity: 0.6,
  },
  
  // Inputs
  input: {
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.medium,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.md,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  
  inputFocused: {
    borderColor: colors.primary,
  },
  
  inputError: {
    borderColor: colors.error,
  },
  
  // Text
  textPrimary: {
    color: colors.text.primary,
  },
  
  textSecondary: {
    color: colors.text.secondary,
  },
  
  textError: {
    color: colors.error,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  
  // Typography
  h1: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  
  h2: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  
  h3: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  
  body: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  
  caption: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  
  // Layout
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  
  // Spacing
  mt8: { marginTop: spacing.sm },
  mt12: { marginTop: spacing.md },
  mt16: { marginTop: spacing.lg },
  mt20: { marginTop: spacing.xl },
  mt24: { marginTop: spacing.xxl },
  
  mb8: { marginBottom: spacing.sm },
  mb12: { marginBottom: spacing.md },
  mb16: { marginBottom: spacing.lg },
  mb20: { marginBottom: spacing.xl },
  mb24: { marginBottom: spacing.xxl },
  
  gap8: { gap: spacing.sm },
  gap12: { gap: spacing.md },
  gap16: { gap: spacing.lg },
})