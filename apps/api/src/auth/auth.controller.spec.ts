import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateOAuthLogin: jest.fn(),
    loginAsGuest: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(AuthGuard('google'))
      .useValue({
        canActivate: (context: ExecutionContext) => {
          // Simula que o usuário passou pelo Google e retornou com req.user preenchido
          const request = context.switchToHttp().getRequest();
          request.user = {
            id: 'google123',
            email: 'test@gmail.com',
            name: 'Test User',
            avatar: 'avatar.png',
          };
          return true;
        },
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /auth/google', () => {
    it('should return a redirect message', async () => {
      const result = await controller.googleAuth();
      expect(result).toEqual({ msg: 'Redirecting to Google...' });
    });
  });

  describe('GET /auth/google/callback', () => {
    it('should return user and token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@gmail.com',
        name: 'Test',
        avatar: 'a.png',
      };
      const mockToken = 'jwt_token_123';
      mockAuthService.validateOAuthLogin.mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const req = { user: { id: 'google123' } };
      const result = await controller.googleCallback(req);

      expect(mockAuthService.validateOAuthLogin).toHaveBeenCalledWith(req.user);
      expect(result).toEqual({ user: mockUser, token: mockToken });
    });
  });

  describe('POST /auth/guest', () => {
    it('should return guest user and token', async () => {
      const mockUser = {
        id: 999,
        email: 'guest@test.com',
        name: 'Convidado_1234',
      };
      const mockToken = 'guest_token_abc';
      mockAuthService.loginAsGuest.mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const result = await controller.guestLogin();

      expect(mockAuthService.loginAsGuest).toHaveBeenCalled();
      expect(result).toEqual({ user: mockUser, token: mockToken });
    });
  });
});
