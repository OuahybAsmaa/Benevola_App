// src/hooks/useMissionParticipant.ts
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import {
  registerToMissionThunk,
  unregisterFromMissionThunk,
  checkRegistrationThunk,
  getMyRegisteredMissionsThunk,
} from '../redux/thunks/missionParticipantThunks';
import { clearError, resetRegistrationStatus } from '../redux/slices/missionParticipantSlice';

export const useMissionParticipant = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    myRegistrations,
    isRegistered,
    participantCount,
    loading,
    error,
  } = useSelector((state: RootState) => state.missionParticipant);

  const registerToMission = (missionId: string) => {
    return dispatch(registerToMissionThunk(missionId));
  };

  const unregisterFromMission = (missionId: string) => {
    return dispatch(unregisterFromMissionThunk(missionId));
  };

  const checkRegistration = (missionId: string) => {
    return dispatch(checkRegistrationThunk(missionId));
  };

  const getMyRegisteredMissions = () => {
    return dispatch(getMyRegisteredMissionsThunk());
  };

  const clearParticipantError = () => {
    dispatch(clearError());
  };

  const resetStatus = () => {
    dispatch(resetRegistrationStatus());
  };

  return {
    myRegistrations,
    isRegistered,
    participantCount,
    loading,
    error,
    registerToMission,
    unregisterFromMission,
    checkRegistration,
    getMyRegisteredMissions,
    clearError: clearParticipantError,
    resetStatus,
  };
};