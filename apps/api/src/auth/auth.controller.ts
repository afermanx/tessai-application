import { Controller, Get, Req, UseGuards, Post, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return { msg: 'Redirecting to Google...' };
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res: Response) {
    const { token } = await this.authService.validateOAuthLogin(req.user);
    return res.redirect(`${process.env.FRONTEND_URL}/redirect?token=${token}`);
  }
  @Post('guest')
  async guestLogin() {
    return this.authService.loginAsGuest();
  }
}
