import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module'; // Ton module auth

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Ou ton host (ex: 'db' si Docker)
      port: 5432,
      username: 'postgres',
      password: 'ASMAA',
      database: 'reactBENEVOLA',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Tes entités (on va les créer)
      synchronize: true, // Auto-créé les tables en dev (désactive en prod !)
      logging: true, // Pour debug
    }),
    AuthModule,
  ],
})
export class AppModule {}