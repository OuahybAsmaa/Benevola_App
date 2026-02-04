// src/messages/messages.service.ts (MODIFIÉ)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    // ⭐ AJOUT: Injecter le service de notifications
    private notificationsService: NotificationsService,
  ) {}

  // Créer un nouveau message (MODIFIÉ)
  async create(
    senderId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const message = this.messagesRepository.create({
      senderId,
      receiverId: createMessageDto.receiverId,
      missionId: createMessageDto.missionId,
      content: createMessageDto.content,
    });

    const savedMessage = await this.messagesRepository.save(message);

    // ⭐ NOUVEAU: Créer une notification pour le destinataire
    try {
      // Récupérer les infos de l'expéditeur
      const sender = await this.messagesRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .where('message.id = :id', { id: savedMessage.id })
        .getOne();

      let missionTitle: string | undefined;
      if (createMessageDto.missionId) {
        // Récupérer le titre de la mission si disponible
        const messageWithMission = await this.messagesRepository
          .createQueryBuilder('message')
          .leftJoinAndSelect('message.mission', 'mission')
          .where('message.id = :id', { id: savedMessage.id })
          .getOne();
        
        missionTitle = messageWithMission?.mission?.title;
      }

      const senderName = sender?.sender 
        ? `${sender.sender.firstName} ${sender.sender.lastName}` 
        : 'Un utilisateur';

      // ⭐ CORRECTION IMPORTANTE: Passer senderId au lieu de receiverId
      await this.notificationsService.createMessageNotification(
        createMessageDto.receiverId, // receiverId (destinataire de la notification)
        senderName,
        missionTitle,
        createMessageDto.missionId,
        senderId, // ⭐ AJOUT: ID de l'expéditeur du message
      );
    } catch (error) {
      console.error('❌ Erreur création notification:', error);
      // Ne pas bloquer l'envoi du message si la notification échoue
    }

    return savedMessage;
  }

  // Récupérer les messages d'une conversation
  async getConversation(
    userId: string,
    otherUserId: string,
    missionId?: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{
    messages: Message[];
    total: number;
    hasMore: boolean;
  }> {
    const query = this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .leftJoinAndSelect('message.mission', 'mission')
      .where(
        '((message.senderId = :userId AND message.receiverId = :otherUserId) OR ' +
          '(message.senderId = :otherUserId AND message.receiverId = :userId))',
        { userId, otherUserId },
      );

    if (missionId) {
      query.andWhere('message.missionId = :missionId', { missionId });
    }

    const total = await query.getCount();
    const messages = await query
      .orderBy('message.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      messages: messages.reverse(),
      total,
      hasMore: total > page * limit,
    };
  }

  // Récupérer toutes les conversations d'un utilisateur
  async getUserConversations(userId: string): Promise<any[]> {
    const messages = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .leftJoinAndSelect('message.mission', 'mission')
      .where('message.senderId = :userId OR message.receiverId = :userId', { userId })
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    const conversationsMap = new Map<string, any>();

    for (const message of messages) {
      const otherUserId =
        message.senderId === userId ? message.receiverId : message.senderId;

      const conversationKey = `${otherUserId}-${message.missionId || 'no-mission'}`;

      if (!conversationsMap.has(conversationKey)) {
        conversationsMap.set(conversationKey, {
          userId: otherUserId,
          userName:
            message.senderId === userId
              ? `${message.receiver.firstName} ${message.receiver.lastName}`
              : `${message.sender.firstName} ${message.sender.lastName}`,
          userAvatar:
            message.senderId === userId
              ? message.receiver.avatar
              : message.sender.avatar,
          missionId: message.missionId,
          missionTitle: message.mission?.title,
          lastMessage: message,
          unreadCount: 0,
        });
      }

      if (message.receiverId === userId && !message.isRead) {
        conversationsMap.get(conversationKey).unreadCount++;
      }
    }

    return Array.from(conversationsMap.values());
  }

  // Marquer les messages comme lus
  async markAsRead(
    userId: string,
    senderId: string,
    missionId?: string,
  ): Promise<void> {
    const query = this.messagesRepository
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where(
        'receiverId = :userId AND senderId = :senderId AND isRead = false',
        { userId, senderId },
      );

    if (missionId) {
      query.andWhere('missionId = :missionId', { missionId });
    }

    await query.execute();
  }

  // Compter les messages non lus
  async getUnreadCount(userId: string): Promise<number> {
    return await this.messagesRepository.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }
}