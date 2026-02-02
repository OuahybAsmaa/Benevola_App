// src/screen/MissionDetailScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMission } from "../hooks/useMissions";
import { useMissionParticipant } from "../hooks/useMissionParticipant";
import { useAuth } from "../hooks/useAuth";
import MobileHeader from "../components/MobileHeader"; // Ajout du MobileHeader
import { styles } from "../style/benevole/MissionDetailScreen.style";
import { colors } from "../style/theme";
import { getImageUrl } from "../config/api.config"; // Import pour les URLs d'images

// ⭐ PROPS PERSONNALISÉES (pas de React Navigation)
interface MissionDetailScreenProps {
  missionId: string;
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
    canGoBack: boolean;
  };
  onNavigate: (screen: string, params?: any) => void;
}

const MissionDetailScreen: React.FC<MissionDetailScreenProps> = ({ 
  missionId, 
  navigation,
  onNavigate 
}) => {
  const { currentMission, loading: missionLoading, getMissionById } = useMission();
  const {
    isRegistered,
    participantCount,
    loading: participantLoading,
    error: participantError,
    registerToMission,
    unregisterFromMission,
    checkRegistration,
  } = useMissionParticipant();
  const { user } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  // ⭐ Vérification de la présence du missionId
  useEffect(() => {
    if (!missionId) {
      console.error('❌ Aucun missionId fourni');
      Alert.alert('Erreur', 'Mission introuvable');
      navigation.goBack();
      return;
    }
    
    console.log('✅ MissionDetailScreen monté avec ID:', missionId);
    loadMissionData();
  }, [missionId]);

  const loadMissionData = async () => {
    try {
      console.log('📡 Chargement mission:', missionId);
      await getMissionById(missionId);
      
      if (user) {
        console.log('👤 Vérification inscription pour user:', user.id);
        await checkRegistration(missionId);
      }
    } catch (error) {
      console.error("❌ Erreur chargement mission:", error);
      Alert.alert('Erreur', 'Impossible de charger la mission');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMissionData();
    setRefreshing(false);
  };

  const handleRegister = async () => {
    if (!user) {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour vous inscrire à une mission",
        [
          { text: "Annuler", style: "cancel" },
          { 
            text: "Se connecter", 
            onPress: () => onNavigate("login") 
          },
        ]
      );
      return;
    }

    try {
      console.log('📝 Inscription à la mission:', missionId);
      await registerToMission(missionId);
      Alert.alert("Succès", "Vous êtes maintenant inscrit à cette mission !");
      await loadMissionData();
    } catch (error: any) {
      console.error('❌ Erreur inscription:', error);
      Alert.alert(
        "Erreur",
        error.response?.data?.message || "Impossible de s'inscrire à cette mission"
      );
    }
  };

  const handleUnregister = () => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment vous désinscrire de cette mission ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se désinscrire",
          style: "destructive",
          onPress: async () => {
            try {
              console.log('🚫 Désinscription de la mission:', missionId);
              await unregisterFromMission(missionId);
              Alert.alert("Succès", "Vous êtes désinscrit de cette mission");
              await loadMissionData();
            } catch (error: any) {
              console.error('❌ Erreur désinscription:', error);
              Alert.alert(
                "Erreur",
                error.response?.data?.message || "Impossible de se désinscrire"
              );
            }
          },
        },
      ]
    );
  };

  // Affichage du chargement
  if (missionLoading && !currentMission) {
    return (
      <View style={styles.centerContainer}>
        <MobileHeader 
          title="Chargement" 
          showBack 
          onBack={navigation.goBack}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  // Affichage erreur
  if (!currentMission) {
    return (
      <View style={{ flex: 1 }}>
        <MobileHeader 
          title="Erreur" 
          showBack 
          onBack={navigation.goBack}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Mission introuvable</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={navigation.goBack}
          >
            <Text style={styles.retryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const mission = currentMission;
  const isOrganizer = user?.id === mission.organizerId;
  const isMissionComplete = mission.status === "complete";
  const isMissionFinished = mission.status === "finished";
  const canRegister = !isOrganizer && !isMissionFinished && !isMissionComplete;

  // URL de l'image de la mission
  const missionImageUrl = mission.image ? getImageUrl(mission.image) : null;
  
  // URL de l'avatar de l'organisateur
  const organizerAvatarUrl = mission.organizer?.avatar ? 
    getImageUrl(mission.organizer.avatar) : null;

  return (
    <View style={{ flex: 1 }}>
      {/* Mobile Header avec bouton retour */}
      <MobileHeader 
        title="Détails de la mission"
        showBack
        onBack={navigation.goBack}
      />

      <ScrollView style={{ flex: 1 }}>
        {/* Image de la mission */}
        <View style={styles.imageContainer}>
          <Image
            source={
              missionImageUrl
                ? { uri: missionImageUrl }
                : require("../../assets/default-mission.png")
            }
            style={styles.image}
            resizeMode="cover"
          />

          {/* Badge catégorie */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{mission.category}</Text>
          </View>

          {/* Actions (partage, favoris) */}
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenu de la mission */}
        <View style={styles.detailsContainer}>
          {/* Organisation */}
          <View style={styles.organizationRow}>
            {organizerAvatarUrl ? (
              <Image
                source={{ uri: organizerAvatarUrl }}
                style={styles.orgAvatarImage}
              />
            ) : (
              <View style={styles.orgAvatar}>
                <Text style={styles.orgAvatarText}>
                  {mission.organizer?.firstName?.charAt(0)?.toUpperCase() || "?"}
                </Text>
              </View>
            )}

            <View style={styles.orgInfo}>
              <View style={styles.orgNameRow}>
                <Text style={styles.orgName}>
                  {mission.organizer?.firstName} {mission.organizer?.lastName}
                </Text>
              </View>
              <Text style={styles.orgVerified}>Organisateur</Text>
            </View>
          </View>

          {/* Titre */}
          <Text style={styles.title}>{mission.title}</Text>

          {/* Informations de base */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>{mission.date}</Text>
            </View>

            <View style={[styles.infoItem, styles.timeItem]}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>{mission.time}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>
                {participantCount}/{mission.maxParticipants} participants
              </Text>
            </View>

            {mission.duration && (
              <View style={[styles.infoItem, styles.timeItem]}>
                <Ionicons name="hourglass-outline" size={20} color={colors.primary} />
                <Text style={styles.infoText}>{mission.duration}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {mission.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{mission.description}</Text>
            </View>
          )}

          {/* Localisation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lieu</Text>
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.primary}
                style={{ marginTop: 2 }}
              />
              <Text style={styles.locationText}>{mission.location}</Text>
            </View>
          </View>

          {/* Statut de la mission */}
          {isMissionComplete && (
            <View style={styles.section}>
              <View
                style={{
                  backgroundColor: colors.warning,
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>
                  Mission complète - Places épuisées
                </Text>
              </View>
            </View>
          )}

          {isMissionFinished && (
            <View style={styles.section}>
              <View
                style={{
                  backgroundColor: colors.text.secondary,
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>
                  Mission terminée
                </Text>
              </View>
            </View>
          )}

          {/* Espace pour le bouton fixe */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bouton d'inscription/désinscription fixe en bas */}
      {!isOrganizer && (
        <View style={styles.bottomButton}>
          {isRegistered ? (
            <TouchableOpacity
              style={[styles.registerButton, styles.registeredButton]}
              onPress={handleUnregister}
              disabled={participantLoading}
            >
              {participantLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.registerText}>Inscrit · Se désinscrire</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={participantLoading || !canRegister}
            >
              {participantLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.registerText}>
                  {isMissionComplete
                    ? "Mission complète"
                    : isMissionFinished
                    ? "Mission terminée"
                    : "S'inscrire"}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default MissionDetailScreen;