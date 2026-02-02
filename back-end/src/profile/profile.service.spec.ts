import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileService } from './profile.service';
import { User } from '../auth/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProfileService', () => {
  let service: ProfileService;
  let repository: Repository<User>;

  const mockUser: User = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  password: 'hashedPassword',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+212600000000',
  role: 'benevole',
  avatar: undefined,
  refreshToken: undefined,
};


  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return a user profile without password and refreshToken', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile(mockUser.id);

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('refreshToken');
      expect(result.email).toBe(mockUser.email);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+212611111111',
      };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue({ ...mockUser, ...updateDto });

      const result = await service.updateProfile(mockUser.id, updateDto);

      expect(result.firstName).toBe(updateDto.firstName);
      expect(result.lastName).toBe(updateDto.lastName);
      expect(result.phone).toBe(updateDto.phone);
      expect(result).not.toHaveProperty('password');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const updateDto = {
        firstName: 'Jane',
      };

      const updatedUser = { ...mockUser, firstName: 'Jane' };
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(mockUser.id, updateDto);

      expect(result.firstName).toBe('Jane');
      expect(result.lastName).toBe(mockUser.lastName);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateProfile('invalid-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('uploadAvatar', () => {
    it('should update user avatar', async () => {
      const avatarPath = '/uploads/avatars/avatar-123.jpg';
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue({ ...mockUser, avatar: avatarPath });

      const result = await service.uploadAvatar(mockUser.id, avatarPath);

      expect(result.avatar).toBe(avatarPath);
      expect(result).not.toHaveProperty('password');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.uploadAvatar('invalid-id', '/path/to/avatar.jpg')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});