// src/style/benevole/NotificationsScreen.style.ts
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  
  content: {
    flex: 1,
  },
  
  section: {
    marginBottom: 24,
  },
  
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  
  badge: {
    backgroundColor: "#7B68EE",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  
  markAllButton: {
    marginLeft: "auto",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  
  markAllButtonText: {
    color: "#7B68EE",
    fontSize: 14,
    fontWeight: "600",
  },
  
  notificationsList: {
    paddingHorizontal: 16,
  },
  
  notificationItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  
  notificationContent: {
    flex: 1,
  },
  
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7B68EE",
    marginLeft: 8,
  },
  
  notificationDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 4,
  },
  
  notificationTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
  
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  
  loadingText: {
    marginTop: 12,
    color: "#6b7280",
    fontSize: 14,
  },
  
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  
  errorText: {
    marginTop: 16,
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
  },
  
  retryButton: {
    marginTop: 16,
    backgroundColor: "#7B68EE",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
})