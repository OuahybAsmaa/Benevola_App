import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const uploadsPath = join(__dirname, '..', 'uploads');
  
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const port = process.env.PORT ?? 3000;
  
  await app.listen(port, '0.0.0.0');
  
  console.log('Serveur NestJS démarré');
}
bootstrap();