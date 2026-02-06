import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(body: { email: string; password: string }): Promise<any> {
    if (!body.email || !body.password) {
      throw new UnauthorizedException('Email or password is missing');
    }

    const user = await this.userRepository.findOne({ where: { email: body.email } });
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, role: user.role, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    const refresh_token = uuidv4();
    user.refreshToken = refresh_token; // Stocke dans BDD
    await this.userRepository.save(user);

    return {
      message: 'Connexion réussie',
      access_token,
      refresh_token,
      user,
    };
  }





  async register(data: { firstName: string; lastName: string; email: string; password: string; role: 'benevole' | 'organisation' }): Promise<any> {
    const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
      avatar: '/diverse-user-avatars.png', // Default
    });

    await this.userRepository.save(user);

    const payload = { email: user.email, role: user.role, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    const refresh_token = uuidv4();
    user.refreshToken = refresh_token;
    await this.userRepository.save(user);

    return {
      message: 'Inscription réussie',
      access_token,
      refresh_token,
      user,
    };
  }

  
  async refreshAccessToken(refreshToken: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { refreshToken } });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { email: user.email, role: user.role, sub: user.id };
    const new_access_token = this.jwtService.sign(payload);

    return { access_token: new_access_token };
  }

  async logout(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.refreshToken = null;
      await this.userRepository.save(user);
    }
  }

async getUserById(id: string): Promise<User | null> {   
  return this.userRepository.findOne({ where: { id } });
}
}