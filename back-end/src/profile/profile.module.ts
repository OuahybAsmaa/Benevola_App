import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { User } from '../auth/user.entity'; // Importe User depuis auth

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Partage le repository User avec auth
    MulterModule.register({
      dest: './uploads/avatars',
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService], // Exporte le service si besoin ailleurs
})
export class ProfileModule {}