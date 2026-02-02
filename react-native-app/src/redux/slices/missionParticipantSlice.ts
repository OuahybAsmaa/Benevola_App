// src/redux/slices/missionParticipantSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MissionParticipant } from '../../services/mission-participant.service';
import {
  registerToMissionThunk,
  unregisterFromMissionThunk,
  checkRegistrationThunk,
  getMyRegisteredMissionsThunk,
} from '../thunks/missionParticipantThunks';

interface MissionParticipantState {
  myRegistrations: MissionParticipant[];
  isRegistered: boolean;
  participantCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: MissionParticipantState = {
  myRegistrations: [],
  isRegistered: false,
  participantCount: 0,
  loading: false,
  error: null,
};

const missionParticipantSlice = createSlice({
  name: 'missionParticipant',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetRegistrationStatus: (state) => {
      state.isRegistered = false;
      state.participantCount = 0;
    },
  },
  extraReducers: (builder) => {
    // Register to Mission
    builder
      .addCase(registerToMissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerToMissionThunk.fulfilled, (state, action: PayloadAction<MissionParticipant>) => {
        state.loading = false;
        state.isRegistered = true;
        state.participantCount += 1;
      })
      .addCase(registerToMissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Unregister from Mission
    builder
      .addCase(unregisterFromMissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unregisterFromMissionThunk.fulfilled, (state) => {
        state.loading = false;
        state.isRegistered = false;
        state.participantCount = Math.max(0, state.participantCount - 1);
      })
      .addCase(unregisterFromMissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Check Registration
    builder
      .addCase(checkRegistrationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkRegistrationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isRegistered = action.payload.isRegistered;
        state.participantCount = action.payload.participantCount;
      })
      .addCase(checkRegistrationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get My Registered Missions
    builder
      .addCase(getMyRegisteredMissionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyRegisteredMissionsThunk.fulfilled, (state, action: PayloadAction<MissionParticipant[]>) => {
        state.loading = false;
        state.myRegistrations = action.payload;
      })
      .addCase(getMyRegisteredMissionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetRegistrationStatus } = missionParticipantSlice.actions;
export default missionParticipantSlice.reducer;