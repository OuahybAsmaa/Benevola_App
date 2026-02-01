import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import missionsReducer from './slices/missionsSlice'
import missionDetailReducer from './slices/missionDetailSlice'
import missionReducer from './slices/missionsSlice' // AJOUT

export const store = configureStore({
  reducer: {
    auth: authReducer,
    missions: missionsReducer,
    missionDetail: missionDetailReducer,
    mission: missionReducer, // AJOUT - pour la création/modification
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'missions/fetchMissions/fulfilled', 
          'missionDetail/fetchMissionById/fulfilled',
          'mission/create/fulfilled', // AJOUT
          'mission/create/pending',   // AJOUT
        ],
        ignoredPaths: [
          'missions.data', 
          'missionDetail.mission',
          'mission.myMissions', // AJOUT
          'mission.currentMission', // AJOUT
        ],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch