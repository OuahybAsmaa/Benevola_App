// src/config/socket.config.ts
import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store'
import API_BASE_URL from './baseUrl';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // ✅ CORRECTION: Ajouter le type de retour Socket
  // Se connecter au serveur WebSocket
  async connect(): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    try {
      // Récupérer le token d'authentification
      const token = await SecureStore.getItemAsync('access_token')
      
      if (!token) {
        throw new Error('Pas de token d\'authentification');
      }

      // Créer la connexion socket
      this.socket = io(API_BASE_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      // Événements de connexion
      this.socket.on('connect', () => {
        console.log('✅ Socket connecté');
        this.reconnectAttempts = 0;
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Socket déconnecté:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Erreur de connexion socket:', error);
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('Max reconnect attempts reached');
          this.disconnect();
        }
      });

      return this.socket;
    } catch (error) {
      console.error('Erreur lors de la connexion socket:', error);
      throw error;
    }
  }

  // Déconnecter
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Obtenir l'instance socket
  getSocket(): Socket | null {
    return this.socket;
  }

  // Vérifier si connecté
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Envoyer un message
  sendMessage(receiverId: string, content: string, missionId?: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket non connecté');
    }

    this.socket.emit('send_message', {
      receiverId,
      content,
      missionId,
    });
  }

  // Marquer comme lu
  markAsRead(senderId: string, missionId?: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket non connecté');
    }

    this.socket.emit('mark_as_read', {
      senderId,
      missionId,
    });
  }

  // Notifier que l'utilisateur tape
  sendTyping(receiverId: string, missionId?: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit('typing', {
      receiverId,
      missionId,
    });
  }

  // Notifier que l'utilisateur arrête de taper
  sendStopTyping(receiverId: string, missionId?: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit('stop_typing', {
      receiverId,
      missionId,
    });
  }

  // Écouter les nouveaux messages
  onNewMessage(callback: (message: any) => void): void {
    if (!this.socket) return;
    this.socket.on('new_message', callback);
  }

  // Écouter les confirmations d'envoi
  onMessageSent(callback: (message: any) => void): void {
    if (!this.socket) return;
    this.socket.on('message_sent', callback);
  }

  // Écouter quand quelqu'un tape
  onUserTyping(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('user_typing', callback);
  }

  // Écouter quand quelqu'un arrête de taper
  onUserStopTyping(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('user_stop_typing', callback);
  }

  // Retirer les listeners
  removeAllListeners(): void {
    if (!this.socket) return;
    this.socket.removeAllListeners();
  }
}

export default new SocketService();