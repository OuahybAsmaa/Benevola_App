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
  async registerToMission(missionId: string): Promise<MissionParticipant> {
    try {
      const response = await api.post(`/mission-participants/${missionId}/register`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async unregisterFromMission(missionId: string): Promise<void> {
    try {
      await api.delete(`/mission-participants/${missionId}/unregister`);
    } catch (error: any) {
      throw error;
    }
  }

  async getParticipants(missionId: string): Promise<MissionParticipant[]> {
    try {
      const response = await api.get(`/mission-participants/${missionId}/participants`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async getMyRegisteredMissions(): Promise<MissionParticipant[]> {
    try {
      const response = await api.get('/mission-participants/my-missions');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async checkRegistration(missionId: string): Promise<RegistrationCheckResponse> {
    try {
      const response = await api.get(`/mission-participants/${missionId}/check-registration`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new MissionParticipantService();