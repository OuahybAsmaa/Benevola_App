// src/mission-participants/mission-participants.controller.ts
import { 
  Controller, 
  Post, 
  Delete, 
  Get, 
  Param, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MissionParticipantsService } from './mission-participants.service';

@Controller('mission-participants')
export class MissionParticipantsController {
  constructor(
    private readonly participantsService: MissionParticipantsService,
  ) {}


  @UseGuards(AuthGuard('jwt'))
  @Post(':missionId/register')
  async register(@Param('missionId') missionId: string, @Req() req) {
    const userId = req.user.sub;
    return this.participantsService.register(missionId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':missionId/unregister')
  async unregister(@Param('missionId') missionId: string, @Req() req) {
    const userId = req.user.sub;
    await this.participantsService.unregister(missionId, userId);
    return { message: 'Désinscription réussie' };
  }


  @Get(':missionId/participants')
  async getParticipants(@Param('missionId') missionId: string) {
    return this.participantsService.getParticipants(missionId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('my-missions')
  async getMyMissions(@Req() req) {
    const userId = req.user.sub;
    return this.participantsService.getUserMissions(userId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get(':missionId/check-registration')
  async checkRegistration(@Param('missionId') missionId: string, @Req() req) {
    const userId = req.user.sub;
    const isRegistered = await this.participantsService.isUserRegistered(missionId, userId);
    const participantCount = await this.participantsService.countParticipants(missionId);
    
    return { 
      isRegistered,
      participantCount 
    };
  }
}