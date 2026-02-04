// src/hooks/useSocket.ts
import { useEffect, useState, useCallback } from 'react';
import socketService from '../config/socket.config';
import { Message } from '../api/messages';

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  // ✅ CORRECTION: Typer correctement newMessage avec Message | null
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  // ✅ CORRECTION: Spécifier le type du Set<string>
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Connecter au socket au montage
    const connectSocket = async () => {
      try {
        await socketService.connect();
        setConnected(true);

        // Écouter les nouveaux messages
        socketService.onNewMessage((message: Message) => {
          setNewMessage(message);
        });

        // ✅ CORRECTION: Typer explicitement le paramètre prev
        // Écouter les utilisateurs qui tapent
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

    // Déconnecter au démontage
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