import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokensService } from './tokens.service';
import { TokensRepository } from './tokens.repository';
import { NatsClientsModule } from '../../shared/clients.module';
import { Token } from './entities/token.entity';

@Module({
  imports: [NatsClientsModule, TypeOrmModule.forFeature([Token])],
  providers: [TokensService, TokensRepository],
  exports: [TokensService],
})
export class TokensModule {}
