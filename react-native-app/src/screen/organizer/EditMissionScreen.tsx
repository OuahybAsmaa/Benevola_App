import { useState, useEffect, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { WebView } from "react-native-webview"
import * as ImagePicker from 'expo-image-picker'
import MobileHeader from "../../components/MobileHeader"
import { styles } from '../../style/organizer/EditMissionScreen.style'
import API_BASE_URL from '../../config/baseUrl'
import * as SecureStore from 'expo-secure-store'

interface EditMissionScreenProps {
  onNavigate: (screen: string) => void
  missionId?: string
}

interface MissionData {
  title: string
  category: string
  date: string
  time: string
  duration: string
  location: string
  maxParticipants: string
  description: string
  latitude: string
  longitude: string
  image?: string
}

export default function EditMissionScreen({ onNavigate, missionId }: EditMissionScreenProps) {
  const [formData, setFormData] = useState<MissionData>({
    title: "",
    category: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    maxParticipants: "",
    description: "",
    latitude: "",
    longitude: "",
    image: undefined,
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const webViewRef = useRef<WebView>(null)

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

  // Charger les données de la mission
  useEffect(() => {
    if (missionId) {
      fetchMissionData()
    }
  }, [missionId])

  const fetchMissionData = async () => {
    try {
      setLoading(true)
      console.log('🔍 Chargement de la mission:', missionId)
      
      const response = await fetch(`${API_BASE_URL}/missions/${missionId}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la mission')
      }

      const mission = await response.json()
      console.log('✅ Mission reçue:', mission)
      
      let latitude = ""
      let longitude = ""
      
      if (mission.position && mission.position.coordinates) {
        longitude = mission.position.coordinates[0]?.toString() || ""
        latitude = mission.position.coordinates[1]?.toString() || ""
      }
      
      let formattedDate = mission.date
      if (mission.date && mission.date.includes('T')) {
        formattedDate = mission.date.split('T')[0]
      }
      
      setFormData({
        title: mission.title || "",
        category: mission.category || "",
        date: formattedDate || "",
        time: mission.time || "",
        duration: mission.duration?.toString() || "",
        location: mission.location || "",
        maxParticipants: mission.maxParticipants?.toString() || "",
        description: mission.description || "",
        latitude: latitude,
        longitude: longitude,
        image: mission.image || undefined,
      })

      // Si la mission a des coordonnées → on les met dans selectedPosition pour la carte
      if (latitude && longitude) {
        const lat = parseFloat(latitude)
        const lng = parseFloat(longitude)
        if (!isNaN(lat) && !isNaN(lng)) {
          setSelectedPosition({ latitude: lat, longitude: lng })
        }
      }

      console.log('✅ Formulaire initialisé')
    } catch (error) {
      console.error('❌ Erreur chargement:', error)
      Alert.alert('Erreur', 'Impossible de charger la mission')
    } finally {
      setLoading(false)
    }
  }

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Nous avons besoin de votre permission pour accéder à vos photos')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri)
        console.log('✅ Image sélectionnée:', result.assets[0].uri)
      }
    } catch (error) {
      console.error('❌ Erreur sélection image:', error)
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image')
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Erreur', 'Le titre est requis')
      return
    }
    if (!formData.category.trim()) {
      Alert.alert('Erreur', 'La catégorie est requise')
      return
    }
    if (!formData.date.trim()) {
      Alert.alert('Erreur', 'La date est requise')
      return
    }

    try {
      setSubmitting(true)

      const token = await SecureStore.getItemAsync("access_token")
      if (!token) {
        Alert.alert('Erreur', 'Vous devez être connecté')
        return
      }

      const formDataToSend = new FormData()
      
      formDataToSend.append('title', formData.title)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('date', formData.date)
      formDataToSend.append('time', formData.time)
      formDataToSend.append('duration', formData.duration)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('maxParticipants', formData.maxParticipants)
      formDataToSend.append('description', formData.description)
      
      if (formData.latitude) {
        formDataToSend.append('latitude', formData.latitude)
      }
      if (formData.longitude) {
        formDataToSend.append('longitude', formData.longitude)
      }

      if (selectedImage) {
        const filename = selectedImage.split('/').pop() || 'image.jpg'
        const match = /\.(\w+)$/.exec(filename)
        const type = match ? `image/${match[1]}` : 'image/jpeg'

        formDataToSend.append('image', {
          uri: selectedImage,
          name: filename,
          type: type,
        } as any)
      }

      console.log('📤 Envoi de la mise à jour pour mission:', missionId)

      const response = await fetch(`${API_BASE_URL}/missions/${missionId}`, {
        method: 'PUT',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }))
        throw new Error(errorData.message || 'Erreur lors de la mise à jour')
      }

      const updatedMission = await response.json()
      console.log('✅ Mission mise à jour:', updatedMission)

      Alert.alert('Succès', 'Mission mise à jour avec succès', [
        {
          text: 'OK',
          onPress: () => onNavigate("organizer-dashboard")
        }
      ])
    } catch (error) {
      console.error('❌ Erreur mise à jour:', error)
      Alert.alert('Erreur', error instanceof Error ? error.message : 'Impossible de mettre à jour la mission')
    } finally {
      setSubmitting(false)
    }
  }

  // ────────────────────────────────────────────────
  //               FONCTIONS CARTE (comme dans création)
  // ────────────────────────────────────────────────

  const handleOpenMap = () => {
    if (formData.latitude && formData.longitude) {
      const lat = parseFloat(formData.latitude)
      const lng = parseFloat(formData.longitude)
      if (!isNaN(lat) && !isNaN(lng)) {
        setSelectedPosition({ latitude: lat, longitude: lng })
      } else {
        setSelectedPosition(null)
      }
    } else {
      setSelectedPosition(null)
    }
    setShowMapModal(true)
  }

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
        latitude: selectedPosition.latitude.toString(),
        longitude: selectedPosition.longitude.toString(),
      })
      setShowMapModal(false)
    }
  }

  const handleClearPosition = () => {
    setFormData({
      ...formData,
      latitude: "",
      longitude: "",
    })
    setSelectedPosition(null)
  }

  const getImageUri = (imageUrl: string | null | undefined): string | null => {
    if (!imageUrl) return null
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    const separator = imageUrl.startsWith('/') ? '' : '/'
    return `${API_BASE_URL}${separator}${imageUrl}`
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <MobileHeader title="Modifier la mission" showBack onBack={() => onNavigate("organizer-dashboard")} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#7B68EE" />
          <Text style={{ marginTop: 12, color: '#666' }}>Chargement...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MobileHeader title="Modifier la mission" showBack onBack={() => onNavigate("organizer-dashboard")} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          {/* Image Upload */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Image de la mission</Text>
            <TouchableOpacity style={styles.imageUploadButton} onPress={handlePickImage}>
              {selectedImage || formData.image ? (
                <Image
                  source={{ uri: selectedImage || getImageUri(formData.image) || '' }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={48} color="#ccc" />
                  <Text style={styles.imagePlaceholderText}>Toucher pour changer l'image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

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
                  placeholder="YYYY-MM-DD"
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

          {/* Position exacte – carte Leaflet (comme dans création) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Position exacte (facultatif)</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                style={[styles.mapButton, { flex: 1 }]}
                onPress={handleOpenMap}
              >
                <Ionicons
                  name={formData.latitude && formData.longitude ? "location" : "map-outline"}
                  size={20}
                  color="#7B68EE"
                />
                <Text style={styles.mapButtonText}>
                  {formData.latitude && formData.longitude
                    ? `${parseFloat(formData.latitude).toFixed(5)}, ${parseFloat(formData.longitude).toFixed(5)}`
                    : "Sélectionner sur la carte"}
                </Text>
              </TouchableOpacity>

              {(formData.latitude && formData.longitude) && (
                <TouchableOpacity onPress={handleClearPosition}>
                  <Ionicons name="close-circle" size={24} color="#999" />
                </TouchableOpacity>
              )}
            </View>
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
        <TouchableOpacity 
          onPress={() => onNavigate("organizer-dashboard")} 
          style={styles.cancelButton}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleSubmit} 
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Mettre à jour</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal Carte – Leaflet / OpenStreetMap (exactement comme dans création) */}
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