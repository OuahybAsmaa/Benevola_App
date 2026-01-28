import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const loginAPI = axios.create({
    baseURL: "http://192.168.0.106:3000", 
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