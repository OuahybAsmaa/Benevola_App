import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  private async addParticipantCount(mission: Mission): Promise<any> {
    const participantCount = await this.participantsService.countParticipants(mission.id);
    return {
      ...mission,
      currentParticipants: participantCount,
    };
  }

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

    return this.addParticipantCounts(missions);
  }

  async findOne(id: string): Promise<any> {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    const updatedMission = await this.checkAndUpdateMissionStatus(mission);
    return this.addParticipantCount(updatedMission);
  }

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

    return this.addParticipantCounts(missions);
  }

  async findFinishedByOrganizer(organizerId: string): Promise<any[]> {
    await this.syncExpiredMissions(organizerId);

    const missions = await this.missionRepository.find({
      where: { organizerId, status: 'finished' },
      relations: ['organizer'],
      order: { updatedAt: 'DESC' },
    });

    return this.addParticipantCounts(missions);
  }

  async findNearby(latitude: number, longitude: number, radiusInMeters: number): Promise<any[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const missions = await this.missionRepository
      .createQueryBuilder('mission')
      .leftJoinAndSelect('mission.organizer', 'organizer')
      .addSelect(
        `ST_Distance(
          mission.position::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
        )`,
        'distance'
      )
      .where('mission.status = :status', { status: 'active' })
      .andWhere('mission.date >= :today', { today })
      .andWhere(
        `ST_DWithin(
          mission.position::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          :radius
        )`
      )
      .setParameters({ 
        lng: longitude,    
        lat: latitude,     
        radius: radiusInMeters 
      })
      .orderBy('distance', 'ASC')
      .getRawAndEntities();

    const missionsWithDistance = missions.entities.map((mission, index) => {
      const distanceValue = missions.raw[index].distance;
      return {
        ...mission,
        distance: distanceValue,
      };
    });

    return this.addParticipantCounts(missionsWithDistance);
  }

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
    
    return this.addParticipantCount(savedMission);
  }

  async delete(id: string, organizerId: string): Promise<void> {
    const mission = await this.missionRepository.findOne({ where: { id } });

    if (!mission) {
      throw new NotFoundException('Mission introuvable');
    }

    if (mission.organizerId !== organizerId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres missions');
    }

    const participantCount = await this.participantsService.countParticipants(id);

    if (participantCount > 0) {
      throw new BadRequestException(
        'Impossible de supprimer cette mission : des bénévoles sont déjà inscrits.'
      );
    }

    await this.missionRepository.remove(mission);
  }
}