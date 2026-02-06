// src/config/api.config.ts
import API_BASE_URL from './baseUrl';

export const API_CONFIG = {
  BACKEND_URL: API_BASE_URL,
};

export const getImageUrl = (imageUrl?: string | null): string | null => {
  if (!imageUrl) return null;

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  const separator = imageUrl.startsWith('/') ? '' : '/';
  return `${API_CONFIG.BACKEND_URL}${separator}${imageUrl}`;
};

export const getImageUri = getImageUrl;