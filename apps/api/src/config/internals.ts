import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config();

const configService = new ConfigService();

export const internals = {
  dbHost: configService.get<string>('DATABASE_HOST'),
  dbPort: configService.get<number>('DATABASE_PORT'),
  dbUser: configService.get<string>('MYSQL_USER'),
  dbPass: configService.get<string>('MYSQL_PASSWORD'),
  dbName: configService.get<string>('MYSQL_DB'),
  authSecret: configService.get<string>('JWT_SECRET'),
  appPort: configService.get<number>('PORT'),
  frontendUrl: configService.get<string>('FRONTEND_URL'),
  isDev: configService.get<string>('NODE_ENV') === 'development',
} as const;
