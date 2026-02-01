import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // ⭐ Configuration des fichiers statiques (uploads)
  const uploadsPath = join(__dirname, '..', 'uploads');
  console.log('📁 Chemin uploads:', uploadsPath);
  
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });
  
  // ⭐ Configuration CORS pour React Native
  app.enableCors({
    origin: '*', // En production, spécifiez votre domaine
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const port = process.env.PORT ?? 3000;
  
  await app.listen(port, '0.0.0.0'); // '0.0.0.0' pour être accessible sur le réseau local
  
  console.log('✅ Serveur NestJS démarré');
  console.log(`🌐 URL: http://localhost:${port}`);
  console.log(`📱 URL réseau: http://192.168.0.105:${port}`);
  console.log(`📁 Uploads: http://192.168.0.105:${port}/uploads/`);
}
bootstrap();