import { createAsyncThunk } from '@reduxjs/toolkit'
import profileService from '../../services/profile.service'
import { UpdateProfileData } from '../../api/profile'
import { User } from '../../services/auth.service'

export const updateProfileThunk = createAsyncThunk<
  User,
  UpdateProfileData,
  { rejectValue: string }
>(
  'profile/update',
  async (data, { rejectWithValue }) => {
    try {
      const updatedUser = await profileService.updateProfile(data)
      return updatedUser
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur mise à jour profil'
      return rejectWithValue(message)
    }
  }
)

export const uploadAvatarThunk = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>(
  'profile/uploadAvatar',
  async (uri, { rejectWithValue }) => {
    try {
      const updatedUser = await profileService.uploadAvatar(uri)
      return updatedUser
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur upload avatar'
      return rejectWithValue(message)
    }
  }
)

export const getProfileThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'profile/get',
  async (_, { rejectWithValue }) => {
    try {
      const user = await profileService.getProfile()
      return user
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur récupération profil'
      return rejectWithValue(message)
    }
  }
)
