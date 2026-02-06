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
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagesGateway.name);
  private connectedUsers = new Map<string, string>();

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || 
                    client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }

      const secret = this.configService.get<string>('JWT_SECRET') || 'secret_key';
      
      const payload = this.jwtService.verify(token, { secret });
      
      const userId = payload.sub || payload.userId || payload.id;

      if (!userId) {
        client.disconnect();
        return;
      }

      this.connectedUsers.set(userId, client.id);
      client.data.userId = userId;

      client.emit('connected', { userId });

      const unreadCount = await this.messagesService.getUnreadCount(userId);
      client.emit('unread_count', { count: unreadCount });

    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
    }
  }

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

      const message = await this.messagesService.create(senderId, data);

      const receiverSocketId = this.connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('new_message', message);
      }

      client.emit('message_sent', message);

      return { success: true, message };
    } catch (error) {
      client.emit('error', { message: 'Erreur lors de l\'envoi du message' });
      return { success: false, error: error.message };
    }
  }

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

      const senderSocketId = this.connectedUsers.get(data.senderId);
      if (senderSocketId) {
        this.server.to(senderSocketId).emit('messages_read', {
          readBy: userId,
          missionId: data.missionId,
        });
      }

      client.emit('marked_as_read', { success: true });
    } catch (error) {
      client.emit('error', { message: 'Erreur lors du marquage comme lu' });
    }
  }

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