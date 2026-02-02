import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../hooks/useAuth"
import * as ImagePicker from "expo-image-picker"
import MobileHeader from "../components/MobileHeader"
import { styles } from '../style/benevole/EditProfileScreen.style'
import { getImageUrl } from "../config/api.config" // ✅ Import

interface EditProfileScreenProps {
  onNavigate: (screen: string) => void
}

export default function EditProfileScreen({ onNavigate }: EditProfileScreenProps) {
  const { user, updateProfile, uploadAvatar, isLoading } = useAuth()
  if (!user) return null

  const isOrganizer = user.role === "organisation"
  const [firstName, setFirstName] = useState(user.firstName || "")
  const [lastName, setLastName] = useState(user.lastName || "")
  const [phone, setPhone] = useState(user.phone || "")
  const [newPhotoUri, setNewPhotoUri] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Accès à la galerie requis.')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true, // ✅ Permet de recadrer
        aspect: [1, 1], // ✅ Format carré
        quality: 0.8,
      })

      if (!result.canceled && result.assets?.[0]?.uri) {
        setNewPhotoUri(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Erreur galerie:', error)
      Alert.alert('Erreur', "Problème lors de l'ouverture de la galerie")
    }
  }

  const handleSave = async () => {
    try {
      // 1. Upload avatar si nécessaire
      if (newPhotoUri) {
        setIsUploadingAvatar(true)
        await uploadAvatar(newPhotoUri)
        setIsUploadingAvatar(false)
      }

      // 2. Mise à jour des autres champs
      const updateData: any = {}
      if (firstName !== user.firstName) updateData.firstName = firstName
      if (lastName !== user.lastName) updateData.lastName = lastName
      if (phone !== user.phone) updateData.phone = phone

      if (Object.keys(updateData).length > 0) {
        await updateProfile(updateData)
      }

      Alert.alert('Succès', 'Votre profil a été mis à jour avec succès')
      onNavigate(isOrganizer ? "profil-organisateur" : "profile")
    } catch (error: any) {
      console.error('Erreur sauvegarde:', error)
      Alert.alert('Erreur', error.message || 'Impossible de mettre à jour le profil')
    }
  }

  // ✅ URL de l'avatar
  const avatarUrl = getImageUrl(user.avatar)

  return (
    <View style={styles.container}>
      <MobileHeader
        title="Modifier mon profil"
        showBack
        onBack={() => onNavigate(isOrganizer ? "profil-organisateur" : "profile")}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.avatarSection}>
          {/* ✅ Affichage de l'avatar avec gestion correcte */}
          {newPhotoUri ? (
            <Image source={{ uri: newPhotoUri }} style={styles.avatarImage} />
          ) : avatarUrl ? (
            <Image 
              source={{ uri: avatarUrl }} 
              style={styles.avatarImage}
              onError={() => console.log('❌ Erreur chargement avatar')}
              onLoad={() => console.log('✅ Avatar chargé')}
            />
          ) : (
            <View style={styles.avatarEmptyPlaceholder}>
              <Ionicons name="person" size={60} color="#9ca3af" />
            </View>
          )}

          <TouchableOpacity 
            style={styles.changePhotoButton} 
            onPress={pickImage} 
            disabled={isLoading || isUploadingAvatar}
          >
            {isUploadingAvatar ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="camera-outline" size={16} color="white" />
                <Text style={styles.changePhotoText}>Changer la photo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Prénom"
            placeholderTextColor="#999"
            editable={!isLoading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Nom"
            placeholderTextColor="#999"
            editable={!isLoading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Téléphone"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            editable={!isLoading}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => onNavigate(isOrganizer ? "profil-organisateur" : "profile")}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.saveButton, isLoading && { opacity: 0.6 }]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}