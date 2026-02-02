import axios from 'axios';

const API_URL = 'http://192.168.0.105:3000'; // 👈 CHANGEZ CETTE IP

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const profileAPI = {
  updateProfile: async (data: UpdateProfileData, token: string) => {
    const response = await axios.put(
      `${API_URL}/profile`,
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
      `${API_URL}/profile/avatar`,
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
      `${API_URL}/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};