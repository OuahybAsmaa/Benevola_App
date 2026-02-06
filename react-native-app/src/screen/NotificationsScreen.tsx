// src/screen/NotificationsScreen.tsx (MODIFIÉ)
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "@/src/components/MobileHeader"
import { useAuth } from "../hooks/useAuth"
import { useNotifications } from "../hooks/useNotifications"
import { styles } from '../style/benevole/NotificationsScreen.style'
import { useState } from "react"
import api from "../api/loginAPI"

interface NotificationsScreenProps {
  onNavigate: (screen: string, params?: any) => void
}

const iconColorMap = {
  mission: { text: "#2563eb", bg: "#eff6ff" },
  reminder: { text: "#7B68EE", bg: "#f3e8ff" },
  confirmation: { text: "#16a34a", bg: "#f0fdf4" },
  message: { text: "#ea580c", bg: "#fff7ed" },
  achievement: { text: "#dc2626", bg: "#fef2f2" },
  friend: { text: "#db2777", bg: "#fdf2f8" },
}

const iconMap = {
  mission: "calendar-outline" as const,
  reminder: "notifications-outline" as const,
  confirmation: "checkmark-circle-outline" as const,
  message: "chatbubble-outline" as const,
  achievement: "heart-outline" as const,
  friend: "person-add-outline" as const,
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "À l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
  if (diffDays === 1) return "Hier"
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function NotificationsScreen({ onNavigate }: NotificationsScreenProps) {
  const { user } = useAuth()
  const {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    markAsRead,
    markAllAsRead,
    deleteNotif,
    fetchNotifications,
    loadMore,
  } = useNotifications()

  const [refreshing, setRefreshing] = useState(false)

  const handleBack = () => {
    if (user?.role === "organisation") {
      onNavigate("organizer-dashboard")
    } else {
      onNavigate("home")
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchNotifications()
    setRefreshing(false)
  }

  const handleNotificationPress = async (notification: any) => {
  if (!notification.isRead) {
    await markAsRead(notification.id)
  }

  if (notification.type === 'message' && notification.data?.missionId) {
    
    if (user?.role === "organisation") {
      const missionTitle = notification.data.missionTitle || "Mission"
      
      onNavigate("organizer-messaging", {
        missionId: notification.data.missionId,
        missionTitle,
      })
    } else {
      let organizerId = notification.data.senderId;
      let organizerName = notification.data.senderName || "Organisateur";
      
      if (organizerId === user?.id) {
        
        try {
          const missionResponse = await api.get(`/missions/${notification.data.missionId}`);
          const mission = missionResponse.data;
          
          if (mission) {
            organizerId = mission.organizerId || mission.organizer?.id;
            
            if (mission.organizerName) {
              organizerName = mission.organizerName;
            } else if (mission.organizer?.name) {
              organizerName = mission.organizer.name;
            } else if (mission.organizer?.firstName) {
              organizerName = mission.organizer.firstName;
              if (mission.organizer?.lastName) {
                organizerName += ` ${mission.organizer.lastName}`;
              }
            }
          }
        } catch (err) {
        }
      }
      
      const missionId = notification.data.missionId;
      const missionTitle = notification.data.missionTitle || "Mission";
      
      if (!organizerId) {
        return;
      }
      
      onNavigate("messaging", {
        organizerId,
        organizerName,
        missionId,
        missionTitle,
      })
    }
  } else if (notification.type === 'mission' && notification.data?.missionId) {
    onNavigate("mission-detail", { missionId: notification.data.missionId })
  }
}

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
    } catch (error) {
    }
  }

  const newNotifications = notifications.filter(n => !n.isRead)
  const oldNotifications = notifications.filter(n => n.isRead)

  return (
    <View style={styles.container}>
      <MobileHeader 
        title="Notifications" 
        showBack 
        onBack={handleBack}
      />

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7B68EE" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchNotifications()}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
            const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
            if (isCloseToBottom && hasMore && !loading) {
              loadMore()
            }
          }}
          scrollEventThrottle={400}
        >
          {newNotifications.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Nouvelles</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
                {unreadCount > 0 && (
                  <TouchableOpacity 
                    onPress={handleMarkAllAsRead}
                    style={styles.markAllButton}
                  >
                    <Text style={styles.markAllButtonText}>Tout marquer comme lu</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.notificationsList}>
                {newNotifications.map((notification) => {
                  const colors = iconColorMap[notification.type as keyof typeof iconColorMap]
                  const icon = iconMap[notification.type as keyof typeof iconMap]
                  
                  return (
                    <TouchableOpacity 
                      key={notification.id} 
                      style={styles.notificationItem}
                      onPress={() => handleNotificationPress(notification)}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
                        <Ionicons name={icon} size={24} color={colors.text} />
                      </View>
                      <View style={styles.notificationContent}>
                        <View style={styles.notificationHeader}>
                          <Text style={styles.notificationTitle}>{notification.title}</Text>
                          <View style={styles.newDot} />
                        </View>
                        <Text style={styles.notificationDescription} numberOfLines={2}>
                          {notification.description}
                        </Text>
                        <Text style={styles.notificationTime}>
                          {formatTime(notification.createdAt)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          )}

          {oldNotifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Précédentes</Text>

              <View style={styles.notificationsList}>
                {oldNotifications.map((notification) => {
                  const colors = iconColorMap[notification.type as keyof typeof iconColorMap]
                  const icon = iconMap[notification.type as keyof typeof iconMap]
                  
                  return (
                    <TouchableOpacity 
                      key={notification.id} 
                      style={styles.notificationItem}
                      onPress={() => handleNotificationPress(notification)}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
                        <Ionicons name={icon} size={24} color={colors.text} />
                      </View>
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        <Text style={styles.notificationDescription} numberOfLines={2}>
                          {notification.description}
                        </Text>
                        <Text style={styles.notificationTime}>
                          {formatTime(notification.createdAt)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          )}

          {notifications.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>Aucune notification</Text>
              <Text style={styles.emptySubtext}>
                Vous n'avez pas encore de notifications
              </Text>
            </View>
          )}

          {loading && notifications.length > 0 && (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#7B68EE" />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  )
}