import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ✅ Importer ConfigModule
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { NotificationsModule } from '../notifications/notifications.module'; // ⭐ AJOUT

@Module({
  imports: [
    ConfigModule, // ✅ AJOUTER ConfigModule ici !
    TypeOrmModule.forFeature([Message]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'secret_key',
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    NotificationsModule,
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesGateway,
    JwtStrategy,
  ],
  exports: [MessagesService],
})
export class MessagesModule {}