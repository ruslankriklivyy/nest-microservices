import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SeederOptions } from 'typeorm-extension';

config();

const configService = new ConfigService();

const typeOrmOptions: TypeOrmModuleOptions & SeederOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: parseInt(configService.get('POSTGRES_PORT')),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [__dirname + '/../**/*/*.entity.{ts,js}'],
  autoLoadEntities: true,
  seedTableName: 'seeds',
  seedName: 'seeds',
  seeds: ['src/db/seeds/**/*{.ts,.js}'],
  factories: ['src/db/factories/**/*{.ts,.js}'],
};

export const datasource = new DataSource({
  ...typeOrmOptions,

  migrationsTableName: '_migrations',
  migrations: ['dist/db/migrations/*{.ts,.js}'],

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  cli: {
    migrationDir: 'src/db/migrations',
  },
});

datasource.initialize();

export default { datasource };
