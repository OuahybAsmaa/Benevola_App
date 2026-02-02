// src/services/mission.service.ts
import api from '../api/loginAPI';

export interface CreateMissionDto {
  title: string;
  category: string;
  date: string;
  time: string;
  duration?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  maxParticipants: string;
  description?: string;
  image?: any;
}

export interface Mission {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  duration?: string;
  location: string;
  position?: any;
  maxParticipants: number;
  description?: string;
  image?: string;
  organizerId: string;
  organizer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  status: string; 
}

class MissionService {
  async createMission(missionData: CreateMissionDto, imageUri?: string): Promise<Mission> {
    try {
      const formData = new FormData();
      formData.append('title', missionData.title);
      formData.append('category', missionData.category);
      formData.append('date', missionData.date);
      formData.append('time', missionData.time);
      if (missionData.duration) formData.append('duration', missionData.duration);
      formData.append('location', missionData.location);
      if (missionData.latitude !== undefined) formData.append('latitude', missionData.latitude.toString());
      if (missionData.longitude !== undefined) formData.append('longitude', missionData.longitude.toString());
      formData.append('maxParticipants', missionData.maxParticipants);
      if (missionData.description) formData.append('description', missionData.description);

      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('image', {
          uri: imageUri,
          name: filename,
          type,
        } as any);

        console.log('📷 Image ajoutée:', filename);
      }

      console.log('🌐 Envoi vers: /missions');

      const response = await api.post('/missions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Mission créée:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('❌ Erreur création mission:', error.response?.data || error.message);
      throw error;
    }
  }

  async getAllMissions(): Promise<Mission[]> {
    const response = await api.get('/missions');
    return response.data;
  }

  async getMissionById(id: string): Promise<Mission> {
    const response = await api.get(`/missions/${id}`);
    return response.data;
  }

  async getMyMissions(): Promise<Mission[]> {
    const response = await api.get('/missions/organizer/my-missions');
    return response.data;
  }
  async getMyFinishedMissions(): Promise<Mission[]> {
    const response = await api.get('/missions/organizer/my-finished-missions');
    return response.data;
  }

  async updateMission(id: string, missionData: Partial<CreateMissionDto>, imageUri?: string): Promise<Mission> {
    const formData = new FormData();
    if (missionData.title) formData.append('title', missionData.title);
    if (missionData.category) formData.append('category', missionData.category);
    if (missionData.date) formData.append('date', missionData.date);
    if (missionData.time) formData.append('time', missionData.time);
    if (missionData.duration) formData.append('duration', missionData.duration);
    if (missionData.location) formData.append('location', missionData.location);
    if (missionData.latitude !== undefined) formData.append('latitude', missionData.latitude.toString());
    if (missionData.longitude !== undefined) formData.append('longitude', missionData.longitude.toString());
    if (missionData.maxParticipants) formData.append('maxParticipants', missionData.maxParticipants);
    if (missionData.description) formData.append('description', missionData.description);

    if (imageUri) {
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      } as any);
    }

    const response = await api.put(`/missions/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async deleteMission(id: string): Promise<void> {
    await api.delete(`/missions/${id}`);
  }

  async getMissionsNearby(latitude: number, longitude: number, radius: number): Promise<Mission[]> {
    const response = await api.get('/missions', {
      params: { latitude, longitude, radius },
    });
    return response.data;
  }
}

export default new MissionService();