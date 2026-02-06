// src/missions/missions.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';
import { Mission } from './mission.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MissionParticipantsModule } from '../mission-participants/mission-participants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mission]),
    MulterModule.register({
      dest: './uploads/missions',
    }),
    forwardRef(() => MissionParticipantsModule), 
  ],
  controllers: [MissionsController],
  providers: [MissionsService],
  exports: [MissionsService],
})
export class MissionsModule {}