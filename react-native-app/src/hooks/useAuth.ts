// hooks/useAuth.ts
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { loginThunk, registerThunk, logoutThunk } from '../redux/thunks/authThunks'
import {
  getProfileThunk,
  updateProfileThunk,
  uploadAvatarThunk,
} from '../redux/thunks/profileThunks'
import { clearError, setUser } from '../redux/slices/authSlice'
import { LoginCredentials, RegisterData } from '../services/auth.service'
import { UpdateProfileData } from '../api/profile'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  )

  // ================= AUTH =================

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await dispatch(loginThunk(credentials))
      if (loginThunk.rejected.match(result)) {
        throw new Error(result.payload as string)
      }
      return result.payload
    },
    [dispatch]
  )

  const register = useCallback(
    async (data: RegisterData) => {
      const result = await dispatch(registerThunk(data))
      if (registerThunk.rejected.match(result)) {
        throw new Error(result.payload as string)
      }
      return result.payload
    },
    [dispatch]
  )

  const logout = useCallback(async () => {
    const result = await dispatch(logoutThunk())
    if (logoutThunk.rejected.match(result)) {
      throw new Error(result.payload as string)
    }
  }, [dispatch])

  // ================= PROFILE (AJOUT) =================

  const getProfile = useCallback(async () => {
    const result = await dispatch(getProfileThunk())
    if (getProfileThunk.rejected.match(result)) {
      throw new Error(result.payload as string)
    }
    return result.payload
  }, [dispatch])

  const updateProfile = useCallback(
    async (data: UpdateProfileData) => {
      const result = await dispatch(updateProfileThunk(data))
      if (updateProfileThunk.rejected.match(result)) {
        throw new Error(result.payload as string)
      }
      return result.payload
    },
    [dispatch]
  )

  const uploadAvatar = useCallback(
    async (uri: string) => {
      const result = await dispatch(uploadAvatarThunk(uri))
      if (uploadAvatarThunk.rejected.match(result)) {
        throw new Error(result.payload as string)
      }
      return result.payload
    },
    [dispatch]
  )

  const updateUser = useCallback(
    (updatedUser: any) => {
      dispatch(setUser(updatedUser))
    },
    [dispatch]
  )

  // ================= UTILS =================

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    getProfile,    
    updateProfile,  
    uploadAvatar,   
    updateUser,     
    clearError: clearAuthError,
  }
}
