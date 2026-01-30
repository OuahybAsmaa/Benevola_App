import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MobileHeader from "../../components/MobileHeader"
import { useAuth } from "../../hooks/useAuth"
import { styles } from '../../style/organizer/EditOrganizerProfileScreen.style'

interface EditOrganizerProfileScreenProps {
  onNavigate: (screen: string) => void
}

export default function EditOrganizerProfileScreen({ onNavigate }: EditOrganizerProfileScreenProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
  firstName:    user?.firstName    || "",
  lastName:     user?.lastName     || "",
  email:        user?.email        || "",
  phone:        user?.phone        || "",
});
  

  const handleSave = () => {
    // Sauvegarder les changements
    onNavigate("profil-organisateur")
  }

  return (
    <View style={styles.container}>
      <MobileHeader title="Éditer le Profil" showBack onBack={() => onNavigate("profil-organisateur")} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {formData.firstName[0]}
                {formData.lastName[0]}
              </Text>
            </View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Ionicons name="camera-outline" size={16} color="white" />
              <Text style={styles.changePhotoText}>Changer</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              placeholder="Prénom"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              placeholder="Nom"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Téléphone"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity onPress={() => onNavigate("profil-organisateur")} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

