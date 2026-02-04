// src/config/config.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { initializeFirebaseOnStartup } from './firebase-admin.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class CustomConfigModule {
  constructor() {
    // Initialiser Firebase après le chargement des variables d'environnement
    initializeFirebaseOnStartup();
  }
}