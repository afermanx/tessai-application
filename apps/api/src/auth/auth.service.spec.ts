import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../entities/User';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token'),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByGoogleId: jest.fn(),
            createWithGoogle: jest.fn(),
            createGuestUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  describe('validateOAuthLogin', () => {
    it('should return user and token if user exists', async () => {
      const mockProfile = { id: 'google123' };
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        avatar: 'avatar.png',
      } as User;

      jest.spyOn(userService, 'findByGoogleId').mockResolvedValue(mockUser);

      const result = await authService.validateOAuthLogin(mockProfile);

      expect(userService.findByGoogleId).toHaveBeenCalledWith('google123');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        avatar: mockUser.avatar,
      });
      expect(result).toEqual({ user: mockUser, token: 'mocked-jwt-token' });
    });

    it('should create user if not found', async () => {
      const mockProfile = { id: 'google999', email: 'new@test.com' };
      const newUser = {
        id: 2,
        email: 'new@test.com',
        name: 'New User',
        avatar: 'avatar2.png',
      } as User;

      jest.spyOn(userService, 'findByGoogleId').mockResolvedValue(null);
      jest.spyOn(userService, 'createWithGoogle').mockResolvedValue(newUser);

      const result = await authService.validateOAuthLogin(mockProfile);

      expect(userService.createWithGoogle).toHaveBeenCalledWith(mockProfile);
      expect(result).toEqual({ user: newUser, token: 'mocked-jwt-token' });
    });
  });

  describe('loginAsGuest', () => {
    it('should create a guest user and return token', async () => {
      const guestUser = {
        id: 3,
        email: 'Convidado_1234@guest.local',
        name: 'Convidado_1234',
        avatar: 'avatar_guest.png',
      } as User;

      jest.spyOn(userService, 'createGuestUser').mockResolvedValue(guestUser);

      const result = await authService.loginAsGuest();

      expect(userService.createGuestUser).toHaveBeenCalledWith({
        name: expect.stringMatching(/^Convidado_/),
        email: expect.stringMatching(/@guest\.local$/),
        password: '123456',
      });

      expect(result).toEqual({ user: guestUser, token: 'mocked-jwt-token' });
    });
  });
  describe('validateOAuthLogin - error cases', () => {
    it('should throw if findByGoogleId throws', async () => {
      const mockProfile = { id: 'google123' };
      jest
        .spyOn(userService, 'findByGoogleId')
        .mockRejectedValue(new Error('DB error'));

      await expect(authService.validateOAuthLogin(mockProfile)).rejects.toThrow(
        'DB error',
      );
    });

    it('should throw if createWithGoogle throws', async () => {
      const mockProfile = { id: 'google123' };
      jest.spyOn(userService, 'findByGoogleId').mockResolvedValue(null);
      jest
        .spyOn(userService, 'createWithGoogle')
        .mockRejectedValue(new Error('Create error'));

      await expect(authService.validateOAuthLogin(mockProfile)).rejects.toThrow(
        'Create error',
      );
    });
  });

  describe('loginAsGuest - error case', () => {
    it('should throw if createGuestUser fails', async () => {
      jest
        .spyOn(userService, 'createGuestUser')
        .mockRejectedValue(new Error('Guest creation failed'));

      await expect(authService.loginAsGuest()).rejects.toThrow(
        'Guest creation failed',
      );
    });
  });
});
