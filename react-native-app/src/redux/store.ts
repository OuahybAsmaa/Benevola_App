import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import missionsReducer from './slices/missionsSlice'
import missionDetailReducer from './slices/missionDetailSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    missions: missionsReducer,
    missionDetail: missionDetailReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['missions/fetchMissions/fulfilled', 'missionDetail/fetchMissionById/fulfilled'],
        ignoredPaths: ['missions.data', 'missionDetail.mission'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
