// hooks/useAuth.ts
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { loginThunk, registerThunk, logoutThunk } from '../redux/thunks/authThunks'
import { clearError } from '../redux/slices/authSlice'
import { LoginCredentials, RegisterData } from '../services/api/auth.service'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth)

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
    clearError: clearAuthError,
  }
}