import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Mission } from '../../services/mission.service';
import {
  createMissionThunk,
  getAllMissionsThunk,
  getMissionByIdThunk,
  getMyMissionsThunk,
  updateMissionThunk,
  deleteMissionThunk,
  getMissionsNearbyThunk,
  getMyFinishedMissionsThunk, // 👈 AJOUTER
} from '../thunks/missionsThunks';

interface MissionState {
  missions: Mission[];
  myMissions: Mission[];
  finishedMissions: Mission[]; // 👈 AJOUTER
  currentMission: Mission | null;
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
}

const initialState: MissionState = {
  missions: [],
  myMissions: [],
  finishedMissions: [], // 👈 AJOUTER
  currentMission: null,
  loading: false,
  error: null,
  createSuccess: false,
};

const missionSlice = createSlice({
  name: 'mission',
  initialState,
  reducers: {
    resetCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Mission
    builder
      .addCase(createMissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createMissionThunk.fulfilled, (state, action: PayloadAction<Mission>) => {
        state.loading = false;
        state.myMissions.unshift(action.payload);
        state.createSuccess = true;
      })
      .addCase(createMissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.createSuccess = false;
      });

    // Get All Missions
    builder
      .addCase(getAllMissionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMissionsThunk.fulfilled, (state, action: PayloadAction<Mission[]>) => {
        state.loading = false;
        state.missions = action.payload;
      })
      .addCase(getAllMissionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Mission By ID
    builder
      .addCase(getMissionByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMissionByIdThunk.fulfilled, (state, action: PayloadAction<Mission>) => {
        state.loading = false;
        state.currentMission = action.payload;
      })
      .addCase(getMissionByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get My Missions
    builder
      .addCase(getMyMissionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyMissionsThunk.fulfilled, (state, action: PayloadAction<Mission[]>) => {
        state.loading = false;
        state.myMissions = action.payload;
      })
      .addCase(getMyMissionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Mission
    builder
      .addCase(updateMissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMissionThunk.fulfilled, (state, action: PayloadAction<Mission>) => {
        state.loading = false;
        const index = state.myMissions.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.myMissions[index] = action.payload;
        }
      })
      .addCase(updateMissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Mission
    builder
      .addCase(deleteMissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMissionThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.myMissions = state.myMissions.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Missions Nearby
    builder
      .addCase(getMissionsNearbyThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMissionsNearbyThunk.fulfilled, (state, action: PayloadAction<Mission[]>) => {
        state.loading = false;
        state.missions = action.payload;
      })
      .addCase(getMissionsNearbyThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 👈 AJOUTER — Get My Finished Missions
    builder
      .addCase(getMyFinishedMissionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyFinishedMissionsThunk.fulfilled, (state, action: PayloadAction<Mission[]>) => {
        state.loading = false;
        state.finishedMissions = action.payload;
      })
      .addCase(getMyFinishedMissionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCreateSuccess, clearError } = missionSlice.actions;
export default missionSlice.reducer;