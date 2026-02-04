// src/api/profile.ts
import axios from 'axios';
import API_BASE_URL from '../config/baseUrl'; // 👈 Import de l'URL de base

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const profileAPI = {
  updateProfile: async (data: UpdateProfileData, token: string) => {
    const response = await axios.put(
      `${API_BASE_URL}/profile`, // 👈 Utilise API_BASE_URL
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  uploadAvatar: async (uri: string, token: string) => {
    const formData = new FormData();
    
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    
    formData.append('avatar', {
      uri,
      name: `avatar.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    const response = await axios.post(
      `${API_BASE_URL}/profile/avatar`, // 👈 Utilise API_BASE_URL
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getProfile: async (token: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/profile`, // 👈 Utilise API_BASE_URL
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

// Optionnel : export par défaut pour compatibilité
export default profileAPI;