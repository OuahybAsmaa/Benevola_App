// src/missions/mission.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity('missions')
export class Mission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 100 })
  category: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @Column({ length: 50, nullable: true })
  duration?: string;

  @Column({ length: 500 })
  location: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  position?: any; 

  @Column({ name: 'max_participants', type: 'int' })
  maxParticipants: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 500, nullable: true })
  image?: string;

  @Column({ name: 'organizer_id' })
  organizerId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'organizer_id' })
  organizer: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ length: 20, default: 'active' })
  status: string; 
}