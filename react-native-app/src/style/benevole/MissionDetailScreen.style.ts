import { StyleSheet, Platform, StatusBar } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from "../../style/theme"

export const styles = StyleSheet.create({
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
    flexDirection: "column",
    gap: spacing.sm,
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
  
  // ✅ SECTION ORGANISATION - VERSION FINALE
  organizationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  
  // Avatar avec initiale (fallback)
  orgAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16, // ✅ ESPACEMENT
  },
  
  orgAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  
  // ✅ Avatar avec image
  orgAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    marginRight: 16, // ✅ ESPACEMENT
  },
  
  // Infos organisateur
  orgInfo: {
    flex: 1,
    justifyContent: "center",
  },
  
  orgNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  
  orgName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  
  orgVerified: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2, // ✅ PETIT ESPACE ENTRE NOM ET "ORGANISATEUR"
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

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingTop: Platform.OS === "ios" ? 50 : 12,
  },
  
  backButton: {
    padding: 4,
  },
  
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  // Conversation Styles
  conversationContainer: {
    flex: 1,
  },
  
  messagesContent: {
    flex: 1,
  },
  
  messagesContentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  
  emptyMessagingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  
  emptyMessagingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },

  // Styles pour les messages avec avatars
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },

  messageContainerRight: {
    justifyContent: "flex-end",
  },

  avatarContainer: {
    width: 36,
    marginHorizontal: 6,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  volunteerAvatar: {
    backgroundColor: "#10b981",
  },

  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  messageBubble: {
    maxWidth: "76%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    minHeight: 44,
  },

  messageVolunteer: {
    backgroundColor: "#7B68EE",
    borderBottomRightRadius: 6,
  },

  messageOrganizer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderBottomLeftRadius: 6,
  },

  messageText: {
    fontSize: 15,
    color: "#111",
    marginBottom: 4,
    lineHeight: 20,
  },

  messageVolunteerText: {
    color: "white",
  },

  messageTime: {
    fontSize: 11,
    alignSelf: "flex-end",
    marginTop: 2,
  },

  messageVolunteerTime: {
    color: "rgba(255, 255, 255, 0.85)",
  },

  messageOrganizerTime: {
    color: "#666",
  },

  // Input Styles
  replyWrapper: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingBottom: Platform.OS === "android" ? 40 : 0,
  },
  
  replyContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  
  replyInput: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    fontSize: 14,
    color: "#111",
    maxHeight: 100,
    minHeight: 40,
  },
  
  replyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  
  replyButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
});