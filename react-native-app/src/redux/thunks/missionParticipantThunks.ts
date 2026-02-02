// src/redux/thunks/missionParticipantThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import missionParticipantService from '../../services/mission-participant.service';

export const registerToMissionThunk = createAsyncThunk(
  'missionParticipant/register',
  async (missionId: string, { rejectWithValue }) => {
    try {
      const response = await missionParticipantService.registerToMission(missionId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'inscription à la mission'
      );
    }
  }
);

export const unregisterFromMissionThunk = createAsyncThunk(
  'missionParticipant/unregister',
  async (missionId: string, { rejectWithValue }) => {
    try {
      await missionParticipantService.unregisterFromMission(missionId);
      return missionId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la désinscription'
      );
    }
  }
);

export const checkRegistrationThunk = createAsyncThunk(
  'missionParticipant/checkRegistration',
  async (missionId: string, { rejectWithValue }) => {
    try {
      const response = await missionParticipantService.checkRegistration(missionId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la vérification de l\'inscription'
      );
    }
  }
);

export const getMyRegisteredMissionsThunk = createAsyncThunk(
  'missionParticipant/getMyRegisteredMissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await missionParticipantService.getMyRegisteredMissions();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération de vos inscriptions'
      );
    }
  }
);