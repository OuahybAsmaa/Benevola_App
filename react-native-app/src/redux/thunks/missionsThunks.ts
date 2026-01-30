import { createAsyncThunk } from '@reduxjs/toolkit'
import missionService, { Mission } from '../../services/mission.service'

interface FetchMissionsParams {
  category?: string
  city?: string
}

export const fetchMissionsThunk = createAsyncThunk<Mission[], FetchMissionsParams, { rejectValue: string }>(
  'missions/fetchMissions',
  async (params, { rejectWithValue }) => {
    try {
      const missions = await missionService.getMissions(params)
      return missions
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur de chargement des missions'
      return rejectWithValue(message)
    }
  }
)