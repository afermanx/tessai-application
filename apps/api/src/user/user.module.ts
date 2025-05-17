import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // <-- Necessário para injeção do Repository<User>
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // Opcional: útil se outro módulo (ex: AuthModule) precisar do UserService
})
export class UserModule {}
