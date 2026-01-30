import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import MobileHeader from "../../components/MobileHeader"
import { styles } from '../../style/organizer/EditMissionScreen.style'
interface EditMissionScreenProps {
  onNavigate: (screen: string) => void
  missionId?: string
}

export default function EditMissionScreen({ onNavigate, missionId }: EditMissionScreenProps) {
  const [formData, setFormData] = useState({
    title: "Nettoyage de la plage Ain Diab",
    category: "Environnement",
    date: "23/12/2024",
    time: "10:00",
    duration: "3",
    location: "Ain Diab, Casablanca",
    maxParticipants: "10",
    description: "Rejoignez-nous pour nettoyer cette belle plage et protéger l'environnement.",
    latitude: 33.5731 as number | null,
    longitude: -7.5898 as number | null,
  })

  const [showMapModal, setShowMapModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const initialRegion = {
    latitude: 33.5731,
    longitude: -7.5898,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  const handleSubmit = () => {
    onNavigate("organizer-dashboard")
  }

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    setSelectedPosition({ latitude, longitude })
  }

  const handleValidatePosition = () => {
    if (selectedPosition) {
      setFormData({
        ...formData,
        latitude: selectedPosition.latitude,
        longitude: selectedPosition.longitude,
      })
      setShowMapModal(false)
    }
  }

  return (
    <View style={styles.container}>
      <MobileHeader title="Modifier la mission" showBack onBack={() => onNavigate("organizer-dashboard")} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Titre de la mission</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Ex: Nettoyage de la plage"
              placeholderTextColor="#999"
            />
          </View>

          {/* Category */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Catégorie</Text>
            <TextInput
              style={styles.input}
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              placeholder="Environnement, Social, Éducation..."
              placeholderTextColor="#999"
            />
          </View>

          {/* Date & Time */}
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Date</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="calendar-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingLeft: 40 }]}
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                  placeholder="JJ/MM/AAAA"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            <View style={{ width: 16 }} />
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Heure</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="time-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingLeft: 40 }]}
                  value={formData.time}
                  onChangeText={(text) => setFormData({ ...formData, time: text })}
                  placeholder="HH:MM"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          {/* Duration */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Durée (heures)</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="hourglass-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingLeft: 40 }]}
                value={formData.duration}
                onChangeText={(text) => setFormData({ ...formData, duration: text })}
                placeholder="3"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Location */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Lieu</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="location-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingLeft: 40 }]}
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                placeholder="Adresse complète"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Map Position */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Position exacte</Text>
            <TouchableOpacity style={styles.mapButton} onPress={() => setShowMapModal(true)}>
              <Ionicons name="map-outline" size={20} color="#7B68EE" />
              <Text style={styles.mapButtonText}>
                {formData.latitude && formData.longitude
                  ? `Position: ${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}`
                  : "Sélectionner sur la carte"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Max Participants */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre de participants maximum</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="people-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingLeft: 40 }]}
                value={formData.maxParticipants}
                onChangeText={(text) => setFormData({ ...formData, maxParticipants: text })}
                placeholder="10"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="document-text-outline" size={20} color="#999" style={styles.inputIconTop} />
              <TextInput
                style={[styles.textArea, { paddingLeft: 40 }]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Décrivez la mission en détail..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity onPress={() => onNavigate("organizer-dashboard")} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Mettre à jour</Text>
        </TouchableOpacity>
      </View>

      {/* Map Modal */}
      <Modal visible={showMapModal} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowMapModal(false)}>
              <Ionicons name="close" size={28} color="#111" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Sélectionner la position</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={initialRegion}
              onPress={handleMapPress}
              showsUserLocation
              showsMyLocationButton
            >
              {selectedPosition && (
                <Marker
                  coordinate={selectedPosition}
                  title="Position sélectionnée"
                  description={`${selectedPosition.latitude.toFixed(6)}, ${selectedPosition.longitude.toFixed(6)}`}
                  pinColor="#7B68EE"
                />
              )}
            </MapView>

            {selectedPosition && (
              <View style={styles.selectedPositionInfo}>
                <Ionicons name="location" size={24} color="#7B68EE" />
                <Text style={styles.selectedPositionText}>Latitude: {selectedPosition.latitude.toFixed(6)}</Text>
                <Text style={styles.selectedPositionText}>Longitude: {selectedPosition.longitude.toFixed(6)}</Text>
              </View>
            )}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.validateButton, !selectedPosition && styles.validateButtonDisabled]}
              onPress={handleValidatePosition}
              disabled={!selectedPosition}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.validateButtonText}>Valider la position</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

