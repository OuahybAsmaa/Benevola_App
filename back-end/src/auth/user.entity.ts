// src/auth/entities/user.entity.ts  (ou le chemin où est ton User)
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// src/auth/user.entity.ts (ou le chemin où est ton User)

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'first_name' })   // ← Ajoute name: 'first_name'
  firstName: string;

  @Column({ name: 'last_name' })    // ← Pareil pour lastName
  lastName: string;

  @Column({ nullable: true, name: 'phone' })
  phone?: string;

  @Column({ default: 'benevole' })
  role: 'benevole' | 'organisation';

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  refreshToken?: string | null;
}