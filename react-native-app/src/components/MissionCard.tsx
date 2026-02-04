import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getImageUrl } from "../config/api.config";

interface MissionCardProps {
  mission: {
    id: string;
    title: string;
    category: string;
    date: string;
    time: string;
    location: string;
    image?: string;
    maxParticipants: number;
    participants?: number;
    currentParticipants?: number; // 🔥 AJOUTÉ depuis le backend
    organizer?: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
    distance?: string | number; // 🔥 Distance depuis le backend (en mètres)
    position?: {
      type: string;
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
  onClick: () => void;
  userLocation?: { // 🔥 AJOUTÉ pour calcul côté client
    latitude: number;
    longitude: number;
  } | null;
}

const categoryColors: Record<string, string> = {
  Environnement: "#10B981",
  Social: "#3B82F6",
  Éducation: "#F97316",
  Santé: "#EF4444",
  Culture: "#A855F7",
  all: "#6B7280",
};

export default function MissionCard({ mission, onClick, userLocation }: MissionCardProps) {
  // ✅ Nombre de participants (priorité à currentParticipants du backend)
  const participants = mission.currentParticipants ?? mission.participants ?? 0;
  const max = mission.maxParticipants ?? 1;
  const progress = (participants / max) * 100;

  // ✅ Nom de l'organisateur
  const orgName =
    mission.organizer
      ? `${mission.organizer.firstName || ""} ${mission.organizer.lastName || ""}`.trim() || "Organisation"
      : "Organisation";

  // ✅ Avatar de l'organisateur (image ou initiale)
  const orgAvatarUrl = mission.organizer?.avatar ? getImageUrl(mission.organizer.avatar) : null;
  const orgInitial = orgName.charAt(0).toUpperCase() || "?";

  // ✅ Image de la mission
  const imageUri = getImageUrl(mission.image);

  // 🔥 FONCTION POUR FORMATER LA DISTANCE
  const formatDistance = (distanceInMeters: number): string => {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)} m`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(1)} km`;
    }
  };

  // 🔥 CALCULER LA DISTANCE
  const getDistance = (): string | null => {
    // Si la mission retourne déjà une distance depuis le backend
    if (typeof mission.distance === 'number') {
      return formatDistance(mission.distance);
    }

    // Si la distance est déjà formatée en string
    if (typeof mission.distance === 'string' && mission.distance !== mission.location) {
      return mission.distance;
    }

    // Sinon, calculer côté client si on a la position de l'utilisateur et de la mission
    if (!userLocation || !mission.position?.coordinates) {
      return null;
    }

    const [missionLng, missionLat] = mission.position.coordinates;
    const distanceInMeters = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      missionLat,
      missionLng
    );

    return formatDistance(distanceInMeters);
  };

  // 🔥 FORMULE DE HAVERSINE pour calculer la distance entre deux points GPS
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance en mètres
  };

  const distanceText = getDistance();

  return (
    <TouchableOpacity style={styles.card} onPress={onClick} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
            onError={(error) => {
              console.error('❌ Erreur chargement image:', mission.title, error.nativeEvent.error);
            }}
            onLoad={() => {
              console.log('✅ Image chargée:', mission.title);
            }}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={48} color="#ccc" />
          </View>
        )}

        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: categoryColors[mission.category] || "#6B7280" },
          ]}
        >
          <Text style={styles.categoryText}>{mission.category}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {mission.title}
        </Text>

        <View style={styles.details}>
          {/* 🔥 LOCALISATION AVEC DISTANCE */}
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#7B68EE" />
            <Text style={styles.detailText} numberOfLines={1}>
              {mission.location}
              {distanceText && (
                <Text style={styles.distanceText}> • {distanceText}</Text>
              )}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#7B68EE" />
            <Text style={styles.detailText}>{mission.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#7B68EE" />
            <Text style={styles.detailText}>{mission.time}</Text>
          </View>

          <View style={styles.participantsSection}>
            <View style={styles.detailRow}>
              <Ionicons name="people-outline" size={16} color="#7B68EE" />
              <Text style={styles.detailText}>
                {participants} / {max} inscrits
              </Text>
            </View>

            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.organizationInfo}>
            {/* ✅ AVATAR AVEC IMAGE OU INITIALE */}
            {orgAvatarUrl ? (
              <Image
                source={{ uri: orgAvatarUrl }}
                style={styles.orgAvatarImage}
                onError={() => console.log('❌ Erreur avatar organisateur')}
              />
            ) : (
              <View style={styles.orgAvatar}>
                <Text style={styles.orgAvatarText}>{orgInitial}</Text>
              </View>
            )}
            <Text style={styles.orgName} numberOfLines={1}>
              {orgName}
            </Text>
          </View>

          <Text style={styles.detailsLink}>Voir détails →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 160,
    backgroundColor: "#E5E7EB",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  details: {
    gap: 7,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  // 🔥 STYLE POUR LA DISTANCE (en gras et couleur primaire)
  distanceText: {
    fontWeight: "600",
    color: "#7B68EE",
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
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  organizationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: "70%",
  },
  orgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
  },
  orgAvatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  orgAvatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },
  orgName: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
  },
  detailsLink: {
    fontSize: 14,
    color: "#7B68EE",
    fontWeight: "600",
  },
});