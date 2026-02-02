import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import {
  createMissionThunk,
  getAllMissionsThunk,
  getMissionByIdThunk,
  getMyMissionsThunk,
  updateMissionThunk,
  deleteMissionThunk,
  getMissionsNearbyThunk,
  getMyFinishedMissionsThunk, // 👈 AJOUTER
} from '../redux/thunks/missionsThunks';
import { resetCreateSuccess, clearError } from '../redux/slices/missionsSlice';
import { CreateMissionDto } from '../services/mission.service';

export const useMission = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    missions,
    myMissions,
    finishedMissions, // 👈 AJOUTER
    currentMission,
    loading,
    error,
    createSuccess,
  } = useSelector((state: RootState) => state.mission);

  const createMission = (missionData: CreateMissionDto, imageUri?: string) => {
    return dispatch(createMissionThunk({ missionData, imageUri }));
  };

  const getAllMissions = () => {
    return dispatch(getAllMissionsThunk());
  };

  const getMissionById = (id: string) => {
    return dispatch(getMissionByIdThunk(id));
  };

  const getMyMissions = () => {
    return dispatch(getMyMissionsThunk());
  };

  // 👈 AJOUTER
  const getMyFinishedMissions = () => {
    return dispatch(getMyFinishedMissionsThunk());
  };

  const updateMission = (id: string, missionData: Partial<CreateMissionDto>, imageUri?: string) => {
    return dispatch(updateMissionThunk({ id, missionData, imageUri }));
  };

  const deleteMission = (id: string) => {
    return dispatch(deleteMissionThunk(id));
  };

  const getMissionsNearby = (latitude: number, longitude: number, radius: number) => {
    return dispatch(getMissionsNearbyThunk({ latitude, longitude, radius }));
  };

  const resetSuccess = () => {
    dispatch(resetCreateSuccess());
  };

  const clearMissionError = () => {
    dispatch(clearError());
  };

  return {
    missions,
    myMissions,
    finishedMissions, // 👈 AJOUTER
    currentMission,
    loading,
    error,
    createSuccess,
    createMission,
    getAllMissions,
    getMissionById,
    getMyMissions,
    getMyFinishedMissions, // 👈 AJOUTER
    updateMission,
    deleteMission,
    getMissionsNearby,
    resetSuccess,
    clearMissionError,
  };
};