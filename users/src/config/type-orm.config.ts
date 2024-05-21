import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

config();

const configService = new ConfigService();

export default {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: parseInt(configService.get('POSTGRES_PORT')),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [__dirname + '/../**/*/*.entity.{ts,js}'],
  migrations: ['dist/db/migrations/*.ts'],

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  cli: {
    migrationDir: 'src/db/migrations',
  },
} as TypeOrmModuleOptions;
