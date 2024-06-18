import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PostgresErrorCodes } from '../../enums/database/PostgresErrorCodes.enum';
import { SuccessResponseDto } from '../../shared/dto/success-response.dto';
import { FailureResponseDto } from '../../shared/dto/failure-response.dto';
import { User } from './entities/user.entity';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('create_user')
  async create(@Payload() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);
      return new SuccessResponseDto<User>({
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
        message: 'Something went wrong.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @MessagePattern('find_users')
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return new SuccessResponseDto<User[]>({
        status: HttpStatus.OK,
        data: users,
        success: true,
        message: 'Fetch users successfully.',
      });
    } catch (error) {
      return new FailureResponseDto({
        success: false,
        message: 'Something went wrong.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @MessagePattern('find_user')
  async findOne(@Payload() id: number) {
    try {
      const user = await this.usersService.findOne(id);
      return new SuccessResponseDto<User>({
        status: HttpStatus.OK,
        data: user,
        success: true,
        message: 'Fetch user successfully',
      });
    } catch (error) {
      return new FailureResponseDto({
        success: false,
        message: 'Something went wrong.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @MessagePattern('find_user_by_email')
  async findByEmail(@Payload() email: string) {
    try {
      const userByEmail = await this.usersService.findByEmail(email);
      return new SuccessResponseDto<User>({
        status: HttpStatus.OK,
        data: userByEmail,
        success: true,
        message: 'Fetch user by email successfully',
      });
    } catch (error) {
      return new FailureResponseDto({
        success: false,
        message: 'Something went wrong.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @MessagePattern('update_user')
  async update(@Payload() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.usersService.update(
        updateUserDto.id,
        updateUserDto,
      );
      return new SuccessResponseDto<User>({
        status: HttpStatus.OK,
        data: updatedUser,
        success: true,
        message: 'Updated user successfully',
      });
    } catch (error) {
      return new FailureResponseDto({
        success: false,
        message: 'Something went wrong.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @MessagePattern('remove_user')
  async remove(@Payload() id: number) {
    try {
      await this.usersService.remove(id);
      return new SuccessResponseDto({
        status: HttpStatus.OK,
        success: true,
        message: 'User removed',
      });
    } catch (error) {
      return new FailureResponseDto({
        success: false,
        message: 'Something went wrong.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
