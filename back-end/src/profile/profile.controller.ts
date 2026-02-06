import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
@UseGuards(AuthGuard('jwt')) 
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Req() req) {
    return this.profileService.getProfile(req.user.sub);
  }

  @Put()
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.sub, updateProfileDto);
  }


  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return callback(
            new BadRequestException('Seules les images sont acceptées (jpg, jpeg, png, gif, webp)'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, 
      },
    }),
  )
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }
    const avatarPath = `/uploads/avatars/${file.filename}`;
    
    return this.profileService.uploadAvatar(req.user.sub, avatarPath);
  }
}