// src/config/socket.config.ts
import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store'
import API_BASE_URL from './baseUrl';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async connect(): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    try {
      const token = await SecureStore.getItemAsync('access_token')
      
      if (!token) {
        throw new Error('Pas de token d\'authentification');
      }

      this.socket = io(API_BASE_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.socket.on('connect', () => {
        this.reconnectAttempts = 0;
      });

      this.socket.on('disconnect', (reason) => {
      });

      this.socket.on('connect_error', (error) => {
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.disconnect();
        }
      });

      return this.socket;
    } catch (error) {
      throw error;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

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

  markAsRead(senderId: string, missionId?: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket non connecté');
    }

    this.socket.emit('mark_as_read', {
      senderId,
      missionId,
    });
  }

  sendTyping(receiverId: string, missionId?: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit('typing', {
      receiverId,
      missionId,
    });
  }

  sendStopTyping(receiverId: string, missionId?: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit('stop_typing', {
      receiverId,
      missionId,
    });
  }

  onNewMessage(callback: (message: any) => void): void {
    if (!this.socket) return;
    this.socket.on('new_message', callback);
  }

  onMessageSent(callback: (message: any) => void): void {
    if (!this.socket) return;
    this.socket.on('message_sent', callback);
  }

  onUserTyping(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('user_typing', callback);
  }

  onUserStopTyping(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('user_stop_typing', callback);
  }

  removeAllListeners(): void {
    if (!this.socket) return;
    this.socket.removeAllListeners();
  }
}

export default new SocketService();