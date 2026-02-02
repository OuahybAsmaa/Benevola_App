// src/services/mission-participant.service.ts
import api from '../api/loginAPI';

export interface MissionParticipant {
  id: string;
  missionId: string;
  userId: string;
  registeredAt: string;
  status: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  mission?: any;
}

export interface RegistrationCheckResponse {
  isRegistered: boolean;
  participantCount: number;
}

class MissionParticipantService {
  // S'inscrire à une mission
  async registerToMission(missionId: string): Promise<MissionParticipant> {
    try {
      const response = await api.post(`/mission-participants/${missionId}/register`);
      console.log('✅ Inscription réussie:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur inscription:', error.response?.data || error.message);
      throw error;
    }
  }

  // Se désinscrire d'une mission
  async unregisterFromMission(missionId: string): Promise<void> {
    try {
      await api.delete(`/mission-participants/${missionId}/unregister`);
      console.log('✅ Désinscription réussie');
    } catch (error: any) {
      console.error('❌ Erreur désinscription:', error.response?.data || error.message);
      throw error;
    }
  }

  // Récupérer les participants d'une mission
  async getParticipants(missionId: string): Promise<MissionParticipant[]> {
    try {
      const response = await api.get(`/mission-participants/${missionId}/participants`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur récupération participants:', error.response?.data || error.message);
      throw error;
    }
  }

  // Récupérer mes missions inscrites
  async getMyRegisteredMissions(): Promise<MissionParticipant[]> {
    try {
      const response = await api.get('/mission-participants/my-missions');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur récupération mes missions:', error.response?.data || error.message);
      throw error;
    }
  }

  // Vérifier si je suis inscrit
  async checkRegistration(missionId: string): Promise<RegistrationCheckResponse> {
    try {
      const response = await api.get(`/mission-participants/${missionId}/check-registration`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur vérification inscription:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new MissionParticipantService();