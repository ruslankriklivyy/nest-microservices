import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NatsClientsModule } from '../../shared/clients.module';
import { TokensModule } from '../tokens/tokens.module';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Module({
  imports: [NatsClientsModule, TokensModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthGuard],
})
export class AuthModule {}
