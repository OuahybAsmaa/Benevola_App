import * as SecureStore from 'expo-secure-store';
import { profileAPI, UpdateProfileData } from '../api/profile';

class ProfileService {
  async updateProfile(data: UpdateProfileData) {
    const token = await SecureStore.getItemAsync('access_token');
    if (!token) throw new Error('Non authentifié');
    
    return await profileAPI.updateProfile(data, token);
  }

  async uploadAvatar(uri: string) {
    const token = await SecureStore.getItemAsync('access_token');
    if (!token) throw new Error('Non authentifié');
    
    return await profileAPI.uploadAvatar(uri, token);
  }

  async getProfile() {
    const token = await SecureStore.getItemAsync('access_token');
    if (!token) throw new Error('Non authentifié');
    
    return await profileAPI.getProfile(token);
  }
}

export default new ProfileService();