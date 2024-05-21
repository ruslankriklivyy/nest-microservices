import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { TokensRepository } from './tokens.repository';

@Injectable()
export class TokensService {
  constructor(
    private readonly tokensRepository: TokensRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private client: ClientProxy,
  ) {}

  create(createTokenDto: CreateTokenDto) {
    return this.tokensRepository.store(createTokenDto);
  }

  findAll() {
    return this.tokensRepository.findAll();
  }

  findOne(id: number) {
    return this.tokensRepository.findById(id);
  }

  findByUser(userId: number, refreshToken: string) {
    return this.tokensRepository.findByUser(userId, refreshToken);
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return this.tokensRepository.updateOne(id, updateTokenDto);
  }

  remove(id: number) {
    return this.tokensRepository.destroy(id);
  }

  async updateRefreshToken(refreshToken: string, userId: number) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    await this.tokensRepository.update(
      { refresh_token: refreshToken, user_id: userId },
      { refresh_token: hashedRefreshToken },
    );
  }

  generateAccessTokenCookie(payload) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
    });
    const cookie = `Authentication=${token}; Path=/; Max-Age=${this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    return {
      cookie,
      token,
    };
  }

  generateRefreshTokenCookie(payload) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
    const cookie = `Refresh=${token}; Path=/; Max-Age=${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
    return {
      cookie,
      token,
    };
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const { data: user } = await firstValueFrom(
      this.client.send('find_user', userId),
    );

    if (!user) {
      return null;
    }

    const userToken = await this.findByUser(userId, refreshToken);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      userToken.refresh_token,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }
}
