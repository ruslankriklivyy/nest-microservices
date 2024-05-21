import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PostgresErrorCodes } from '../../enums/database/PostgresErrorCodes.enum';
import { SuccessResponseDto } from '../../shared/dto/success-response.dto';
import { FailureResponseDto } from '../../shared/dto/failure-response.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('create_user')
  async create(@Payload() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);
      return new SuccessResponseDto({
        status: HttpStatus.OK,
        data: newUser,
        success: true,
        message: 'User created successfully.',
      }).getResponse();
    } catch (error) {
      if (error?.code === PostgresErrorCodes.UniqueViolation) {
        return new FailureResponseDto({
          success: false,
          message: 'User with that email already exists',
          status: HttpStatus.BAD_REQUEST,
        }).getResponse();
      }

      return new FailureResponseDto({
        success: false,
        message: 'Something went wrong',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @MessagePattern('find_users')
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('find_user')
  findOne(@Payload() id: number) {
    return this.usersService.findOne(id);
  }

  @MessagePattern('find_user_by_email')
  async findByEmail(@Payload() email: string) {
    const user = await this.usersService.findByEmail(email);
    return JSON.stringify(user);
  }

  @MessagePattern('update_user')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('remove_user')
  remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }
}
