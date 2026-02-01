import { StyleSheet,Platform,StatusBar, } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  dashboardHeader: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  viewAll: {
    fontSize: 14,
    color: "#7B68EE",
    fontWeight: "600",
  },
  missionsList: {
    gap: 16,
  },
  missionCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  missionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  missionTitleContainer: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },
  categoryBadge: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 10,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  missionInfo: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fecaca",
    padding: 8,
    borderRadius: 8,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  messageButtonOrganzier: {
    flex: 1,
    borderColor: "#fef3c7",
    backgroundColor: "#fffbeb",
  },
  fabButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  keyboardAvoidingView: {
    flex: 1,
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

  volunteersContent: {
    flex: 1,
  },
  volunteersList: {
    flex: 1,
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
  volunteerListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    gap: 12,
  },
  volunteerListAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
  },
  volunteerListAvatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  volunteerListInfo: {
    flex: 1,
  },
  volunteerListName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  volunteerListPreview: {
    fontSize: 12,
    color: "#999",
  },
  volunteerListArrow: {
    paddingLeft: 8,
  },

  // Conversation Styles
  conversationContainer: {
    flex: 1,
  },
  messagesContent: {
    flex: 1,
  },
  messagesContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  
  messageBubble: {
    maxWidth: "80%",
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  messageVolunteer: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderLeftWidth: 3,
    borderLeftColor: "#7B68EE",
  },
  messageOrganizer: {
    alignSelf: "flex-end",
    backgroundColor: "#7B68EE",
  },
  messageText: {
    fontSize: 14,
    color: "#111",
    marginBottom: 4,
  },
  messageOrganizerText: {
    color: "white",
  },
  messageTime: {
    fontSize: 11,
    color: "#999",
    alignSelf: "flex-end",
  },
  messageOrganizerTime: {
    color: "#ddd",
  },
  missionImage: {
  width: '100%',
  height: 160,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  resizeMode: 'cover',
},
missionImagePlaceholder: {
  width: '100%',
  height: 160,
  backgroundColor: '#f3f4f6',
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
},
})