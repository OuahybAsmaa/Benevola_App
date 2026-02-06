import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ✅ AJOUTER
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { NotificationsModule } from '../notifications/notifications.module'; 


@Module({
  imports: [
    ConfigModule, 
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({ 
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'secret_key',
        signOptions: { expiresIn: '7d' }, 
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    NotificationsModule, 
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule], 
})
export class AuthModule {}