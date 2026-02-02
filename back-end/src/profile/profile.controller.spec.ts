import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+212600000000',
    role: 'benevole',
    avatar: null,
  };

  const mockProfileService = {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    uploadAvatar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      mockProfileService.getProfile.mockResolvedValue(mockUser);

      const req = { user: { sub: mockUser.id } };
      const result = await controller.getProfile(req);

      expect(result).toEqual(mockUser);
      expect(service.getProfile).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const updatedUser = { ...mockUser, ...updateDto };
      mockProfileService.updateProfile.mockResolvedValue(updatedUser);

      const req = { user: { sub: mockUser.id } };
      const result = await controller.updateProfile(req, updateDto);

      expect(result).toEqual(updatedUser);
      expect(service.updateProfile).toHaveBeenCalledWith(mockUser.id, updateDto);
    });
  });

  describe('uploadAvatar', () => {
    it('should upload avatar', async () => {
      const file = {
        filename: 'avatar-123.jpg',
        originalname: 'photo.jpg',
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const updatedUser = { ...mockUser, avatar: '/uploads/avatars/avatar-123.jpg' };
      mockProfileService.uploadAvatar.mockResolvedValue(updatedUser);

      const req = { user: { sub: mockUser.id } };
      const result = await controller.uploadAvatar(req, file);

      expect(result).toEqual(updatedUser);
      expect(service.uploadAvatar).toHaveBeenCalledWith(
        mockUser.id,
        '/uploads/avatars/avatar-123.jpg',
      );
    });
  });
});