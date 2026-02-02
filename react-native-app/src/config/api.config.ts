// src/config/api.config.ts
import API_BASE_URL from './baseUrl';

export const API_CONFIG = {
  BACKEND_URL: API_BASE_URL,
};

/**
 * Helper pour construire les URLs d'images
 * Utilise la même logique que dans OrganizerDashboardScreen
 */
export const getImageUrl = (imageUrl?: string | null): string | null => {
  if (!imageUrl) return null;
  
  // Si c'est déjà une URL complète
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Si le chemin commence déjà par '/', ne pas ajouter de séparateur
  const separator = imageUrl.startsWith('/') ? '' : '/';
  return `${API_CONFIG.BACKEND_URL}${separator}${imageUrl}`;
};

/**
 * Alias pour compatibilité avec le code existant
 */
export const getImageUri = getImageUrl;