// src/style/benevole/MessagingScreen.style.ts
import { StyleSheet, Platform } from "react-native";
import { colors } from "../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  
  conversationContainer: {
    flex: 1,
  },
  
  messagesContainer: {
    flex: 1,
  },
  
  messagesContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  loadingContainer: {
    paddingTop: 50,
    alignItems: "center",
  },
  
  loadingText: {
    marginTop: 12,
    color: "#999999",
  },
  
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  
  emptyIcon: {
    marginBottom: 16,
  },
  
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
  },
  
  messageBubble: {
    maxWidth: "80%",
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  
  messageBubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderLeftWidth: 3,
    borderLeftColor: colors.primary || "#7B68EE",
  },
  
  messageBubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary || "#7B68EE",
  },
  
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  
  messageTextOther: {
    color: "#111",
  },
  
  messageTextMe: {
    color: "white",
  },
  
  messageTime: {
    fontSize: 11,
    alignSelf: "flex-end",
  },
  
  messageTimeOther: {
    color: "#999",
  },
  
  messageTimeMe: {
    color: "#ddd",
  },
  
  // ⭐ STYLES POUR LA ZONE DE SAISIE - Comme dans le premier code
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
    backgroundColor: colors.primary || "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  
  replyButtonDisabled: {
    backgroundColor: "#d1d5db",
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