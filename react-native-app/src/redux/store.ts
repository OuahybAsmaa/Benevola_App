// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import missionsReducer from './slices/missionsSlice';
import missionReducer from './slices/missionsSlice';              
import missionParticipantReducer from './slices/missionParticipantSlice'; 
export const store = configureStore({
  reducer: {
    auth:               authReducer,
    missions:           missionsReducer,         
    mission:            missionReducer,          
    missionParticipant: missionParticipantReducer, 
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        
        ignoredActions: [
          'missions/fetchMissions/fulfilled',
          'missionDetail/fetchMissionById/fulfilled',
          'mission/create/fulfilled',
          'mission/create/pending',
          'mission/update/fulfilled',           
          'missionParticipant/register/fulfilled',
          'missionParticipant/unregister/fulfilled',
          'missionParticipant/check/fulfilled',
        ],
        ignoredPaths: [
          'missions.data',
          'missionDetail.mission',
          'mission.myMissions',
          'mission.currentMission',
          'missionParticipant.myRegistrations',   
        ],
      },
    }),

 
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;