import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Mission } from '../../services/mission.service'
import { fetchMissionsThunk } from '../thunks/missionsThunks'

interface MissionsState {
  data: Mission[]
  isLoading: boolean
  error: string | null
  filters: {
    category?: string
    city?: string
  }
}

const initialState: MissionsState = {
  data: [],
  isLoading: false,
  error: null,
  filters: {},
}

const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ category?: string; city?: string }>) => {
      state.filters = action.payload
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissionsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMissionsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchMissionsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setFilters, clearFilters, clearError } = missionsSlice.actions
export default missionsSlice.reducer