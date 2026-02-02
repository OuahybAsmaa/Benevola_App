import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MissionsModule } from './missions/missions.module'; // AJOUT
import { ProfileModule } from './profile/profile.module';
import { MissionParticipantsModule } from './mission-participants/mission-participants.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ASMAA',
      database: 'reactBENEVOLA',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    MissionsModule,
    ProfileModule, // AJOUT
    MissionParticipantsModule,
  ],
})
export class AppModule {}