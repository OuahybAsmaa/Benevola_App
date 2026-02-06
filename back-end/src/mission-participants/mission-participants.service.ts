// src/mission-participants/mission-participants.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MissionParticipant } from './mission-participant.entity';
import { Mission } from '../missions/mission.entity';

@Injectable()
export class MissionParticipantsService {
  constructor(
    @InjectRepository(MissionParticipant)
    private participantRepository: Repository<MissionParticipant>,
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
  ) {}

  async register(missionId: string, userId: string): Promise<MissionParticipant> {
    // Récupérer la mission
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
    });

    if (!mission) {
      throw new NotFoundException('Mission non trouvée');
    }

    // Vérifier que la mission est bien active
    if (mission.status !== 'active') {
      throw new BadRequestException('Cette mission n\'est plus disponible');
    }

    // Vérifier que l'utilisateur n'est pas déjà inscrit
    const existingRegistration = await this.participantRepository.findOne({
      where: { 
        missionId, 
        userId,
        status: 'registered' 
      },
    });

    if (existingRegistration) {
      throw new BadRequestException('Vous êtes déjà inscrit à cette mission');
    }

    // Compter le nombre de participants actuels
    const currentParticipants = await this.participantRepository.count({
      where: { 
        missionId,
        status: 'registered'
      },
    });

    // Vérifier si la mission est complète
    if (currentParticipants >= mission.maxParticipants) {
      throw new BadRequestException('Cette mission est complète');
    }

    // Créer l'inscription
    const participant = this.participantRepository.create({
      missionId,
      userId,
      status: 'registered',
    });

    await this.participantRepository.save(participant);

    // Vérifier si la mission devient complète après cette inscription
    const newCount = currentParticipants + 1;
    if (newCount >= mission.maxParticipants) {
      mission.status = 'complete';
      await this.missionRepository.save(mission);
    }

    return participant;
  }

  async unregister(missionId: string, userId: string): Promise<void> {
    const participant = await this.participantRepository.findOne({
      where: { 
        missionId, 
        userId,
        status: 'registered'
      },
    });

    if (!participant) {
      throw new NotFoundException('Inscription non trouvée');
    }

    // Marquer comme annulé
    participant.status = 'cancelled';
    await this.participantRepository.save(participant);

    // Récupérer la mission
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
    });

    if (mission && mission.status === 'complete') {
      // Compter les participants restants
      const remainingParticipants = await this.participantRepository.count({
        where: { 
          missionId,
          status: 'registered'
        },
      });

      // Si on passe sous la limite, repasser en 'active'
      if (remainingParticipants < mission.maxParticipants) {
        mission.status = 'active';
        await this.missionRepository.save(mission);
      }
    }
  }

  async getParticipants(missionId: string) {
    return this.participantRepository.find({
      where: { 
        missionId,
        status: 'registered'
      },
      relations: ['user'],
      order: { registeredAt: 'ASC' },
    });
  }

  async getUserMissions(userId: string) {
    return this.participantRepository.find({
      where: { 
        userId,
        status: 'registered'
      },
      relations: ['mission', 'mission.organizer'],
      order: { registeredAt: 'DESC' },
    });
  }


  async isUserRegistered(missionId: string, userId: string): Promise<boolean> {
    const count = await this.participantRepository.count({
      where: { 
        missionId, 
        userId,
        status: 'registered'
      },
    });

    return count > 0;
  }

  async countParticipants(missionId: string): Promise<number> {
    return this.participantRepository.count({
      where: { 
        missionId,
        status: 'registered'
      },
    });
  }


  async getParticipantCounts(missionIds: string[]): Promise<Map<string, number>> {
    if (missionIds.length === 0) {
      return new Map();
    }

    const counts = await this.participantRepository
      .createQueryBuilder('participant')
      .select('participant.missionId', 'missionId')
      .addSelect('COUNT(*)', 'count')
      .where('participant.missionId IN (:...missionIds)', { missionIds })
      .andWhere('participant.status = :status', { status: 'registered' })
      .groupBy('participant.missionId')
      .getRawMany();

    const countMap = new Map<string, number>();
    counts.forEach(({ missionId, count }) => {
      countMap.set(missionId, parseInt(count, 10));
    });

    return countMap;
  }
}