// src/mission-participants/mission-participant.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn 
} from 'typeorm';
import { Mission } from '../missions/mission.entity';
import { User } from '../auth/user.entity';

@Entity('mission_participants')
export class MissionParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'mission_id' })
  missionId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Mission)
  @JoinColumn({ name: 'mission_id' })
  mission: Mission;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'registered_at' })
  registeredAt: Date;

  @Column({ length: 20, default: 'registered' })
  status: string; // 'registered' | 'cancelled'
}