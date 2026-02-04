// src/api/messages.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store'
import API_BASE_URL from '../config/baseUrl';

const messagesAPI = axios.create({
  baseURL: `${API_BASE_URL}/messages`,
});

// Intercepteur pour ajouter le token
messagesAPI.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  missionId?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  receiver?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
}

export interface Conversation {
  userId: string;
  userName: string;
  userAvatar?: string;
  missionId?: string;
  missionTitle?: string;
  lastMessage: Message;
  unreadCount: number;
}

// ✅ CORRECTION: Ajouter le type de retour
// Récupérer une conversation
export const getConversation = async (
  otherUserId: string,
  missionId?: string,
  page: number = 1,
  limit: number = 50,
): Promise<{ messages: Message[]; total: number; hasMore: boolean }> => {
  const params: any = { page, limit };
  if (missionId) params.missionId = missionId;

  // ✅ CORRECTION: Utiliser la bonne syntaxe pour axios.get
  const response = await messagesAPI.get(`/conversation/${otherUserId}`, { params });
  return response.data;
};

// ✅ CORRECTION: Ajouter le type de retour
// Récupérer toutes les conversations
export const getUserConversations = async (): Promise<Conversation[]> => {
  const response = await messagesAPI.get('/conversations');
  return response.data;
};

// ✅ CORRECTION: Ajouter le type de retour
// Envoyer un message (HTTP fallback)
export const sendMessage = async (
  receiverId: string,
  content: string,
  missionId?: string,
): Promise<Message> => {
  const response = await messagesAPI.post('/', {
    receiverId,
    content,
    missionId,
  });
  return response.data;
};

// ✅ CORRECTION: Ajouter le type de retour
// Marquer comme lu
export const markAsRead = async (
  senderId: string,
  missionId?: string,
): Promise<void> => {
  const params: any = {};
  if (missionId) params.missionId = missionId;

  // ✅ CORRECTION: Utiliser la bonne syntaxe pour axios.post
  await messagesAPI.post(`/mark-read/${senderId}`, null, { params });
};

// ✅ CORRECTION: Ajouter le type de retour
// Compter les messages non lus
export const getUnreadCount = async (): Promise<number> => {
  const response = await messagesAPI.get('/unread-count');
  return response.data.count;
};

export default messagesAPI;