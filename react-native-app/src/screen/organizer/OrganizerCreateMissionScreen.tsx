import { useState, useEffect, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Image, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { WebView } from "react-native-webview"
import * as ImagePicker from 'expo-image-picker'
import MobileHeader from "../../components/MobileHeader"
import { styles } from '../../style/organizer/OrganizerCreateMissionScreen.style'
import { useMission } from '../../hooks/useMissions'

interface OrganizerCreateMissionScreenProps {
  onNavigate: (screen: string) => void
}

export default function OrganizerCreateMissionScreen({ onNavigate }: OrganizerCreateMissionScreenProps) {
  const { createMission, loading, error, createSuccess, resetSuccess, clearMissionError } = useMission()
  const webViewRef = useRef<WebView>(null)

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    maxParticipants: "",
    description: "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  })

  const [imageUri, setImageUri] = useState<string | null>(null)
  const [showMapModal, setShowMapModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<{ latitude: number; longitude: number } | null>(null)

  // Position initiale (Casablanca)
  const DEFAULT_LAT = 33.5731
  const DEFAULT_LNG = -7.5898

  // HTML de la carte Leaflet (OpenStreetMap - 100% gratuit)
  const getMapHTML = (initLat: number, initLng: number, markerLat: number | null, markerLng: number | null) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #map { width: 100%; height: 100%; }
      </style>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([${initLat}, ${initLng}], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        let marker = null;

        // Marqueur existant si position déjà choisie
        ${markerLat !== null && markerLng !== null ? `
          marker = L.marker([${markerLat}, ${markerLng}]).addTo(map);
        ` : ''}

        // Quand on clique sur la carte
        map.on('click', function(e) {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;

          // Déplacer ou créer le marqueur
          if (marker) {
            marker.setLatLng([lat, lng]);
          } else {
            marker = L.marker([lat, lng]).addTo(map);
          }

          // Envoyer les coordonnées vers React Native
          window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: lat, longitude: lng }));
        });
      </script>
    </body>
    </html>
  `

  useEffect(() => {
    if (createSuccess) {
      Alert.alert('Succès', 'Mission créée avec succès!', [
        {
          text: 'OK',
          onPress: () => {
            resetSuccess()
            onNavigate("organizer-dashboard")
          },
        },
      ])
    }
  }, [createSuccess])

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error)
      clearMissionError()
    }
  }, [error])

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à la galerie')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.date || !formData.time ||
        !formData.location || !formData.maxParticipants) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires')
      return
    }

    const missionData = {
      ...formData,
      latitude: formData.latitude,
      longitude: formData.longitude,
    }

    try {
      await createMission(missionData, imageUri || undefined)
    } catch (err) {
      console.error('Erreur lors de la création:', err)
    }
  }

  // Ouvrir le modal carte
  const handleOpenMap = () => {
    if (formData.latitude !== undefined && formData.longitude !== undefined) {
      setSelectedPosition({ latitude: formData.latitude, longitude: formData.longitude })
    } else {
      setSelectedPosition(null)
    }
    setShowMapModal(true)
  }

  // Recevoir les coordonnées depuis la WebView
  const handleWebViewMessage = (event: any) => {
    try {
      const { latitude, longitude } = JSON.parse(event.nativeEvent.data)
      setSelectedPosition({ latitude, longitude })
    } catch (e) {
      console.error('Erreur parsing message WebView:', e)
    }
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

  // Supprimer la position
  const handleClearPosition = () => {
    setFormData({
      ...formData,
      latitude: undefined,
      longitude: undefined,
    })
  }

  return (
    <View style={styles.container}>
      <MobileHeader title="Créer une mission" showBack onBack={() => onNavigate("organizer-dashboard")} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Image Upload */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Image de la mission</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={48} color="#999" />
                  <Text style={styles.uploadText}>Cliquez pour télécharger une image</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Titre de la mission *</Text>
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
            <Text style={styles.label}>Catégorie *</Text>
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
              <Text style={styles.label}>Date *</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="calendar-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingLeft: 40 }]}
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            <View style={{ width: 16 }} />
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Heure *</Text>
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
            <Text style={styles.label}>Durée (optionnel)</Text>
            <TextInput
              style={styles.input}
              value={formData.duration}
              onChangeText={(text) => setFormData({ ...formData, duration: text })}
              placeholder="Ex: 3 heures"
              placeholderTextColor="#999"
            />
          </View>

          {/* Location */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Lieu *</Text>
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

          {/* Position exacte – carte uniquement (facultatif) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Position exacte (facultatif)</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                style={[styles.mapButton, { flex: 1 }]}
                onPress={handleOpenMap}
              >
                <Ionicons
                  name={formData.latitude !== undefined ? "location" : "map-outline"}
                  size={20}
                  color="#7B68EE"
                />
                <Text style={styles.mapButtonText}>
                  {formData.latitude !== undefined && formData.longitude !== undefined
                    ? `${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}`
                    : "Sélectionner sur la carte"}
                </Text>
              </TouchableOpacity>

              {formData.latitude !== undefined && (
                <TouchableOpacity onPress={handleClearPosition}>
                  <Ionicons name="close-circle" size={24} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Max Participants */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre de participants maximum *</Text>
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

      {/* Fixed Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity onPress={() => onNavigate("organizer-dashboard")} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} disabled={loading}>
          <Text style={styles.submitButtonText}>{loading ? 'Chargement...' : 'Publier'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Carte – Leaflet / OpenStreetMap */}
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
            <WebView
              ref={webViewRef}
              source={{
                html: getMapHTML(
                  selectedPosition?.latitude ?? DEFAULT_LAT,
                  selectedPosition?.longitude ?? DEFAULT_LNG,
                  selectedPosition?.latitude ?? null,
                  selectedPosition?.longitude ?? null
                ),
              }}
              style={styles.map}
              onMessage={handleWebViewMessage}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />

            {/* Info position sous la carte */}
            <View style={styles.selectedPositionInfo}>
              <Ionicons
                name={selectedPosition ? "location" : "location-outline"}
                size={24}
                color={selectedPosition ? "#7B68EE" : "#999"}
              />
              <Text style={styles.selectedPositionText}>
                {selectedPosition
                  ? `${selectedPosition.latitude.toFixed(6)}, ${selectedPosition.longitude.toFixed(6)}`
                  : "Tapez sur la carte pour sélectionner un point"}
              </Text>
            </View>
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