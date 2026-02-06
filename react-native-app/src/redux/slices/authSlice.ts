import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../services/auth.service'
import { loginThunk, registerThunk, logoutThunk, checkAuthThunk } from '../thunks/authThunks'
import { updateProfileThunk, uploadAvatarThunk, getProfileThunk } from '../thunks/profileThunks' 

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
  },
  extraReducers: (builder) => {
    // Check Auth
    builder
      .addCase(checkAuthThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isInitialized = true
        state.user = action.payload
        state.isAuthenticated = !!action.payload
        state.error = null
      })
      .addCase(checkAuthThunk.rejected, (state) => {
        state.isLoading = false
        state.isInitialized = true
        state.user = null
        state.isAuthenticated = false
      })

    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })


    // Get Profile
    builder
      .addCase(getProfileThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update Profile
    builder
      .addCase(updateProfileThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Upload Avatar
    builder
      .addCase(uploadAvatarThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(uploadAvatarThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(uploadAvatarThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer