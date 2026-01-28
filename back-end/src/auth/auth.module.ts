import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm'; // AJOUT
import { User } from './user.entity'; // AJOUT

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // AJOUT : Injecte le repo User
    JwtModule.register({
      secret: 'secret_key', // Change en prod (utilise env vars)
      signOptions: { expiresIn: '15m' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}