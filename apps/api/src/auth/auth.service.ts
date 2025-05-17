import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../entities/User';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateOAuthLogin(
    profile: any,
  ): Promise<{ user: User; token: string }> {
    let user = await this.userService.findByGoogleId(profile.id);
    if (!user) {
      user = await this.userService.createWithGoogle(profile);
    }

    const token = this.jwtService.sign({ sub: user.id });
    return { user, token };
  }
}
