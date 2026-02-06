// src/auth/entities/user.entity.ts 
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'first_name' })   
  firstName: string;

  @Column({ name: 'last_name' })  
  lastName: string;

  @Column({ nullable: true, name: 'phone' })
  phone?: string;

  @Column({ default: 'benevole' })
  role: 'benevole' | 'organisation';

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  refreshToken?: string | null;

  @Column({ name: 'fcm_token', type: 'text', nullable: true })
  fcmToken?: string | null;
}