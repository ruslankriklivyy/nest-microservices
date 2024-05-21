import { IsInt, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;

  @IsInt()
  user_id: number;
}
