import { createAsyncThunk } from '@reduxjs/toolkit'
import missionService, { Mission } from '../../services/mission.service'

export const fetchMissionByIdThunk = createAsyncThunk<Mission | null, string, { rejectValue: string }>(
  'missionDetail/fetchMissionById',
  async (missionId, { rejectWithValue }) => {
    try {
      const mission = await missionService.getMissionById(missionId)
      return mission
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur de chargement de la mission'
      return rejectWithValue(message)
    }
  }
)

interface RegisterParams {
  missionId: string
  userId: string
}

export const registerToMissionThunk = createAsyncThunk<boolean, RegisterParams, { rejectValue: string }>(
  'missionDetail/register',
  async ({ missionId, userId }, { rejectWithValue }) => {
    try {
      const success = await missionService.registerToMission(missionId, userId)
      if (!success) {
        throw new Error('La mission est complète')
      }
      return success
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de l'inscription"
      return rejectWithValue(message)
    }
  }
)

export const unregisterFromMissionThunk = createAsyncThunk<boolean, RegisterParams, { rejectValue: string }>(
  'missionDetail/unregister',
  async ({ missionId, userId }, { rejectWithValue }) => {
    try {
      const success = await missionService.unregisterFromMission(missionId, userId)
      return success
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la désinscription'
      return rejectWithValue(message)
    }
  }
)