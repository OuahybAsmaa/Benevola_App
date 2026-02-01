// src/missions/missions.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mission } from './mission.entity';

@Injectable()
export class MissionsService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
  ) {}

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
  };

  if (data.latitude && data.longitude) {
   missionData.position = {
  type: 'Point',
  coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
};
  }

  const newMission = await this.missionRepository.save(missionData);
  
  // Retourner la mission avec l'organisateur
  return this.findOne(newMission.id);
}

  
  async findAll(): Promise<Mission[]> {
    return this.missionRepository.find({
      relations: ['organizer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Mission> {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    return mission;
  }

  async findByOrganizer(organizerId: string): Promise<Mission[]> {
    return this.missionRepository.find({
      where: { organizerId },
      relations: ['organizer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findNearby(latitude: number, longitude: number, radiusInMeters: number): Promise<Mission[]> {
    return this.missionRepository
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
  }

  async update(id: string, organizerId: string, data: any): Promise<Mission> {
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
    return this.missionRepository.save(mission);
  }

  async delete(id: string, organizerId: string): Promise<void> {
    const mission = await this.findOne(id);

    if (mission.organizerId !== organizerId) {
      throw new ForbiddenException('You can only delete your own missions');
    }

    await this.missionRepository.remove(mission);
  }
}