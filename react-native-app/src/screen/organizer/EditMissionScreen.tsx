"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import MobileHeader from "../../components/MobileHeader"

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#111",
  },
  textArea: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#111",
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputWithIcon: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    top: 14,
    zIndex: 1,
  },
  inputIconTop: {
    position: "absolute",
    left: 12,
    top: 12,
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  mapButtonText: {
    fontSize: 14,
    color: "#7B68EE",
    fontWeight: "500",
    flex: 1,
  },
  bottomButtons: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#7B68EE",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  selectedPositionInfo: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedPositionText: {
    fontSize: 13,
    color: "#111",
    fontWeight: "500",
  },
  modalButtons: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  validateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7B68EE",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  validateButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  validateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
})
