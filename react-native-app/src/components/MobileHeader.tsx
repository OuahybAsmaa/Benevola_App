import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface MobileHeaderProps {
  title?: string
  showBack?: boolean
  showProfile?: boolean
  showNotifications?: boolean
  notificationCount?: number
  onBack?: () => void
  onProfile?: () => void
  onNotifications?: () => void
  user?: {
    firstName?: string
    lastName?: string
    role?: string
  } | null
}

export default function MobileHeader({
  title,
  showBack = false,
  showProfile = false,
  showNotifications = false,
  notificationCount = 0,
  onBack,
  onProfile,
  onNotifications,
  user,
}: MobileHeaderProps) {
  // Initiales par défaut si pas d'utilisateur
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
    }
    return "JD" // Par défaut (ou "OR" pour organisateur si tu veux)
  }

  // Prénom pour le greeting
  const getFirstName = () => {
    return user?.firstName || ""
  }

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {/* Gauche : retour ou avatar profil */}
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
        ) : showProfile ? (
          <TouchableOpacity onPress={onProfile} style={styles.avatar}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}

        {/* Centre : titre ou greeting */}
        {title ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          showProfile && (
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>
                Bonjour{getFirstName() ? `, ${getFirstName()}` : ""} 👋
              </Text>
            </View>
          )
        )}

        {/* Droite : notifications */}
        {showNotifications ? (
          <TouchableOpacity onPress={onNotifications} style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#374151" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 99 ? "99+" : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    padding: 4,
    borderRadius: 20,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#7B68EE",
  },
  avatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    textAlign: "center",
    marginLeft: -40,
  },
  greetingContainer: {
    flex: 1,
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
})