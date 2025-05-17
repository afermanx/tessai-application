import { DataSource, DataSourceOptions } from 'typeorm';
import { internals } from '../config';
import * as path from 'path';
import { SnakeNamingStrategy } from './SnakeNamingStrategy';
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: internals.dbHost,
  port: internals.dbPort,
  username: internals.dbUser,
  password: internals.dbPass,
  database: internals.dbName,
  entities: [path.resolve(__dirname, '../entities/*{.ts,.js}')],
  migrations: [path.resolve(__dirname, './migrations/*{.ts,.js}')],
  namingStrategy: new SnakeNamingStrategy(),
};

export default new DataSource(dataSourceOptions);
