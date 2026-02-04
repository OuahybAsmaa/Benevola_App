import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MissionsModule } from './missions/missions.module'; // AJOUT
import { ProfileModule } from './profile/profile.module';
import { MissionParticipantsModule } from './mission-participants/mission-participants.module';
import { MessagesModule } from './messages/messages.module';
import { TesterModule } from './tester/tester.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CustomConfigModule } from './config/config.module'; // AJOUT


@Module({
  imports: [
    CustomConfigModule, // DOIT ÊTRE LE PREMIER
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ASMAA',
      database: 'reactBENEVOLA',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    MissionsModule,
    ProfileModule, // AJOUT
    MissionParticipantsModule, MessagesModule, TesterModule, NotificationsModule,
    
  ],
})
export class AppModule {}