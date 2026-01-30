// src/services/api/auth.service.ts
import api from '../api/loginAPI'           // ← le client axios avec interceptors
import * as SecureStore from 'expo-secure-store'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'benevole' | 'organisation'
  avatar?: string
  phone?: string
}

export interface LoginCredentials {
  email: string
  password: string
  // role?: 'benevole' | 'organisation'   ← on peut le retirer si backend ne l'exige plus
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  role: 'benevole' | 'organisation'
}

class AuthService {
  private readonly USER_KEY = 'user'

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const { data } = await api.post('/auth/login', credentials)

      const { access_token, refresh_token, user } = data

      await SecureStore.setItemAsync('access_token', access_token)
      if (refresh_token) {
        await SecureStore.setItemAsync('refresh_token', refresh_token)
      }

      await this.storeUser(user)

      return user
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Échec de la connexion'
      )
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const { data: response } = await api.post('/auth/register', data)

      const { access_token, refresh_token, user } = response

      await SecureStore.setItemAsync('access_token', access_token)
      if (refresh_token) {
        await SecureStore.setItemAsync('refresh_token', refresh_token)
      }

      await this.storeUser(user)

      return user
    } catch (error: any) {
    console.error("Erreur complète register:", error);
    console.log("Status:", error.response?.status);
    console.log("Response data:", error.response?.data);
    console.log("Message serveur:", error.response?.data?.message);

    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Échec de l'inscription (vérifie la console)"
    );
  }
  }

  async logout(): Promise<void> {
    try {
      // Optionnel : appeler le endpoint logout si ton backend le gère
      await api.post('/auth/logout').catch(() => {}) // on ignore l'erreur

      await SecureStore.deleteItemAsync('access_token')
      await SecureStore.deleteItemAsync('refresh_token')
      await SecureStore.deleteItemAsync(this.USER_KEY)
    } catch (error) {
      console.error('Erreur lors du logout local:', error)
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await SecureStore.getItemAsync(this.USER_KEY)
      if (!userJson) return null
      return JSON.parse(userJson)
    } catch (error) {
      console.error('Erreur lecture user:', error)
      return null
    }
  }

  private async storeUser(user: User): Promise<void> {
    await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(user))
  }

  // Utile si tu veux forcer une vérification du token (ex: appel /auth/me)
  async validateTokenAndGetUser(): Promise<User | null> {
    try {
      const { data } = await api.get('/auth/me')
      await this.storeUser(data) // mise à jour au cas où
      return data
    } catch (error) {
      await this.logout() // token invalide → on déconnecte
      return null
    }
  }
}

export default new AuthService()