// src/notifications/dto/create-notification.dto.ts
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @IsOptional()
  data?: {
    missionId?: string;
    missionTitle?: string;
    senderId?: string;
    senderName?: string;
    messageId?: string;
    [key: string]: any;
  };
}

export class MarkAsReadDto {
  @IsNotEmpty()
  @IsString()
  notificationId: string;
}

export class GetNotificationsDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 20;

  @IsOptional()
  isRead?: boolean;
}