import { IsEmail, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 255)
  password: string;

  @IsInt()
  @IsOptional()
  token_id: number;
}
