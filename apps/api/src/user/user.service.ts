import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  findByGoogleId(googleId: string): Promise<User> {
    return this.userRepo.findOne({ where: { googleId } });
  }

  createWithGoogle(profile: any): Promise<User> {
    const user = this.userRepo.create({
      googleId: profile.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
    });
    return this.userRepo.save(user);
  }

  findById(id: number): Promise<User> {
    return this.userRepo.findOne({ where: { id } });
  }
}
