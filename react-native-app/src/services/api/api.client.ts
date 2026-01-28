// src/services/api/api.client.ts
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const api = axios.create({
  baseURL: 'http://192.168.0.105:3000', 
  timeout: 12000,
})

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Tentative de refresh automatique quand on reçoit 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        await SecureStore.setItemAsync('access_token', data.access_token);

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh échoué → déconnexion forcée
        console.warn('Refresh token failed, forcing logout');

        // Supprime les clés une par une (await pour éviter les race conditions)
        try {
          await SecureStore.deleteItemAsync('access_token');
        } catch (e) {}
        try {
          await SecureStore.deleteItemAsync('refresh_token');
        } catch (e) {}

        // Optionnel : ici tu peux déclencher une redirection globale vers login
        // Exemple : utiliser un EventEmitter ou un contexte global pour notifier l'app
        // (pas implémenté ici pour garder simple)
      }
    }

    return Promise.reject(error);
  }
);

export default api