// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';

// Import des reducers
import authReducer from './slices/authSlice';
import missionsReducer from './slices/missionsSlice';
import missionReducer from './slices/missionsSlice';              // pour création / modification
import missionParticipantReducer from './slices/missionParticipantSlice'; // ← celui qui manquait !

export const store = configureStore({
  reducer: {
    auth:               authReducer,
    missions:           missionsReducer,         // liste des missions, recherche, etc.  // détail d'une mission
    mission:            missionReducer,          // création / édition de mission
    missionParticipant: missionParticipantReducer, // inscription, désinscription, mes inscriptions
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer les actions et paths non-sérialisables (dates, fonctions, etc.)
        ignoredActions: [
          'missions/fetchMissions/fulfilled',
          'missionDetail/fetchMissionById/fulfilled',
          'mission/create/fulfilled',
          'mission/create/pending',
          'mission/update/fulfilled',           // si tu en as d'autres, ajoute-les
          'missionParticipant/register/fulfilled',
          'missionParticipant/unregister/fulfilled',
          'missionParticipant/check/fulfilled',
        ],
        ignoredPaths: [
          'missions.data',
          'missionDetail.mission',
          'mission.myMissions',
          'mission.currentMission',
          'missionParticipant.myRegistrations',   // ← souvent utile ici aussi
        ],
      },
    }),

  // Optionnel : activer Redux DevTools en développement (activé par défaut déjà)
  devTools: process.env.NODE_ENV !== 'production',
});

// Types inférés automatiquement à partir du store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;