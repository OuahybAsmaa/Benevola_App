// src/hooks/useSocket.ts
import { useEffect, useState, useCallback } from 'react';
import socketService from '../config/socket.config';
import { Message } from '../api/messages';

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
 
  const [newMessage, setNewMessage] = useState<Message | null>(null);

  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
 
    const connectSocket = async () => {
      try {
        await socketService.connect();
        setConnected(true);


        socketService.onNewMessage((message: Message) => {
          setNewMessage(message);
        });


        socketService.onUserTyping((data: { userId: string }) => {
          setTypingUsers((prev: Set<string>) => new Set(prev).add(data.userId));
        });

        socketService.onUserStopTyping((data: { userId: string }) => {
          setTypingUsers((prev: Set<string>) => {
            const newSet = new Set(prev);
            newSet.delete(data.userId);
            return newSet;
          });
        });
      } catch (error) {
        console.error('Erreur connexion socket:', error);
        setConnected(false);
      }
    };

    connectSocket();

    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
      setConnected(false);
    };
  }, []);

  const sendMessage = useCallback((receiverId: string, content: string, missionId?: string) => {
    try {
      socketService.sendMessage(receiverId, content, missionId);
    } catch (error) {
      console.error('Erreur envoi message:', error);
      throw error;
    }
  }, []);

  const markAsRead = useCallback((senderId: string, missionId?: string) => {
    try {
      socketService.markAsRead(senderId, missionId);
    } catch (error) {
      console.error('Erreur mark as read:', error);
    }
  }, []);

  const sendTyping = useCallback((receiverId: string, missionId?: string) => {
    socketService.sendTyping(receiverId, missionId);
  }, []);

  const sendStopTyping = useCallback((receiverId: string, missionId?: string) => {
    socketService.sendStopTyping(receiverId, missionId);
  }, []);

  return {
    connected,
    newMessage,
    typingUsers,
    sendMessage,
    markAsRead,
    sendTyping,
    sendStopTyping,
  };
};