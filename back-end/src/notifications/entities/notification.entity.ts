// src/notifications/entities/notification.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  ManyToOne,
  JoinColumn 
} from 'typeorm';
import { User } from '../../auth/user.entity';

export enum NotificationType {
  MESSAGE = 'message',
  MISSION = 'mission',
  REMINDER = 'reminder',
  CONFIRMATION = 'confirmation',
  ACHIEVEMENT = 'achievement',
  FRIEND = 'friend',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  // Données additionnelles (optionnel)
  @Column({ type: 'jsonb', nullable: true })
  data?: {
    missionId?: string;
    missionTitle?: string;
    senderId?: string;
    senderName?: string;
    messageId?: string;
    [key: string]: any;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}