import * as SecureStore from 'expo-secure-store';
import { createAsyncThunk } from '@reduxjs/toolkit'
import authService, { LoginCredentials, RegisterData, User } from '../../services/auth.service'

export const checkAuthThunk = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync("access_token")

      if (!token) {
        return null
      }
      const user = await authService.getCurrentUser()
      return user
    } catch (error) {
      return null 
    }
  }
)

export const loginThunk = createAsyncThunk<User, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await authService.login(credentials)
      return user
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur de connexion'
      return rejectWithValue(message)
    }
  }
)

export const registerThunk = createAsyncThunk<User, RegisterData, { rejectValue: string }>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const user = await authService.register(data)
      return user
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur d'inscription"
      return rejectWithValue(message)
    }
  }
)

export const logoutThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur de déconnexion'
      return rejectWithValue(message)
    }
  }
)