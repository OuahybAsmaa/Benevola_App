import { createAsyncThunk } from '@reduxjs/toolkit';
import missionService, { CreateMissionDto } from '../../services/mission.service';

export const createMissionThunk = createAsyncThunk(
  'mission/create',
  async ({ missionData, imageUri }: { missionData: CreateMissionDto; imageUri?: string }, { rejectWithValue }) => {
    try {
      const response = await missionService.createMission(missionData, imageUri);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création de la mission');
    }
  }
);

export const getAllMissionsThunk = createAsyncThunk(
  'mission/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await missionService.getAllMissions();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des missions');
    }
  }
);

export const getMissionByIdThunk = createAsyncThunk(
  'mission/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await missionService.getMissionById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération de la mission');
    }
  }
);

export const getMyMissionsThunk = createAsyncThunk(
  'mission/getMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await missionService.getMyMissions();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération de vos missions');
    }
  }
);

export const updateMissionThunk = createAsyncThunk(
  'mission/update',
  async (
    { id, missionData, imageUri }: { id: string; missionData: Partial<CreateMissionDto>; imageUri?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await missionService.updateMission(id, missionData, imageUri);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour de la mission');
    }
  }
);

export const deleteMissionThunk = createAsyncThunk(
  'mission/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await missionService.deleteMission(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression de la mission');
    }
  }
);

export const getMissionsNearbyThunk = createAsyncThunk(
  'mission/getNearby',
  async ({ latitude, longitude, radius }: { latitude: number; longitude: number; radius: number }, { rejectWithValue }) => {
    try {
      const response = await missionService.getMissionsNearby(latitude, longitude, radius);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la recherche des missions');
    }
  }
);