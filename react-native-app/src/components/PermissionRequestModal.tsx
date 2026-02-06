// src/components/PermissionRequestModal.tsx
import React, { useState, memo, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PermissionRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onGrantPermission: () => Promise<boolean>;
}

export const PermissionRequestModal: React.FC<PermissionRequestModalProps> = memo(({
  visible,
  onClose,
  onGrantPermission,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleGrantPermission = useCallback(async () => {
    setLoading(true);
    try {
      const granted = await onGrantPermission();
      if (granted) {
        Alert.alert(
          'Succès',
          'Les notifications sont maintenant activées !',
          [{ text: 'OK', onPress: handleClose }]
        );
      } else {
        Alert.alert(
          'Permission refusée',
          'Vous pourrez activer les notifications plus tard dans les paramètres.',
          [{ text: 'OK', onPress: handleClose }]
        );
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    } finally {
      setLoading(false);
    }
  }, [onGrantPermission, handleClose]);

  const openSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
    handleClose();
  }, [handleClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 24,
          width: '100%',
          maxWidth: 400,
          alignItems: 'center',
        }}>
          <Ionicons name="notifications-outline" size={64} color="#7B68EE" />
          
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginTop: 16,
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Activer les notifications
          </Text>
          
          <Text style={{
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 22,
          }}>
            Recevez des notifications importantes pour vos missions, messages et rappels. Ne manquez aucune opportunité !
          </Text>
          
          <View style={{ width: '100%', gap: 12 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#7B68EE',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
              }}
              onPress={handleGrantPermission}
              disabled={loading}
            >
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
                {loading ? 'Traitement...' : 'Activer les notifications'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#ddd',
              }}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={{
                color: '#666',
                fontSize: 16,
              }}>
                Plus tard
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                padding: 12,
                alignItems: 'center',
              }}
              onPress={openSettings}
            >
              <Text style={{
                color: '#7B68EE',
                fontSize: 14,
                textDecorationLine: 'underline',
              }}>
                Ouvrir les paramètres
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});