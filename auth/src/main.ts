import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const configService = new ConfigService();

async function bootstrap() {
  const PORT = +configService.get('PORT');

  const app = await NestFactory.create(AppModule);
  const kafkaMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats'],
      },
    });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());

  await app.listen(PORT);
  await kafkaMicroservice.listen();
}
bootstrap();
