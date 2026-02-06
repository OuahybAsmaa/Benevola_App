import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const { password, refreshToken, ...userProfile } = user;
    return userProfile;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (updateProfileDto.firstName !== undefined) {
      user.firstName = updateProfileDto.firstName;
    }
    if (updateProfileDto.lastName !== undefined) {
      user.lastName = updateProfileDto.lastName;
    }
    if (updateProfileDto.phone !== undefined) {
      user.phone = updateProfileDto.phone;
    }

    const updatedUser = await this.userRepository.save(user);

    const { password, refreshToken, ...userProfile } = updatedUser;
    return userProfile;
  }

  async uploadAvatar(userId: string, avatarPath: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    user.avatar = avatarPath;
    const updatedUser = await this.userRepository.save(user);
    
    const { password, refreshToken, ...userProfile } = updatedUser;
    return userProfile;
  }
}