import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';
import { FirebasePushService } from './firebase-push.service';
import { User } from '../auth/user.entity';
// ⭐ Supprimer l'import de AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User]), // ⭐ Seulement le repository User
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    FirebasePushService,
  ],
  exports: [
    NotificationsService,
    FirebasePushService,
  ],
})
export class NotificationsModule {}