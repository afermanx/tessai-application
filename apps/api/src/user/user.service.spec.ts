import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  const mockUser = {
    id: 1,
    googleId: 'google123',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'avatar.png',
    password: 'hashedpass',
  };

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByGoogleId', () => {
    it('should return user if found', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);
      const user = await service.findByGoogleId('google123');
      expect(user).toEqual(mockUser);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { googleId: 'google123' },
      });
    });

    it('should return null if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const user = await service.findByGoogleId('notfound');
      expect(user).toBeNull();
    });
  });

  describe('createWithGoogle', () => {
    it('should create and save a new user', async () => {
      jest
        .spyOn(service as any, 'generateGuestId')
        .mockResolvedValue('123456789012');
      jest
        .spyOn(service as any, 'generateGuestId')
        .mockResolvedValue('123456789012');
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hashedPassword'));
      mockRepo.create.mockReturnValue(mockUser);
      mockRepo.save.mockResolvedValue(mockUser);

      const profile = {
        id: 'google123',
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'avatar.png',
      };
      const user = await service.createWithGoogle(profile);

      expect(service['generateGuestId']).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('Test User-123456789012', 10);
      expect(mockRepo.create).toHaveBeenCalledWith({
        googleId: 'google123',
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'avatar.png',
        password: 'hashedPassword',
      });
      expect(mockRepo.save).toHaveBeenCalledWith(mockUser);
      expect(user).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);
      const user = await service.findById(1);
      expect(user).toEqual(mockUser);
      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createGuestUser', () => {
    beforeEach(() => {
      jest
        .spyOn(service as any, 'generateGuestId')
        .mockResolvedValue('123456789012');
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hashedGuestPassword')); // retorna "hashedGuestPassword"
    });

    it('should create and save guest user', async () => {
      const createSpy = jest.spyOn(mockRepo, 'create');
      const saveSpy = jest
        .spyOn(mockRepo, 'save')
        .mockResolvedValue({} as User);

      await service.createGuestUser({
        name: 'Guest',
        email: 'guest@example.com',
        password: 'plainpass',
      });

      expect(service['generateGuestId']).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('plainpass', 10);
      expect(createSpy).toHaveBeenCalledWith({
        name: 'Guest',
        email: 'guest@example.com',
        password: 'hashedGuestPassword', // aqui tem que bater com o mock do bcrypt.hash
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=123456789012',
      });
      expect(saveSpy).toHaveBeenCalled();
    });
  });
});
