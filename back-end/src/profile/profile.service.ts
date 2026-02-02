import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity'; // Importe depuis auth
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Récupère le profil de l'utilisateur par son ID
   */
  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Retourne l'utilisateur sans le mot de passe et le refreshToken
    const { password, refreshToken, ...userProfile } = user;
    return userProfile;
  }

  /**
   * Met à jour le profil de l'utilisateur
   */
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Mettre à jour uniquement les champs fournis
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
    
    // Retourne sans le mot de passe et le refreshToken
    const { password, refreshToken, ...userProfile } = updatedUser;
    return userProfile;
  }

  /**
   * Met à jour l'avatar de l'utilisateur
   */
  async uploadAvatar(userId: string, avatarPath: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    user.avatar = avatarPath;
    const updatedUser = await this.userRepository.save(user);
    
    // Retourne sans le mot de passe et le refreshToken
    const { password, refreshToken, ...userProfile } = updatedUser;
    return userProfile;
  }
}