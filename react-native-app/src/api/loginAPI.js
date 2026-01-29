import axios from "axios";
import * as SecureStore from 'expo-secure-store';

import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseURL = () => {
  if (__DEV__) {
    // En développement avec Expo
    const { manifest } = Constants;
    const api = manifest?.debuggerHost?.split(':').shift();
    return `http://${api}:3000`;
  }
  // En production
  return 'https://votre-api-production.com';
};

const loginAPI = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

//creer un intercepteur
loginAPI.interceptors.request.use(
    async(config)=>{
        const token =await SecureStore.getItemAsync('access_token');
        if(token)
        {
            config.headers.Authorization=`Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

export default loginAPI;