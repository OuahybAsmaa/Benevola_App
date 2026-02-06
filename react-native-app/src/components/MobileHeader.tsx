import { memo, useCallback, useMemo } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface MobileHeaderProps {
  title?: string
  subtitle?: string          
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

const MobileHeader = memo(({
  title,
  subtitle,                 
  showBack = false,
  showProfile = false,
  showNotifications = false,
  notificationCount = 0,
  onBack,
  onProfile,
  onNotifications,
  user,
}: MobileHeaderProps) => {
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  const handleProfile = useCallback(() => {
    if (onProfile) {
      onProfile();
    }
  }, [onProfile]);

  const handleNotifications = useCallback(() => {
    if (onNotifications) {
      onNotifications();
    }
  }, [onNotifications]);

  const getInitials = useCallback(() => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;
    }
    return "JD";
  }, [user?.firstName, user?.lastName]);

  const getFirstName = useCallback(() => {
    return user?.firstName || "";
  }, [user?.firstName]);

  const initials = useMemo(() => getInitials(), [getInitials]);
  const firstName = useMemo(() => getFirstName(), [getFirstName]);

  const badgeDisplay = useMemo(() => {
    return notificationCount > 99 ? "99+" : notificationCount;
  }, [notificationCount]);

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {showBack ? (
          <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
        ) : showProfile ? (
          <TouchableOpacity onPress={handleProfile} style={styles.avatar}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}

        <View style={styles.centerContainer}>
          {title ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            showProfile && (
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>
                  Bonjour{firstName ? `, ${firstName}` : ""} 👋
                </Text>
              </View>
            )
          )}

          {subtitle && title && (                  
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
        {showNotifications ? (
          <TouchableOpacity onPress={handleNotifications} style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#374151" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {badgeDisplay}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
    </View>
  );
});

export default MobileHeader;

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

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
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