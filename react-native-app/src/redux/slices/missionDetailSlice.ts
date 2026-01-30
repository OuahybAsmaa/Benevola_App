import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Mission } from '../../services/mission.service'
import {
  fetchMissionByIdThunk,
  registerToMissionThunk,
  unregisterFromMissionThunk,
} from '../thunks/missionDetailThunks'

interface MissionDetailState {
  mission: Mission | null
  isLoading: boolean
  error: string | null
  isRegistered: boolean
  isFavorite: boolean
  isRegistering: boolean
}

const initialState: MissionDetailState = {
  mission: null,
  isLoading: false,
  error: null,
  isRegistered: false,
  isFavorite: false,
  isRegistering: false,
}

const missionDetailSlice = createSlice({
  name: 'missionDetail',
  initialState,
  reducers: {
    clearMission: (state) => {
      state.mission = null
      state.error = null
      state.isRegistered = false
      state.isFavorite = false
    },
    toggleFavorite: (state) => {
      state.isFavorite = !state.isFavorite
    },
    setIsRegistered: (state, action: PayloadAction<boolean>) => {
      state.isRegistered = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch mission by ID
    builder
      .addCase(fetchMissionByIdThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMissionByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.mission = action.payload
        state.error = null
      })
      .addCase(fetchMissionByIdThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Register to mission
    builder
      .addCase(registerToMissionThunk.pending, (state) => {
        state.isRegistering = true
        state.error = null
      })
      .addCase(registerToMissionThunk.fulfilled, (state) => {
        state.isRegistering = false
        state.isRegistered = true
        if (state.mission) {
          state.mission.participants += 1
        }
      })
      .addCase(registerToMissionThunk.rejected, (state, action) => {
        state.isRegistering = false
        state.error = action.payload as string
      })

    // Unregister from mission
    builder
      .addCase(unregisterFromMissionThunk.pending, (state) => {
        state.isRegistering = true
        state.error = null
      })
      .addCase(unregisterFromMissionThunk.fulfilled, (state) => {
        state.isRegistering = false
        state.isRegistered = false
        if (state.mission && state.mission.participants > 0) {
          state.mission.participants -= 1
        }
      })
      .addCase(unregisterFromMissionThunk.rejected, (state, action) => {
        state.isRegistering = false
        state.error = action.payload as string
      })
  },
})

export const { clearMission, toggleFavorite, setIsRegistered } = missionDetailSlice.actions
export default missionDetailSlice.reducer