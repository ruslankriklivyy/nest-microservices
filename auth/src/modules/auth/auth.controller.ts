import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { RequestWithUser } from '../../types/common/RequestWithUser';
import { TokensService } from '../tokens/tokens.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @Post('login')
  async login(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;

    const { cookie: accessTokenCookie, token: accessToken } =
      this.tokensService.generateAccessTokenCookie(user);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.tokensService.generateRefreshTokenCookie(user);

    await this.tokensService.create({
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: user.id,
    });

    response.setHeader(
      'Set-Cookie',
      `${accessTokenCookie} ${refreshTokenCookie}`,
    );

    user.password = undefined;

    return response.send(user);
  }

  @HttpCode(200)
  @Post('register')
  async register(@Res() response: Response, @Body() payload: RegisterDto) {
    const user = await this.authService.register(payload);

    const { cookie: accessTokenCookie, token: accessToken } =
      this.tokensService.generateAccessTokenCookie(user);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.tokensService.generateRefreshTokenCookie(user);

    await this.tokensService.create({
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: user.id,
    });

    response.setHeader(
      'Set-Cookie',
      `${accessTokenCookie} ${refreshTokenCookie}`,
    );

    user.password = undefined;

    return response.send(user);
  }
}
