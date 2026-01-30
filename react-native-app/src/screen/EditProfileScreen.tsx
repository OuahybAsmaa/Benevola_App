// src/screen/EditProfileScreen.tsx
import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../hooks/useAuth"
import * as ImagePicker from "expo-image-picker"
import MobileHeader from "../components/MobileHeader"
import { styles } from '../style/benevole/EditProfileScreen.style'

interface EditProfileScreenProps {
  onNavigate: (screen: string) => void
}

export default function EditProfileScreen({ onNavigate }: EditProfileScreenProps) {
  const { user } = useAuth()
  if (!user) return null

  const isOrganizer = user.role === "organisation"

  const [firstName, setFirstName] = useState(user.firstName || "")
  const [lastName, setLastName] = useState(user.lastName || "")
  const [phone, setPhone] = useState(user.phone || "")
  const [newPhotoUri, setNewPhotoUri] = useState<string | null>(null)
  const [isPicking, setIsPicking] = useState(false)

  const pickImage = async () => {
  if (isPicking) return;
  setIsPicking(true);

  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Accès à la galerie requis.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,               // ← Désactive le crop/édition
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setNewPhotoUri(result.assets[0].uri);
    }
  } catch (error) {
    console.error('Erreur galerie:', error);
    Alert.alert('Erreur', 'Problème lors de l\'ouverture de la galerie');
  } finally {
    setIsPicking(false);
  }
};



  const handleSave = async () => {
    Alert.alert("Enregistrement simulé", "Les modifications ont été enregistrées (backend en attente)")
    onNavigate(isOrganizer ? "profil-organisateur" : "profile")
  }



  return (
    <View style={styles.container}>
      <MobileHeader
        title="Modifier mon profil"
        showBack
        onBack={() => onNavigate(isOrganizer ? "profil-organisateur" : "profile")}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.avatarSection}>
  {newPhotoUri ? (
    <Image 
      source={{ uri: newPhotoUri }} 
      style={styles.avatarImage} 
    />
  ) : user.avatar ? (
    <Image 
      source={{ uri: user.avatar }} 
      style={styles.avatarImage} 
    />
  ) : (
    <View style={styles.avatarEmptyPlaceholder}>
      <Ionicons name="person" size={60} color="#9ca3af" />
    </View>
  )}

  <TouchableOpacity 
    style={styles.changePhotoButton} 
    onPress={pickImage}
    disabled={isPicking}
  >
    <Ionicons name="camera-outline" size={16} color="white" />
    <Text style={styles.changePhotoText}>
      {isPicking ? "Ouverture..." : "Changer la photo"}
    </Text>
  </TouchableOpacity>
</View>

        {/* Les champs restent identiques */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Prénom"
            placeholderTextColor="#999"
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
          />
        </View>

        {/* Champ spécifique organisateur (optionnel) */}
        {isOrganizer && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nom de l'organisation</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Association Verte"
              placeholderTextColor="#999"
              // Si tu ajoutes organizationName plus tard dans la table
            />
          </View>
        )}
      </ScrollView>

      {/* Boutons bas */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => onNavigate(isOrganizer ? "profil-organisateur" : "profile")}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

