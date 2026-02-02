// src/missions/missions.service.ts
import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Mission } from './mission.entity';
import { MissionParticipantsService } from '../mission-participants/mission-participants.service';

@Injectable()
export class MissionsService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @Inject(forwardRef(() => MissionParticipantsService))
    private participantsService: MissionParticipantsService,
  ) {}

  // ─────────────────────────────────────────────────────────
  // Vérifie si une mission doit être marquée comme 'finished'
  // (la date de la mission est dépassée et le statut est encore 'active')
  // ─────────────────────────────────────────────────────────
  private async checkAndUpdateMissionStatus(mission: Mission): Promise<Mission> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const missionDate = new Date(mission.date);
    missionDate.setHours(0, 0, 0, 0);

    if (missionDate < today && mission.status === 'active') {
      mission.status = 'finished';
      await this.missionRepository.save(mission);
    }

    return mission;
  }

  // ─────────────────────────────────────────────────────────
  // Met à jour en masse les missions expirées pour un organisateur
  // ─────────────────────────────────────────────────────────
  private async syncExpiredMissions(organizerId: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.missionRepository
      .createQueryBuilder()
      .update(Mission)
      .set({ status: 'finished' })
      .where('organizer_id = :organizerId', { organizerId })
      .andWhere('status = :status', { status: 'active' })
      .andWhere('date < :today', { today })
      .execute();
  }

  // ─────────────────────────────────────────────────────────
  // Ajouter le compte de participants à une mission
  // ─────────────────────────────────────────────────────────
  private async addParticipantCount(mission: Mission): Promise<any> {
    const participantCount = await this.participantsService.countParticipants(mission.id);
    return {
      ...mission,
      currentParticipants: participantCount,
    };
  }

  // ─────────────────────────────────────────────────────────
  // Ajouter le compte de participants à plusieurs missions
  // ─────────────────────────────────────────────────────────
  private async addParticipantCounts(missions: Mission[]): Promise<any[]> {
    if (missions.length === 0) {
      return [];
    }

    const missionIds = missions.map(m => m.id);
    const countsMap = await this.participantsService.getParticipantCounts(missionIds);

    return missions.map(mission => ({
      ...mission,
      currentParticipants: countsMap.get(mission.id) || 0,
    }));
  }

  // ─────────────────────────────────────────────────────────
  async create(data: any): Promise<Mission> {
    const missionData: any = {
      title: data.title,
      category: data.category,
      date: data.date,
      time: data.time,
      duration: data.duration,
      location: data.location,
      maxParticipants: parseInt(data.maxParticipants),
      description: data.description,
      image: data.image,
      organizerId: data.organizerId,
      status: 'active',
    };

    if (data.latitude && data.longitude) {
      missionData.position = {
        type: 'Point',
        coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
      };
    }

    const newMission = await this.missionRepository.save(missionData);
    return this.findOne(newMission.id);
  }

  // ─────────────────────────────────────────────────────────
  async findAll(): Promise<any[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.missionRepository
      .createQueryBuilder()
      .update(Mission)
      .set({ status: 'finished' })
      .where('status = :status', { status: 'active' })
      .andWhere('date < :today', { today })
      .execute();

    const missions = await this.missionRepository.find({
      where: { status: 'active' },
      relations: ['organizer'],
      order: { createdAt: 'DESC' },
    });

    // ⭐ AJOUTER LE COMPTE DES PARTICIPANTS
    return this.addParticipantCounts(missions);
  }

  // ─────────────────────────────────────────────────────────
  async findOne(id: string): Promise<any> {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    const updatedMission = await this.checkAndUpdateMissionStatus(mission);
    
    // ⭐ AJOUTER LE COMPTE DES PARTICIPANTS
    return this.addParticipantCount(updatedMission);
  }

  // ─────────────────────────────────────────────────────────
  async findByOrganizer(organizerId: string): Promise<any[]> {
    await this.syncExpiredMissions(organizerId);

    const missions = await this.missionRepository.find({
      where: [
        { organizerId, status: 'active' },
        { organizerId, status: 'complete' },
      ],
      relations: ['organizer'],
      order: { createdAt: 'DESC' },
    });

    // ⭐ AJOUTER LE COMPTE DES PARTICIPANTS
    return this.addParticipantCounts(missions);
  }

  // ─────────────────────────────────────────────────────────
  async findFinishedByOrganizer(organizerId: string): Promise<any[]> {
    await this.syncExpiredMissions(organizerId);

    const missions = await this.missionRepository.find({
      where: { organizerId, status: 'finished' },
      relations: ['organizer'],
      order: { updatedAt: 'DESC' },
    });

    // ⭐ AJOUTER LE COMPTE DES PARTICIPANTS
    return this.addParticipantCounts(missions);
  }

  // ─────────────────────────────────────────────────────────
  async findNearby(latitude: number, longitude: number, radiusInMeters: number): Promise<any[]> {
    const missions = await this.missionRepository
      .createQueryBuilder('mission')
      .leftJoinAndSelect('mission.organizer', 'organizer')
      .where(
        `ST_DWithin(
          position::geography,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
          :radius
        )`,
        { latitude, longitude, radius: radiusInMeters }
      )
      .orderBy('mission.createdAt', 'DESC')
      .getMany();

    // ⭐ AJOUTER LE COMPTE DES PARTICIPANTS
    return this.addParticipantCounts(missions);
  }

  // ─────────────────────────────────────────────────────────
  async update(id: string, organizerId: string, data: any): Promise<any> {
    const mission = await this.findOne(id);

    if (mission.organizerId !== organizerId) {
      throw new ForbiddenException('You can only update your own missions');
    }

    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.date !== undefined) updateData.date = data.date;
    if (data.time !== undefined) updateData.time = data.time;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.maxParticipants !== undefined) updateData.maxParticipants = parseInt(data.maxParticipants);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;

    if (data.latitude && data.longitude) {
      updateData.position = {
        type: 'Point',
        coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
      };
    }

    Object.assign(mission, updateData);
    const savedMission = await this.missionRepository.save(mission);
    
    // ⭐ AJOUTER LE COMPTE DES PARTICIPANTS
    return this.addParticipantCount(savedMission);
  }

  // ─────────────────────────────────────────────────────────
  async delete(id: string, organizerId: string): Promise<void> {
    const mission = await this.missionRepository.findOne({
      where: { id },
    });

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    if (mission.organizerId !== organizerId) {
      throw new ForbiddenException('You can only delete your own missions');
    }

    await this.missionRepository.remove(mission);
  }
}