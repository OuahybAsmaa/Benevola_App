import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; // ✅ AJOUTER

@WebSocketGateway({
  cors: {
    origin: '*', // À adapter selon vos besoins de sécurité
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagesGateway.name);
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, // ✅ AJOUTER
  ) {}

  // Connexion d'un client
  async handleConnection(client: Socket) {
    try {
      // Récupérer le token depuis l'authentification
      const token = client.handshake.auth.token || 
                    client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        this.logger.warn('Client sans token tenté de se connecter');
        client.disconnect();
        return;
      }

      // ✅ Vérifier le token AVEC le secret
      const secret = this.configService.get<string>('JWT_SECRET') || 'secret_key';
      
      this.logger.log(`🔑 Vérification du token avec secret: ${secret ? 'OK' : 'MANQUANT'}`);
      
      const payload = this.jwtService.verify(token, { secret });
      
      this.logger.log(`🔍 Payload décodé:`, payload);
      
      // ✅ Gérer différents formats de payload JWT
      const userId = payload.sub || payload.userId || payload.id;

      if (!userId) {
        this.logger.warn('Token valide mais sans userId. Payload:', payload);
        client.disconnect();
        return;
      }

      // Stocker la connexion
      this.connectedUsers.set(userId, client.id);
      client.data.userId = userId;

      this.logger.log(`✅ Client connecté: ${userId} (socket: ${client.id})`);

      // Notifier l'utilisateur de sa connexion réussie
      client.emit('connected', { userId });

      // Envoyer le nombre de messages non lus
      const unreadCount = await this.messagesService.getUnreadCount(userId);
      client.emit('unread_count', { count: unreadCount });

    } catch (error) {
      this.logger.error('❌ Erreur lors de la connexion WebSocket:', error.message);
      this.logger.error('Stack trace:', error.stack);
      client.disconnect();
    }
  }

  // Déconnexion d'un client
  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      this.logger.log(`Client déconnecté: ${userId}`);
    }
  }

  // Envoyer un message
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto,
  ) {
    try {
      const senderId = client.data.userId;

      if (!senderId) {
        throw new Error('Utilisateur non authentifié');
      }

      // Créer le message dans la base de données
      const message = await this.messagesService.create(senderId, data);

      // Envoyer au destinataire s'il est connecté
      const receiverSocketId = this.connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('new_message', message);
        this.logger.log(`📨 Message envoyé au destinataire (socket: ${receiverSocketId})`);
      } else {
        this.logger.log(`📭 Destinataire hors ligne: ${data.receiverId}`);
      }

      // Confirmer au sender
      client.emit('message_sent', message);

      this.logger.log(`✅ Message envoyé de ${senderId} à ${data.receiverId}`);

      return { success: true, message };
    } catch (error) {
      this.logger.error('❌ Erreur envoi message:', error);
      client.emit('error', { message: 'Erreur lors de l\'envoi du message' });
      return { success: false, error: error.message };
    }
  }

  // Marquer comme lu
  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { senderId: string; missionId?: string },
  ) {
    try {
      const userId = client.data.userId;
      
      if (!userId) {
        throw new Error('Utilisateur non authentifié');
      }

      await this.messagesService.markAsRead(userId, data.senderId, data.missionId);

      // Notifier le sender que ses messages ont été lus
      const senderSocketId = this.connectedUsers.get(data.senderId);
      if (senderSocketId) {
        this.server.to(senderSocketId).emit('messages_read', {
          readBy: userId,
          missionId: data.missionId,
        });
      }

      client.emit('marked_as_read', { success: true });
      
      this.logger.log(`✅ Messages marqués comme lus: ${data.senderId} -> ${userId}`);
    } catch (error) {
      this.logger.error('❌ Erreur mark as read:', error);
      client.emit('error', { message: 'Erreur lors du marquage comme lu' });
    }
  }

  // L'utilisateur commence à taper
  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: string; missionId?: string },
  ) {
    const receiverSocketId = this.connectedUsers.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('user_typing', {
        userId: client.data.userId,
        missionId: data.missionId,
      });
    }
  }

  // L'utilisateur arrête de taper
  @SubscribeMessage('stop_typing')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: string; missionId?: string },
  ) {
    const receiverSocketId = this.connectedUsers.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('user_stop_typing', {
        userId: client.data.userId,
        missionId: data.missionId,
      });
    }
  }
}