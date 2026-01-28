import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
// Ajoute cette ligne si tu veux le type strict
// import { ImageSourcePropType } from "react-native"

interface Mission {
  id: string
  title: string
  category: string
  image: any  // ← ou ImageSourcePropType si tu importes
  distance: string
  date: string
  time: string
  participants: number
  maxParticipants: number
  organization: {
    name: string
    logo: any  // ← ou ImageSourcePropType
  }
}

interface MissionCardProps {
  mission: Mission
  onClick: () => void
}

const categoryColors: Record<string, string> = {
  Environnement: "#10B981",
  Social: "#3B82F6",
  Éducation: "#F97316",
  Santé: "#EF4444",
  Culture: "#A855F7",
}

export default function MissionCard({ mission, onClick }: MissionCardProps) {
  const progress = (mission.participants / mission.maxParticipants) * 100

  return (
    <TouchableOpacity style={styles.card} onPress={onClick} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={mission.image} style={styles.image}  resizeMode="cover"/>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColors[mission.category] || "#6B7280" }]}>
          <Text style={styles.categoryText}>{mission.category}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {mission.title}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color="#7B68EE" />
            <Text style={styles.detailText}>{mission.distance}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color="#7B68EE" />
            <Text style={styles.detailText}>{mission.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color="#7B68EE" />
            <Text style={styles.detailText}>{mission.time}</Text>
          </View>

          <View style={styles.participantsSection}>
            <View style={styles.detailRow}>
              <Ionicons name="people" size={16} color="#7B68EE" />
              <Text style={styles.detailText}>
                {mission.participants}/{mission.maxParticipants} places
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.organizationInfo}>
            <View style={styles.orgAvatar}>
              <Text style={styles.orgAvatarText}>{mission.organization.name[0]}</Text>
            </View>
            <Text style={styles.orgName}>{mission.organization.name}</Text>
          </View>

          <Text style={styles.detailsLink}>Voir détails →</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 176,
  },
  image: {
    width: "100%",
    height: "100%",
  },

  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  details: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#6B7280",
  },
  participantsSection: {
    gap: 6,
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7B68EE",
    borderRadius: 3,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  organizationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orgAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
  },
  orgAvatarText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  orgName: {
    fontSize: 12,
    color: "#6B7280",
  },
  detailsLink: {
    fontSize: 14,
    color: "#7B68EE",
    fontWeight: "500",
  },
})
