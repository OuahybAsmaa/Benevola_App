import AsyncStorage from "@react-native-async-storage/async-storage"
import { createAsyncThunk } from '@reduxjs/toolkit'
import authService, { LoginCredentials, RegisterData, User } from '../../services/api/auth.service'

export const checkAuthThunk = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token")

      // 🔥 PAS DE TOKEN → PAS CONNECTÉ
      if (!token) {
        return null
      }

      // Token existant → vérifier l'utilisateur
      const user = await authService.getCurrentUser()
      return user
    } catch (error) {
      return null // 🔥 très important
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