import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByGoogleId(googleId: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { googleId } });
  }

  async createWithGoogle(profile: any): Promise<User> {
    const guestId = await this.generateGuestId();
    const rawPassword = `${profile.name}-${guestId}`;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const user = this.userRepo.create({
      googleId: profile.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      password: hashedPassword,
    });

    return await this.userRepo.save(user);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return this.userRepo.findOne({ where: { id } });
  }

  async createGuestUser({
    name,
    email,
    password,
  }: {
    password: string;
    name: string;
    email: string;
  }): Promise<User> {
    const guestId = await this.generateGuestId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      name,
      email,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${guestId}`,
    });

    return this.userRepo.save(user);
  }

  private async generateGuestId(): Promise<string> {
    return Math.floor(Math.random() * 1_000_000_000_000)
      .toString()
      .padStart(12, '0');
  }
}
