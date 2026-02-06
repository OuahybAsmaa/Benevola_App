// src/mission-participants/mission-participants.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionParticipantsController } from './mission-participants.controller';
import { MissionParticipantsService } from './mission-participants.service';
import { MissionParticipant } from './mission-participant.entity';
import { Mission } from '../missions/mission.entity';
import { MissionsModule } from '../missions/missions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MissionParticipant, Mission]),
    forwardRef(() => MissionsModule), 
  ],
  controllers: [MissionParticipantsController],
  providers: [MissionParticipantsService],
  exports: [MissionParticipantsService], 
})
export class MissionParticipantsModule {}