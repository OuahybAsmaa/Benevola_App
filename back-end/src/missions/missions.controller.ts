// src/missions/missions.controller.ts
import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Req, 
  Get, 
  Param, 
  Put, 
  Delete,
  UseInterceptors,
  UploadedFile,
  Query
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { MissionsService } from './missions.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  // Créer une mission (avec upload d'image optionnel)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/missions',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `mission-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    }),
  )
  async create(
    @Req() req,
    @Body() createMissionDto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const organizerId = req.user.sub;
    const imagePath = file ? `/uploads/missions/${file.filename}` : null;
    
    return this.missionsService.create({
      ...createMissionDto,
      organizerId,
      image: imagePath,
    });
  }

  // Récupérer toutes les missions
  @Get()
  async findAll(@Query('latitude') lat?: string, @Query('longitude') lng?: string, @Query('radius') radius?: string) {
    if (lat && lng && radius) {
      return this.missionsService.findNearby(
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(radius)
      );
    }
    return this.missionsService.findAll();
  }

  // ⚠️ Ces routes spécifiques DOIVENT être avant @Get(':id')
  // sinon Express interprète "organizer" comme un :id

  // Récupérer les missions actives + completes de l'organisateur (dashboard)
  @UseGuards(AuthGuard('jwt'))
  @Get('organizer/my-missions')
  async getMyMissions(@Req() req) {
    return this.missionsService.findByOrganizer(req.user.sub);
  }

  // Récupérer les missions terminées de l'organisateur (historique profil)
  @UseGuards(AuthGuard('jwt'))
  @Get('organizer/my-finished-missions')
  async getMyFinishedMissions(@Req() req) {
    return this.missionsService.findFinishedByOrganizer(req.user.sub);
  }

  // Récupérer une mission par ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.missionsService.findOne(id);
  }

  // Mettre à jour une mission
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/missions',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `mission-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateMissionDto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imagePath = file ? `/uploads/missions/${file.filename}` : undefined;
    return this.missionsService.update(id, req.user.sub, {
      ...updateMissionDto,
      ...(imagePath && { image: imagePath }),
    });
  }

  // Supprimer une mission
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    return this.missionsService.delete(id, req.user.sub);
  }
}