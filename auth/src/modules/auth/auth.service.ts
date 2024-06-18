import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  async register(payload: RegisterDto) {
    const hashedPassword = await bcrypt.hash(payload.password, 12);

    try {
      const createUserResponse = await lastValueFrom(
        this.userClient.send('create_user', {
          ...payload,
          password: hashedPassword,
        }),
      );

      if (!createUserResponse.success) {
        createUserResponse.data['password'] = undefined;
        return createUserResponse.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await lastValueFrom(
        this.userClient.send('find_user_by_email', email),
      );
      const isPasswordMatching = await bcrypt.compare(password, user.password);

      if (!isPasswordMatching) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      user.password = undefined;

      return user;
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
