import { StyleSheet, Platform , StatusBar } from 'react-native';

export const styles = StyleSheet.create({
  container: {
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
  },
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
  fontSize: 10,
  color: '#999',
  marginTop: 2,
  alignSelf: 'flex-end', // Pour aligner à droite
  minWidth: 40, // Au lieu de width fixe
},
  messageOrganizerTime: {
    color: "#ddd",
  },
  connectionBanner: {
  backgroundColor: '#fff3cd',
  paddingVertical: 8,
  paddingHorizontal: 16,
  flexDirection: 'row',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#ffc107',
},

connectionText: {
  marginLeft: 8,
  fontSize: 12,
  color: '#856404',
  fontWeight: '500',
},

// ✅ NOUVEAU: Header de la liste avec badge
volunteerListHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
},

// ✅ NOUVEAU: Badge rouge pour les messages non lus
unreadBadge: {
  backgroundColor: '#7B68EE',
  borderRadius: 10,
  minWidth: 20,
  height: 20,
  paddingHorizontal: 6,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 8,
},

unreadBadgeText: {
  color: '#fff',
  fontSize: 11,
  fontWeight: 'bold',
},

// ✅ NOUVEAU: Indicateur "en train de taper"
typingIndicator: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 8,
  marginBottom: 8,
},

typingDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#9CA3AF',
  opacity: 0.6,
},

typingText: {
  marginLeft: 8,
  fontSize: 12,
  color: '#6B7280',
  fontStyle: 'italic',
},
});